"""
Windows ConPTY-backed interactive shells via pywinpty (uses native ConPTY when available).

Replaces line-at-a-time subprocess wrappers for CMD / PowerShell in the agent.
"""

from __future__ import annotations

import asyncio
import os
import pathlib
import platform
import threading
import time
from typing import Any, Callable, Coroutine

try:
    from winpty import PtyProcess

    _HAS_PTY = True
except ImportError:
    PtyProcess = None  # type: ignore[misc, assignment]
    _HAS_PTY = False


def pty_available() -> bool:
    return bool(_HAS_PTY and platform.system().lower() == "windows")


def _system32_env() -> dict[str, str]:
    env = dict(os.environ)
    root = env.get("SystemRoot", r"C:\Windows")
    p = pathlib.Path(root)
    paths = [
        str(p / "System32"),
        str(p / "System32" / "wbem"),
        str(p),
        str(p / "System32" / "WindowsPowerShell" / "v1.0"),
    ]
    cur = env.get("PATH", "")
    merged: list[str] = []
    for part in paths + cur.split(";"):
        q = part.strip().replace("/", "\\")
        if q and q not in merged:
            merged.append(q)
    env["PATH"] = ";".join(merged)
    env.setdefault("PYTHONUTF8", "1")
    # Prefer non-blocking PTY reads where supported (pywinpty thread + socket recv).
    env.setdefault("PYWINPTY_BLOCK", "0")
    return env


def _is_elevated() -> bool:
    if platform.system().lower() != "windows":
        return False
    try:
        import ctypes

        return bool(ctypes.windll.shell32.IsUserAnAdmin())
    except Exception:
        return False


def _pty_initial_cwd() -> str:
    raw = (os.environ.get("CONSOLE_PTY_CWD") or "").strip().strip('"')
    if raw:
        try:
            ap = os.path.abspath(os.path.expanduser(raw))
            if os.path.isdir(ap):
                return ap
        except OSError:
            pass
    return str(pathlib.Path.home())


def _powershell_interactive_argv() -> list[str]:
    """Interactive ConPTY: x64 System32 powershell; profiles optional via CONSOLE_PS_LOAD_PROFILE."""
    root = os.environ.get("SystemRoot", r"C:\Windows")
    exe = str(pathlib.Path(root) / "System32" / "WindowsPowerShell" / "v1.0" / "powershell.exe")
    argv: list[str] = [exe, "-NoLogo"]
    load_profile = os.environ.get("CONSOLE_PS_LOAD_PROFILE", "").strip().lower() in (
        "1",
        "true",
        "yes",
        "on",
    )
    if not load_profile:
        argv.append("-NoProfile")
    argv.extend(["-ExecutionPolicy", "Bypass"])
    return argv


def _cmd_argv() -> list[str]:
    root = os.environ.get("SystemRoot", r"C:\Windows")
    exe = str(pathlib.Path(root) / "System32" / "cmd.exe")
    # /Q quiet, /V:ON delayed expansion (multi-line blocks & !vars), UTF-8 code page
    return [exe, "/Q", "/V:ON", "/K", "chcp 65001 >nul"]


# One script block + CRLF so the parser always completes (avoids a stray `>>` continuation line after init).
# Do not set PSReadLine ContinuationPrompt to literal `>>` — it can render like a stuck multi-line prompt in xterm.
_PS_INIT = (
    "& { "
    "$ErrorActionPreference = 'SilentlyContinue'; "
    "[Console]::OutputEncoding = [System.Text.UTF8Encoding]::UTF8; "
    "$OutputEncoding = [System.Text.UTF8Encoding]::UTF8; "
    "try { if ($PSVersionTable.PSVersion.Major -ge 7) { $PSStyle.OutputRendering = 'PlainText' } } catch {}; "
    "$ProgressPreference = 'SilentlyContinue'; "
    "$ErrorView = 'NormalView'; "
    "try { Import-Module PSReadLine | Out-Null } catch {} "
    "}\r\n"
)


class PtySession:
    """One interactive PTY bound to a browser session."""

    def __init__(
        self,
        session_id: str,
        client_id: str,
        shell: str,
        rows: int,
        cols: int,
        emit: Callable[[dict[str, Any]], Coroutine[Any, Any, None]],
    ) -> None:
        self.session_id = session_id
        self.client_id = client_id
        self.shell = shell
        self.rows = max(8, min(int(rows), 200))
        self.cols = max(20, min(int(cols), 500))
        self._emit = emit
        self.proc: Any = None
        self._stop = threading.Event()
        self._reader: threading.Thread | None = None
        self._loop: asyncio.AbstractEventLoop | None = None

    def _argv(self) -> list[str]:
        if self.shell == "cmd":
            return _cmd_argv()
        if self.shell == "powershell_admin":
            if not _is_elevated():
                # Same binary; banner only — true UAC elevation needs a separate elevated agent process.
                return _powershell_interactive_argv()
        return _powershell_interactive_argv()

    def start_sync(self) -> None:
        if not pty_available():
            raise RuntimeError("pywinpty not available")
        env = _system32_env()
        cwd = _pty_initial_cwd()
        argv = self._argv()
        dims = (self.rows, self.cols)
        self.proc = PtyProcess.spawn(argv, cwd=cwd, env=env, dimensions=dims)
        # Never write decorative/ANSI text into the PTY stdin — PowerShell parses `[...]` and
        # stripped ESC bytes become `[0m`-style garbage → ParserError. UI shows session info.
        if self.shell in ("powershell", "powershell_admin"):
            self.proc.write(_PS_INIT)

    def _reader_loop(self) -> None:
        assert self.proc is not None
        loop = self._loop
        if loop is None:
            return
        while not self._stop.is_set():
            try:
                chunk = self.proc.read(16384)
            except EOFError:
                asyncio.run_coroutine_threadsafe(
                    self._emit(
                        {
                            "sessionId": self.session_id,
                            "shell": self.shell,
                            "eof": True,
                        }
                    ),
                    loop,
                )
                break
            except Exception as exc:  # pragma: no cover
                asyncio.run_coroutine_threadsafe(
                    self._emit(
                        {
                            "sessionId": self.session_id,
                            "shell": self.shell,
                            "error": str(exc),
                        }
                    ),
                    loop,
                )
                break
            if chunk:
                asyncio.run_coroutine_threadsafe(
                    self._emit(
                        {
                            "sessionId": self.session_id,
                            "shell": self.shell,
                            "data": chunk,
                        }
                    ),
                    loop,
                )
            else:
                time.sleep(0.005)

    async def start(self) -> None:
        self._loop = asyncio.get_running_loop()
        await asyncio.to_thread(self.start_sync)
        self._reader = threading.Thread(target=self._reader_loop, daemon=True)
        self._reader.start()

    def write(self, data: str) -> None:
        if self.proc and not self._stop.is_set():
            self.proc.write(data)

    def resize(self, rows: int, cols: int) -> None:
        self.rows = max(8, min(int(rows), 200))
        self.cols = max(20, min(int(cols), 500))
        if self.proc:
            try:
                self.proc.setwinsize(self.rows, self.cols)
            except Exception:
                pass

    def close(self) -> None:
        self._stop.set()
        if self.proc:
            try:
                self.proc.close(force=True)
            except Exception:
                pass
            self.proc = None


class PtyManager:
    """Tracks PTY sessions per (clientId, sessionId)."""

    def __init__(self) -> None:
        self._sessions: dict[tuple[str, str], PtySession] = {}

    def close_client(self, client_id: str) -> None:
        keys = [k for k in self._sessions if k[0] == client_id]
        for k in keys:
            sess = self._sessions.pop(k, None)
            if sess:
                sess.close()

    def close_all(self) -> None:
        for sess in list(self._sessions.values()):
            sess.close()
        self._sessions.clear()

    def get(self, client_id: str, session_id: str) -> PtySession | None:
        return self._sessions.get((client_id, session_id))

    async def start(
        self,
        client_id: str,
        session_id: str,
        shell: str,
        rows: int,
        cols: int,
        emit: Callable[[dict[str, Any]], Coroutine[Any, Any, None]],
    ) -> None:
        if not pty_available():
            await emit({"sessionId": session_id, "shell": shell, "error": "ConPTY (pywinpty) unavailable on this host."})
            return
        key = (client_id, session_id)
        old = self._sessions.pop(key, None)
        if old:
            old.close()
        sess = PtySession(session_id, client_id, shell, rows, cols, emit)
        self._sessions[key] = sess
        try:
            await sess.start()
        except Exception as exc:
            self._sessions.pop(key, None)
            await emit({"sessionId": session_id, "shell": shell, "error": str(exc)})

    def write(self, client_id: str, session_id: str, data: str) -> None:
        s = self._sessions.get((client_id, session_id))
        if s:
            s.write(data)

    def resize(self, client_id: str, session_id: str, rows: int, cols: int) -> None:
        s = self._sessions.get((client_id, session_id))
        if s:
            s.resize(rows, cols)

    def close(self, client_id: str, session_id: str) -> None:
        s = self._sessions.pop((client_id, session_id), None)
        if s:
            s.close()
