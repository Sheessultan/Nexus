"""
Windows AI agent — connects to NestJS Socket.IO `/console` and runs tools on this PC.

Terminal: interactive **ConPTY** sessions via `pywinpty` (`pty:start` / `pty:input` / …).
Legacy one-line runs: `terminal:input` → `agent:shell_exec` (still used by older clients).

Install: see agent/README.md (Python + py -m pip install -r requirements.txt).
"""

from __future__ import annotations

import argparse
import asyncio
import base64
import ctypes
import io
import json
import os
import pathlib
import platform
import re
import shutil
import string
import subprocess
import sys
import tempfile
import threading
import time
from typing import Any

import httpx
import socketio

from pty_manager import PtyManager, pty_available

_capture_lock = threading.Lock()

try:
    import mss
    from PIL import Image

    _HAS_SCREEN = True
except ImportError:
    mss = None  # type: ignore[assignment]
    Image = None  # type: ignore[assignment]
    _HAS_SCREEN = False


def _ensure_dpi_awareness() -> None:
    """Align GDI capture with physical pixels (helps mss + cursor mapping on scaled displays)."""
    if platform.system().lower() != "windows":
        return
    try:
        ctypes.windll.shcore.SetProcessDpiAwareness(2)
    except Exception:
        try:
            ctypes.windll.user32.SetProcessDPIAware()
        except Exception:
            pass


def _is_process_elevated() -> bool:
    if platform.system().lower() != "windows":
        return False
    try:
        return bool(ctypes.windll.shell32.IsUserAnAdmin())
    except Exception:
        return False


def session_info_sync() -> str:
    who = ""
    try:
        w = subprocess.run(
            ["whoami"],
            capture_output=True,
            text=True,
            timeout=10,
            encoding="utf-8",
            errors="replace",
        )
        who = (w.stdout or w.stderr or "").strip()
    except (OSError, subprocess.TimeoutExpired):
        who = f"{os.environ.get('USERDOMAIN', '')}\\{os.environ.get('USERNAME', '')}".strip("\\")
    payload = {
        "host": platform.node(),
        "userName": os.environ.get("USERNAME", ""),
        "userDomain": os.environ.get("USERDOMAIN", ""),
        "home": str(pathlib.Path.home()),
        "whoami": who or os.environ.get("USERNAME", ""),
        "isElevated": _is_process_elevated(),
    }
    return json.dumps(payload, ensure_ascii=False)


def _ps_single_quoted(s: str) -> str:
    return "'" + s.replace("'", "''") + "'"


def _cmd_percent_escape_for_batch(line: str) -> str:
    """So user literals like echo 50%% stay valid; batch expands %% -> %."""
    return line.replace("%", "%%")


def _powershell_exe() -> str:
    root = os.environ.get("SystemRoot", r"C:\Windows")
    return str(pathlib.Path(root) / "System32" / "WindowsPowerShell" / "v1.0" / "powershell.exe")


def _agent_root() -> pathlib.Path:
    """Dev: agent/ folder. Frozen exe: PyInstaller bundle (_MEIPASS)."""
    if getattr(sys, "frozen", False):
        meipass = getattr(sys, "_MEIPASS", None)
        if meipass:
            return pathlib.Path(meipass)
    return pathlib.Path(__file__).resolve().parent.parent


_AGENT_ROOT = _agent_root()
_PS_PARSE_SCRIPT = _AGENT_ROOT / "scripts" / "parse-ps-complete.ps1"


def _powershell_statement_parse_complete_sync(text: str) -> bool:
    """True if Parser::ParseInput reports no incomplete / missing-input style errors (exit 0 from helper)."""
    if platform.system().lower() != "windows" or not _PS_PARSE_SCRIPT.is_file():
        return True
    tmpd = tempfile.mkdtemp(prefix="console-ps-parse-")
    try:
        fp = pathlib.Path(tmpd) / "buffer.ps1"
        fp.write_text(text, encoding="utf-8")
        p = subprocess.run(
            [
                _powershell_exe(),
                "-NoLogo",
                "-NoProfile",
                "-NonInteractive",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                str(_PS_PARSE_SCRIPT),
                str(fp),
            ],
            capture_output=True,
            text=True,
            timeout=14,
            encoding="utf-8",
            errors="replace",
        )
        return p.returncode == 0
    except (OSError, subprocess.TimeoutExpired):
        return False
    finally:
        shutil.rmtree(tmpd, ignore_errors=True)


def _powershell_script_block(cwd: str, command: str, cwd_file: pathlib.Path) -> str:
    """PS wrapper for -File execution: UTF-8, non-interactive safe prefs, Write-Host shadow."""

    wh_shadow = (
        "function global:Write-Host {\n"
        "  param([Parameter(ValueFromRemainingArguments=$true)]$Object,\n"
        "  [switch]$NoNewline, $ForegroundColor, $BackgroundColor)\n"
        "  $s = if ($null -eq $Object) { '' } else { [string]$Object }\n"
        "  if ($NoNewline) { [Console]::Out.Write($s) } else { [Console]::Out.WriteLine($s) }\n"
        "}\n"
    )
    ps_style = (
        "try { if ($PSVersionTable.PSVersion.Major -ge 7) { $PSStyle.OutputRendering = 'PlainText' } } catch {}\n"
    )
    return (
        "$ProgressPreference = 'SilentlyContinue'\n"
        "$VerbosePreference = 'SilentlyContinue'\n"
        "$WarningPreference = 'SilentlyContinue'\n"
        "$InformationPreference = 'SilentlyContinue'\n"
        "$ErrorActionPreference = 'Continue'\n"
        "$FormatEnumerationLimit = -1\n"
        "[Console]::OutputEncoding = [System.Text.UTF8Encoding]::UTF8\n"
        "$OutputEncoding = [System.Text.UTF8Encoding]::UTF8\n"
        f"{ps_style}"
        f"{wh_shadow}"
        f"Set-Location -LiteralPath {_ps_single_quoted(cwd)}\n"
        f"{command}\n"
        f"(Get-Location).Path | Out-File -Encoding utf8 -FilePath {_ps_single_quoted(str(cwd_file))}\n"
    )


def _windows_banner_text() -> str:
    try:
        v = sys.getwindowsversion()
        build = getattr(v, "build", 0)
        ver_line = f"Microsoft Windows [Version {v.major}.{v.minor}.{build}]"
    except Exception:
        ver_line = "Microsoft Windows"
    return (
        f"{ver_line}\r\n"
        "(c) Microsoft Corporation. All rights reserved.\r\n"
        "\r\n"
    )


def _powershell_banner_text() -> str:
    base = _windows_banner_text()
    return (
        f"{base}"
        "Windows PowerShell\r\n"
        "Copyright (C) Microsoft Corporation. All rights reserved.\r\n\r\n"
    )


def _is_allowed_local_path(p: str) -> bool:
    ap = os.path.abspath(os.path.normpath(p))
    if ap.startswith("\\\\"):
        return False
    if len(ap) >= 3 and ap[1] == ":" and ap[2] in ("\\", "/"):
        return True
    return False


def list_dir_json(path: str) -> dict[str, Any]:
    p = os.path.abspath(os.path.normpath(path))
    if not _is_allowed_local_path(p):
        return {"ok": False, "error": "Path not allowed (local drive letters only).", "path": path}
    if not os.path.isdir(p):
        return {"ok": False, "error": f"Not a directory: {p}", "path": p}
    entries: list[dict[str, Any]] = []
    try:
        for name in sorted(os.listdir(p))[:800]:
            fp = os.path.join(p, name)
            try:
                st = os.stat(fp)
                entries.append(
                    {
                        "name": name,
                        "isDir": os.path.isdir(fp),
                        "size": int(st.st_size) if os.path.isfile(fp) else None,
                    }
                )
            except OSError:
                entries.append({"name": name, "isDir": False, "size": None})
    except OSError as exc:
        return {"ok": False, "error": str(exc), "path": p}
    return {"ok": True, "path": p, "entries": entries}


def list_drives_sync() -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for letter in string.ascii_uppercase:
        root = f"{letter}:\\"
        if os.path.exists(root):
            try:
                usage = shutil.disk_usage(root)
                out.append(
                    {
                        "letter": letter,
                        "path": root,
                        "freeGb": round(usage.free / (1024**3), 2),
                    }
                )
            except OSError:
                out.append({"letter": letter, "path": root, "freeGb": None})
    return out


def run_ps(script: str, timeout: int = 120) -> str:
    """Run a PowerShell snippet for portal helpers; suppress progress CLIXML on stderr."""
    prefix = (
        "$ProgressPreference='SilentlyContinue';"
        "$VerbosePreference='SilentlyContinue';"
        "$WarningPreference='SilentlyContinue';"
        "$InformationPreference='SilentlyContinue';"
        "$ErrorActionPreference='Continue';"
    )
    full = prefix + script
    p = subprocess.run(
        [
            _powershell_exe(),
            "-NoLogo",
            "-NoProfile",
            "-NonInteractive",
            "-ExecutionPolicy",
            "Bypass",
            "-Command",
            full,
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
        text=True,
        timeout=timeout,
        encoding="utf-8",
        errors="replace",
    )
    out = p.stdout or ""
    return out if out.strip() else f"(exit {p.returncode})"


def list_apps_json_sync() -> str:
    script = r"""
$apps = @()
Get-ItemProperty 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*' -ErrorAction SilentlyContinue |
  Where-Object DisplayName |
  ForEach-Object {
    $apps += [pscustomobject]@{
      name = [string]$_.DisplayName
      version = [string]$_.DisplayVersion
      location = [string]$_.InstallLocation
    }
  }
Get-ItemProperty 'HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*' -ErrorAction SilentlyContinue |
  Where-Object DisplayName |
  ForEach-Object {
    $apps += [pscustomobject]@{
      name = [string]$_.DisplayName
      version = [string]$_.DisplayVersion
      location = [string]$_.InstallLocation
    }
  }
$apps | Sort-Object name -Unique | Select-Object -First 400 | ConvertTo-Json -Depth 4 -Compress
"""
    return run_ps(script, 180)


def list_start_menu_json_sync() -> str:
    script = r"""
$roots = @(
  "$env:ProgramData\Microsoft\Windows\Start Menu\Programs",
  "$env:APPDATA\Microsoft\Windows\Start Menu\Programs"
)
$items = @()
foreach ($r in $roots) {
  if (Test-Path -LiteralPath $r) {
    Get-ChildItem -LiteralPath $r -Recurse -File -ErrorAction SilentlyContinue |
      Where-Object { $_.Extension -in '.lnk','.exe','.bat','.cmd' } |
      Select-Object -First 200 @{n='name';e={$_.Name}}, @{n='path';e={$_.FullName}} |
      ForEach-Object { $items += $_ }
  }
}
$items | ConvertTo-Json -Depth 3 -Compress
"""
    return run_ps(script, 120)


def launch_path_sync(target: str) -> str:
    p = os.path.expandvars(os.path.expanduser(target.strip().strip('"')))
    if not p:
        return "Empty path."
    if p.lower().endswith(".lnk") or os.path.isfile(p):
        os.startfile(p)  # type: ignore[attr-defined]
        return f"Started: {p}"
    if os.path.isdir(p):
        os.startfile(p)  # type: ignore[attr-defined]
        return f"Opened folder: {p}"
    return f"Not found: {p}"


def _pick_monitor(sct: Any, mss_index: int = 1) -> dict[str, Any]:
    """mss: monitors[0] is all displays; 1..n are individual. User picks 1 = first physical."""
    mons = list(getattr(sct, "monitors", []) or [])
    if not mons:
        return {"left": 0, "top": 0, "width": 1920, "height": 1080}
    if len(mons) == 1:
        return mons[0]
    if mss_index < 1:
        mss_index = 1
    if mss_index >= len(mons):
        mss_index = len(mons) - 1
    return mons[mss_index]


def list_monitors_json_sync() -> list[dict[str, Any]]:
    """mss monitor list for UI: index 1..n-1 map to mss.monitors[1..]."""
    if not _HAS_SCREEN or mss is None:
        return [{"index": 1, "width": 1920, "height": 1080, "label": "Display 1 (no mss)"}]
    with _capture_lock:
        with mss.mss() as sct:
            mons = list(getattr(sct, "monitors", []) or [])
    if not mons:
        return [{"index": 1, "width": 1920, "height": 1080, "label": "Display 1"}]
    if len(mons) == 1:
        m = mons[0]
        return [
            {
                "index": 1,
                "width": int(m["width"]),
                "height": int(m["height"]),
                "label": "Display 1",
            }
        ]
    out: list[dict[str, Any]] = []
    for i in range(1, len(mons)):
        m = mons[i]
        out.append(
            {
                "index": i,
                "width": int(m["width"]),
                "height": int(m["height"]),
                "label": f"Display {i}",
            }
        )
    return out


def _capture_jpeg_base64(
    quality: int,
    max_side: int | None = None,
    mss_index: int = 1,
) -> dict[str, Any]:
    if not _HAS_SCREEN or mss is None or Image is None:
        return {"ok": False, "error": "Screen capture deps missing. pip install mss Pillow"}
    try:
        with _capture_lock:
            with mss.mss() as sct:
                mon = _pick_monitor(sct, mss_index)
                shot = sct.grab(mon)
                pil = Image.frombytes("RGB", shot.size, shot.bgra, "raw", "BGRX")
                if max_side and (pil.width > max_side or pil.height > max_side):
                    try:
                        resample = Image.Resampling.LANCZOS  # type: ignore[attr-defined]
                    except AttributeError:
                        resample = Image.LANCZOS  # type: ignore[attr-defined]
                    pil.thumbnail((max_side, max_side), resample)
                buf = io.BytesIO()
                pil.save(buf, format="JPEG", quality=quality, optimize=True)
                b64 = base64.b64encode(buf.getvalue()).decode("ascii")
                return {
                    "ok": True,
                    "base64": b64,
                    "width": int(mon["width"]),
                    "height": int(mon["height"]),
                    "left": int(mon["left"]),
                    "top": int(mon["top"]),
                    "imageWidth": pil.width,
                    "imageHeight": pil.height,
                }
    except Exception as exc:  # pragma: no cover
        return {"ok": False, "error": f"capture failed: {exc}"}


def screen_snapshot_sync(mss_index: int = 1) -> dict[str, Any]:
    """Single-frame capture: keep payload modest for portal JSON over Socket.IO."""
    return _capture_jpeg_base64(38, max_side=1280, mss_index=mss_index)


def screen_click_focus_sync(payload: dict[str, Any]) -> str:
    """Map click inside last JPEG (vw x vh) to monitor coords, click, foreground window."""
    try:
        x = float(payload.get("x") or 0)
        y = float(payload.get("y") or 0)
        vw = float(payload.get("vw") or 1)
        vh = float(payload.get("vh") or 1)
        ml = float(payload.get("left") or 0)
        mt = float(payload.get("top") or 0)
        mw = float(payload.get("width") or 1)
        mh = float(payload.get("height") or 1)
    except (TypeError, ValueError):
        return "Invalid click payload."
    if vw <= 0 or vh <= 0:
        return "Invalid dimensions."
    sx = int(ml + (x / vw) * mw)
    sy = int(mt + (y / vh) * mh)

    user32 = ctypes.windll.user32
    user32.SetCursorPos(sx, sy)
    user32.mouse_event(0x0002, 0, 0, 0, 0)
    user32.mouse_event(0x0004, 0, 0, 0, 0)

    pt = ctypes.wintypes.POINT(int(sx), int(sy))
    hwnd = user32.WindowFromPoint(pt)
    if hwnd:
        user32.SetForegroundWindow(hwnd)
        return f"Clicked ({sx},{sy}), foreground hwnd={int(hwnd)}"
    return f"Clicked ({sx},{sy}), no window at point."


def open_browser_sync(browser: str, url: str) -> str:
    b = (browser or "default").lower()
    pf = os.environ.get("PROGRAMFILES", "")
    pfx86 = os.environ.get("PROGRAMFILES(X86)", "")
    candidates: dict[str, list[str]] = {
        "chrome": [
            os.path.join(pf, "Google", "Chrome", "Application", "chrome.exe"),
            os.path.join(pfx86, "Google", "Chrome", "Application", "chrome.exe"),
        ],
        "edge": [
            os.path.join(pfx86, "Microsoft", "Edge", "Application", "msedge.exe"),
            os.path.join(pf, "Microsoft", "Edge", "Application", "msedge.exe"),
        ],
        "firefox": [
            os.path.join(pf, "Mozilla Firefox", "firefox.exe"),
            os.path.join(pfx86, "Mozilla Firefox", "firefox.exe"),
        ],
    }
    if b == "default" or b not in candidates:
        os.startfile(url)  # type: ignore[attr-defined]
        return f"Opened default browser: {url}"
    for exe in candidates.get(b, []):
        if exe and os.path.isfile(exe):
            subprocess.Popen([exe, url], close_fds=True)
            return f"Launched {b}: {exe}"
    os.startfile(url)  # type: ignore[attr-defined]
    return f"{b} not found; opened default for {url}"


_PS_CLIXML_HEAD = re.compile(r"#<\s*CLIXML\s*\r?\n?", re.IGNORECASE)
_PS_ORPHAN_OBJ = re.compile(
    r"<Obj\s+S=\"(?:progress|information|verbose|warning|debug)\"[\s\S]*?</Obj>\s*",
    re.IGNORECASE,
)


def _strip_powershell_clixml_noise(text: str) -> str:
    """Remove CLIXML / serialized streams PowerShell may emit when stdout is redirected."""
    if not text:
        return text
    t = _PS_CLIXML_HEAD.sub("", text)
    lower = t.lower()
    # Remove well-formed <Objs>...</Objs> roots (repeat: multiple documents possible)
    while "<objs" in lower:
        idx = lower.find("<objs")
        end = "</objs>"
        j = lower.find(end, idx)
        if j < 0:
            t = t[:idx]
            break
        j += len(end)
        t = t[:idx] + t[j:]
        lower = t.lower()
    # Stray single <Obj S="progress|information" ...> blocks (interleaved output)
    for _ in range(64):
        n = _PS_ORPHAN_OBJ.sub("", t)
        if n == t:
            break
        t = n
    return t


async def run_shell(
    sio: socketio.AsyncClient,
    request_id: str,
    command: str,
    shell: str,
    state: dict[str, str],
) -> None:
    """Run one command with cwd persistence; stream merged stdout/stderr."""
    rid = re.sub(r"[^a-zA-Z0-9_-]", "", request_id)[:64] or "job"
    tmp = pathlib.Path(os.environ.get("TEMP", tempfile.gettempdir()))
    cwd_file = tmp / f"console_cwd_{rid}.txt"
    for p in (cwd_file,):
        try:
            if p.exists():
                p.unlink()
        except OSError:
            pass

    script_path: pathlib.Path | None = None
    try:
        if shell == "cmd":
            cwd = state["cmd_cwd"]
            bat = tmp / f"console_cmd_{rid}.bat"
            script_path = bat
            safe_cwd = cwd.replace("%", "%%").replace('"', '""')
            safe_cwd_file = str(cwd_file).replace("%", "%%").replace('"', '""')
            cmd_line = _cmd_percent_escape_for_batch(command)
            bat.write_text(
                "@echo off\r\n"
                "setlocal DisableDelayedExpansion\r\n"
                "chcp 65001 >nul\r\n"
                f'cd /d "{safe_cwd}"\r\n'
                f"{cmd_line}\r\n"
                f'(cd) > "{safe_cwd_file}"\r\n',
                encoding="utf-8",
                errors="replace",
            )
            proc = await asyncio.create_subprocess_exec(
                "cmd.exe",
                "/d",
                "/c",
                str(bat),
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.STDOUT,
                stdin=asyncio.subprocess.DEVNULL,
                cwd=cwd,
            )
        else:
            cwd = state["ps_cwd"]
            script = _powershell_script_block(cwd, command, cwd_file)
            ps1 = tmp / f"console_ps_{rid}.ps1"
            script_path = ps1
            ps1.write_text(script, encoding="utf-8-sig", errors="replace")
            ps_exe = _powershell_exe()
            proc = await asyncio.create_subprocess_exec(
                ps_exe,
                "-NoLogo",
                "-NoProfile",
                "-NonInteractive",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                str(ps1),
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                stdin=asyncio.subprocess.DEVNULL,
                cwd=cwd,
            )

        assert proc.stdout is not None
        if shell == "powershell":
            assert proc.stderr is not None

            async def pump_stdout() -> None:
                parts: list[str] = []
                while True:
                    block = await proc.stdout.read(8192)
                    if not block:
                        break
                    parts.append(block.decode("utf-8", errors="replace"))
                combined = "".join(parts)
                combined = _strip_powershell_clixml_noise(combined)
                emit_step = 8192
                for i in range(0, len(combined), emit_step):
                    chunk = combined[i : i + emit_step]
                    await sio.emit(
                        "agent:shell_output",
                        {"requestId": request_id, "chunk": chunk, "shell": shell},
                        namespace="/console",
                    )

            async def drain_stderr() -> None:
                while True:
                    block = await proc.stderr.read(65536)
                    if not block:
                        break

            await asyncio.gather(pump_stdout(), drain_stderr())
        else:
            while True:
                block = await proc.stdout.read(8192)
                if not block:
                    break
                text = block.decode("utf-8", errors="replace")
                await sio.emit(
                    "agent:shell_output",
                    {"requestId": request_id, "chunk": text, "shell": shell},
                    namespace="/console",
                )

        rc = await proc.wait()

        new_cwd: str | None = None
        try:
            if cwd_file.exists():
                raw = cwd_file.read_text(encoding="utf-8-sig", errors="replace").strip()
                if raw and _is_allowed_local_path(raw):
                    new_cwd = os.path.abspath(raw)
        except OSError:
            new_cwd = None

        if new_cwd:
            if shell == "cmd":
                state["cmd_cwd"] = new_cwd
            else:
                state["ps_cwd"] = new_cwd

        prompt = (
            f"\r\n{state['cmd_cwd']}>"
            if shell == "cmd"
            else f"\r\nPS {state['ps_cwd']}>"
        )
        await sio.emit(
            "agent:shell_output",
            {"requestId": request_id, "chunk": prompt, "shell": shell},
            namespace="/console",
        )
        await sio.emit(
            "agent:shell_done",
            {"requestId": request_id, "exitCode": int(rc), "shell": shell},
            namespace="/console",
        )
    except Exception as exc:  # pragma: no cover
        await sio.emit(
            "agent:shell_output",
            {"requestId": request_id, "chunk": f"\r\n[agent error] {exc}\r\n", "shell": shell},
            namespace="/console",
        )
        await sio.emit(
            "agent:shell_done",
            {"requestId": request_id, "exitCode": -1, "shell": shell},
            namespace="/console",
        )
    finally:
        for p in (cwd_file, script_path):
            if p is None:
                continue
            try:
                if p.exists():
                    p.unlink()
            except OSError:
                pass


async def handle_portal(
    sio: socketio.AsyncClient,
    data: dict,
    screen_opts: dict[str, int],
) -> None:
    rid = str(data.get("requestId") or "")
    typ = str(data.get("type") or "")
    payload = data.get("payload") or {}
    if not rid:
        return

    async def respond(ok: bool, data_out: Any = None, error: str | None = None) -> None:
        await sio.emit(
            "agent:portal_response",
            {"requestId": rid, "ok": ok, "data": data_out, "error": error},
            namespace="/console",
        )

    try:
        if typ == "session_info":
            await respond(True, session_info_sync())
            return
        if typ == "windows_shell_banner":
            shell = str(payload.get("shell") or "cmd").lower()
            text = _windows_banner_text() if shell == "cmd" else _powershell_banner_text()
            try:
                info = json.loads(session_info_sync())
                who = str(info.get("whoami") or info.get("userName") or "")
                adm = " · Administrator (elevated)" if info.get("isElevated") else ""
                text += (
                    f"\r\nSession: {who}{adm}  |  PC: {info.get('host', '')}  |  Profile: {info.get('home', '')}\r\n\r\n"
                )
            except Exception:
                pass
            await respond(True, text)
            return
        if typ == "list_drives":
            await respond(True, json.dumps(list_drives_sync()))
            return
        if typ == "list_dir_json":
            path = str(payload.get("path") or os.path.expanduser("~"))
            await respond(True, json.dumps(list_dir_json(path)))
            return
        if typ == "list_apps_json":
            await respond(True, list_apps_json_sync())
            return
        if typ == "list_start_menu_json":
            await respond(True, list_start_menu_json_sync())
            return
        if typ == "launch_path":
            target = str(payload.get("path") or "")
            out = await asyncio.to_thread(launch_path_sync, target)
            await respond(True, out)
            return
        if typ == "list_monitors_json":
            await respond(True, json.dumps(list_monitors_json_sync()))
            return
        if typ == "screen_debug":
            d: dict[str, Any] = {
                "hasMss": mss is not None,
                "hasPillow": Image is not None,
                "importOk": _HAS_SCREEN,
            }
            try:
                m_dbg = int(payload.get("monitor") or screen_opts["mss_index"])
            except (TypeError, ValueError):
                m_dbg = screen_opts["mss_index"]
            m_dbg = max(1, min(m_dbg, 8))
            snap = await asyncio.to_thread(_capture_jpeg_base64, 22, 480, m_dbg)
            d["monitor"] = m_dbg
            d["captureOk"] = bool(snap.get("ok"))
            d["captureError"] = snap.get("error")
            d["jpegChars"] = len(str(snap.get("base64") or ""))
            await respond(True, json.dumps(d))
            return
        if typ == "screen_snapshot":
            try:
                m_cap = int(payload.get("monitor") or screen_opts["mss_index"])
            except (TypeError, ValueError):
                m_cap = screen_opts["mss_index"]
            m_cap = max(1, min(m_cap, 8))
            screen_opts["mss_index"] = m_cap
            snap = await asyncio.to_thread(screen_snapshot_sync, m_cap)
            if snap.get("ok"):
                await respond(True, json.dumps(snap))
            else:
                await respond(False, None, snap.get("error", "screen error"))
            return
        if typ == "screen_click_focus":
            out = await asyncio.to_thread(screen_click_focus_sync, dict(payload))
            await respond(True, out)
            return
        if typ == "system_info":
            # Avoid Get-ComputerInfo — it can block for minutes on some hosts.
            script = (
                "$cs = Get-CimInstance Win32_ComputerSystem; "
                "$os = Get-CimInstance Win32_OperatingSystem; "
                "[pscustomobject]@{"
                "CsName=$cs.Name; CsUserName=$cs.UserName; OsName=$os.Caption; "
                "OsVersion=$os.Version; OsArchitecture=$os.OSArchitecture; "
                "WindowsBuild=$os.BuildNumber"
                "} | ConvertTo-Json -Compress"
            )
            out = await asyncio.to_thread(run_ps, script, 45)
            await respond(True, out)
            return
        if typ == "list_apps":
            script = (
                "Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' "
                "| Where-Object DisplayName "
                "| Select-Object -First 100 DisplayName,DisplayVersion "
                "| Format-Table -AutoSize | Out-String -Width 220"
            )
            out = await asyncio.to_thread(run_ps, script, 120)
            await respond(True, out)
            return
        if typ == "list_dir":
            path = str(payload.get("path") or os.path.expanduser("~"))
            j = list_dir_json(path)
            if j.get("ok"):
                lines = "\n".join(
                    f"{'[DIR] ' if e.get('isDir') else ''}{e.get('name')}"
                    for e in (j.get("entries") or [])[:200]
                )
                await respond(True, lines or "(empty)")
            else:
                await respond(False, None, str(j.get("error") or "list_dir failed"))
            return
        if typ == "open_browser":
            url = str(payload.get("url") or "https://www.google.com")
            browser = str(payload.get("browser") or "default")
            out = await asyncio.to_thread(open_browser_sync, browser, url)
            await respond(True, out)
            return
        if typ == "network_info":
            out = await asyncio.to_thread(run_ps, "ipconfig", 60)
            await respond(True, out)
            return
        if typ == "tasks_list":
            def _tasks() -> str:
                p = subprocess.run(
                    ["cmd.exe", "/C", "schtasks /query /FO LIST /V"],
                    capture_output=True,
                    text=True,
                    timeout=90,
                    encoding="utf-8",
                    errors="replace",
                )
                t = (p.stdout or "")[:20000]
                return t if t.strip() else (p.stderr or str(p.returncode))

            out = await asyncio.to_thread(_tasks)
            await respond(True, out)
            return
        if typ == "logs_tail":
            script = (
                "Get-WinEvent -LogName Application -MaxEvents 25 -ErrorAction SilentlyContinue "
                "| Format-Table TimeCreated,Id,LevelDisplayName,Message -Wrap | Out-String -Width 200"
            )
            out = await asyncio.to_thread(run_ps, script, 90)
            await respond(True, out)
            return
        if typ == "query_user_sessions":
            def _query_user() -> str:
                exe = str(pathlib.Path(os.environ.get("SystemRoot", r"C:\Windows")) / "System32" / "query.exe")
                p = subprocess.run(
                    [exe, "user"],
                    capture_output=True,
                    text=True,
                    timeout=30,
                    encoding="utf-8",
                    errors="replace",
                )
                t = (p.stdout or p.stderr or "").strip()
                return (t or "(no output)")[:12000]

            out = await asyncio.to_thread(_query_user)
            await respond(True, out)
            return
        if typ == "net_share_list":
            def _shares() -> str:
                p = subprocess.run(
                    ["cmd.exe", "/C", "net share"],
                    capture_output=True,
                    text=True,
                    timeout=45,
                    encoding="utf-8",
                    errors="replace",
                )
                return ((p.stdout or p.stderr or "").strip() or "(empty)")[:12000]

            out = await asyncio.to_thread(_shares)
            await respond(True, out)
            return
        if typ == "firewall_profiles":
            def _fw() -> str:
                p = subprocess.run(
                    ["netsh", "advfirewall", "show", "allprofiles"],
                    capture_output=True,
                    text=True,
                    timeout=45,
                    encoding="utf-8",
                    errors="replace",
                )
                return ((p.stdout or p.stderr or "").strip() or "(empty)")[:12000]

            out = await asyncio.to_thread(_fw)
            await respond(True, out)
            return
        if typ == "startup_entries":
            script = (
                "'--- HKLM Run ---'; "
                "Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' -ErrorAction SilentlyContinue | Out-String; "
                "'--- HKCU Run ---'; "
                "Get-ItemProperty 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' -ErrorAction SilentlyContinue | Out-String"
            )
            out = await asyncio.to_thread(run_ps, script, 45)
            await respond(True, out)
            return
        if typ == "process_list_brief":
            script = (
                "Get-Process | Sort-Object WS -Descending | Select-Object -First 45 Name,Id,CPU,WS "
                "| Format-Table -AutoSize | Out-String -Width 220"
            )
            out = await asyncio.to_thread(run_ps, script, 60)
            await respond(True, out)
            return
        if typ == "services_brief":
            script = (
                "Get-Service | Sort-Object Status,DisplayName | Select-Object -First 55 Name,Status,StartType,DisplayName "
                "| Format-Table -AutoSize | Out-String -Width 220"
            )
            out = await asyncio.to_thread(run_ps, script, 90)
            await respond(True, out)
            return
        if typ == "open_mmc":
            name = str(payload.get("name") or "devmgmt.msc")
            win = pathlib.Path(os.environ.get("SystemRoot", r"C:\Windows"))
            msc = win / "System32" / name
            mmc = win / "System32" / "mmc.exe"
            if not mmc.is_file():
                await respond(False, None, "mmc.exe not found")
                return
            if not msc.is_file():
                await respond(False, None, f"MSC not found: {msc}")
                return
            await asyncio.to_thread(lambda: subprocess.Popen([str(mmc), str(msc)], close_fds=True))
            await respond(True, f"Launched {msc}")
            return
        if typ == "diskpart_list_disk":
            def _dp_list() -> str:
                tdir = tempfile.mkdtemp()
                try:
                    sp = os.path.join(tdir, "dp_list.txt")
                    pathlib.Path(sp).write_text("list disk\r\nexit\r\n", encoding="ascii")
                    p = subprocess.run(
                        ["diskpart", "/s", sp],
                        capture_output=True,
                        text=True,
                        timeout=90,
                        encoding="utf-8",
                        errors="replace",
                    )
                    return ((p.stdout or "") + (p.stderr or ""))[:8000]
                finally:
                    shutil.rmtree(tdir, ignore_errors=True)

            out = await asyncio.to_thread(_dp_list)
            await respond(True, out)
            return
        await respond(False, None, f"unknown portal type: {typ}")
    except Exception as exc:  # pragma: no cover
        await respond(False, None, str(exc))


async def run_agent(http_base: str, token: str | None) -> None:
    # Cap reconnection attempts (0 = infinite in python-socketio).
    sio = socketio.AsyncClient(
        logger=False,
        engineio_logger=False,
        reconnection=True,
        reconnection_attempts=25,
        reconnection_delay=1,
        reconnection_delay_max=20,
    )
    tasks: set[asyncio.Task[None]] = set()
    stream_task: asyncio.Task[None] | None = None

    home = str(pathlib.Path.home())
    state: dict[str, str] = {"cmd_cwd": home, "ps_cwd": home}
    screen_opts: dict[str, int] = {"mss_index": 1}
    pty_mgr = PtyManager()

    def track(task: asyncio.Task[None]) -> None:
        tasks.add(task)
        task.add_done_callback(tasks.discard)

    async def screen_stream_loop(fps: int) -> None:
        delay = 1.0 / max(1, min(int(fps), 8))
        seq = 0
        err_printed = False
        try:
            while True:
                snap = await asyncio.to_thread(
                    _capture_jpeg_base64,
                    22,
                    960,
                    screen_opts["mss_index"],
                )
                seq += 1
                if snap.get("ok"):
                    try:
                        await sio.emit(
                            "agent:screen_frame",
                            {
                                "seq": seq,
                                "base64": snap["base64"],
                                "left": snap["left"],
                                "top": snap["top"],
                                "width": snap["width"],
                                "height": snap["height"],
                                "imageWidth": snap.get("imageWidth"),
                                "imageHeight": snap.get("imageHeight"),
                            },
                            namespace="/console",
                        )
                    except Exception as exc:  # pragma: no cover
                        if not err_printed:
                            print("screen_frame emit failed:", exc, file=sys.stderr)
                            err_printed = True
                elif not err_printed:
                    print("screen capture:", snap.get("error"), file=sys.stderr)
                    err_printed = True
                await asyncio.sleep(delay)
        except asyncio.CancelledError:
            return

    @sio.on("agent:screen_control", namespace="/console")
    async def on_screen_control(data: dict) -> None:
        nonlocal stream_task
        action = str(data.get("action") or "").lower()
        raw_m = data.get("monitor")
        if raw_m is not None:
            try:
                screen_opts["mss_index"] = max(1, min(int(raw_m), 8))
            except (TypeError, ValueError):
                pass
        if action == "stop":
            if stream_task and not stream_task.done():
                stream_task.cancel()
            stream_task = None
            return
        if action == "start":
            if stream_task and not stream_task.done():
                stream_task.cancel()
            fps = int(data.get("fps") or 5)
            stream_task = asyncio.create_task(screen_stream_loop(fps))

    @sio.event(namespace="/console")
    async def disconnect() -> None:
        nonlocal stream_task
        if stream_task and not stream_task.done():
            stream_task.cancel()
        stream_task = None
        pty_mgr.close_all()

    @sio.event(namespace="/console")
    async def connect() -> None:
        await sio.emit(
            "agent:hello",
            {
                "host": platform.node(),
                "os": platform.platform(),
                "python": sys.version.split()[0],
                "ts": time.time(),
            },
            namespace="/console",
        )
        await sio.emit(
            "agent:register",
            {"role": "windows-shell-agent", "host": platform.node()},
            namespace="/console",
        )

    @sio.on("agent:powershell_parse", namespace="/console")
    async def on_agent_powershell_parse(data: dict) -> None:
        rid = str(data.get("requestId") or "")
        if not rid:
            return
        text = str(data.get("text") or "")
        try:
            complete = await asyncio.to_thread(_powershell_statement_parse_complete_sync, text)
            await sio.emit(
                "agent:powershell_parse_result",
                {"requestId": rid, "complete": complete},
                namespace="/console",
            )
        except Exception as exc:  # pragma: no cover
            await sio.emit(
                "agent:powershell_parse_result",
                {"requestId": rid, "complete": False, "error": str(exc)},
                namespace="/console",
            )

    @sio.on("agent:shell_exec", namespace="/console")
    async def on_shell_exec(data: dict) -> None:
        rid = str(data.get("requestId") or "")
        cmd = str(data.get("command") or "")
        shell = str(data.get("shell") or "powershell").lower()
        if shell not in ("powershell", "cmd"):
            shell = "powershell"
        if not rid:
            return
        track(asyncio.create_task(run_shell(sio, rid, cmd, shell, state)))

    @sio.on("agent:pty_start", namespace="/console")
    async def on_pty_start(data: dict) -> None:
        client_id = str(data.get("clientId") or "")
        session_id = str(data.get("sessionId") or "")
        shell = str(data.get("shell") or "powershell").lower()
        if shell not in ("powershell", "cmd", "powershell_admin"):
            shell = "powershell"
        if not client_id or not session_id:
            return
        try:
            rows = int(data.get("rows") or 24)
            cols = int(data.get("cols") or 80)
        except (TypeError, ValueError):
            rows, cols = 24, 80

        async def emit(payload: dict[str, Any]) -> None:
            await sio.emit(
                "agent:pty_output",
                {"clientId": client_id, **payload},
                namespace="/console",
            )

        await pty_mgr.start(client_id, session_id, shell, rows, cols, emit)

    @sio.on("agent:pty_input", namespace="/console")
    async def on_pty_input(data: dict) -> None:
        client_id = str(data.get("clientId") or "")
        session_id = str(data.get("sessionId") or "")
        if not client_id or not session_id:
            return
        pty_mgr.write(client_id, session_id, str(data.get("data") or ""))

    @sio.on("agent:pty_resize", namespace="/console")
    async def on_pty_resize(data: dict) -> None:
        client_id = str(data.get("clientId") or "")
        session_id = str(data.get("sessionId") or "")
        if not client_id or not session_id:
            return
        try:
            rows = int(data.get("rows") or 24)
            cols = int(data.get("cols") or 80)
        except (TypeError, ValueError):
            rows, cols = 24, 80
        pty_mgr.resize(client_id, session_id, rows, cols)

    @sio.on("agent:pty_close", namespace="/console")
    async def on_pty_close(data: dict) -> None:
        client_id = str(data.get("clientId") or "")
        session_id = str(data.get("sessionId") or "")
        if not client_id or not session_id:
            return
        pty_mgr.close(client_id, session_id)

    @sio.on("agent:pty_client_gone", namespace="/console")
    async def on_pty_client_gone(data: dict) -> None:
        client_id = str(data.get("clientId") or "")
        if client_id:
            pty_mgr.close_client(client_id)

    @sio.on("agent:portal_request", namespace="/console")
    async def on_portal_request(data: dict) -> None:
        track(asyncio.create_task(handle_portal(sio, data, screen_opts)))

    @sio.on("log:line", namespace="/console")
    async def on_log(data: dict) -> None:
        print("log:", data)

    headers = {"Authorization": f"Bearer {token}"} if token else {}
    connect_deadline = float(os.environ.get("CONSOLE_AGENT_CONNECT_TIMEOUT", "45") or "45")
    try:
        await asyncio.wait_for(
            sio.connect(
                http_base,
                namespaces=["/console"],
                headers=headers,
                transports=["websocket"],
                wait=True,
                wait_timeout=5,
                retry=False,
            ),
            timeout=connect_deadline,
        )
    except asyncio.TimeoutError:
        print(
            f"Socket.IO connect timed out after {connect_deadline:.0f}s "
            f"(is the API running at {http_base}? namespace /console reachable?).",
            file=sys.stderr,
        )
        try:
            await sio.disconnect()
        except BaseException:
            pass
        raise SystemExit(2) from None
    except socketio.exceptions.ConnectionError as exc:
        print(f"Socket.IO connect failed: {exc}", file=sys.stderr)
        try:
            await sio.disconnect()
        except BaseException:
            pass
        raise SystemExit(2) from None
    try:
        await sio.wait()
    finally:
        if stream_task and not stream_task.done():
            stream_task.cancel()
            try:
                await stream_task
            except asyncio.CancelledError:
                pass
        stream_task = None
        for t in list(tasks):
            if not t.done():
                t.cancel()
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
        pty_mgr.close_all()
        try:
            await sio.disconnect()
        except BaseException:
            pass


def _normalize_http_base(raw: str) -> str:
    """Strip whitespace and trailing slashes so /health joins correctly."""
    return (raw or "").strip().rstrip("/")


def _config_paths() -> list[pathlib.Path]:
    paths = [_AGENT_ROOT / "console-agent.json"]
    if getattr(sys, "frozen", False):
        paths.insert(0, pathlib.Path(sys.executable).resolve().parent / "console-agent.json")
    return paths


def load_agent_config() -> dict[str, Any]:
    for path in _config_paths():
        if not path.is_file():
            continue
        try:
            with path.open(encoding="utf-8") as fh:
                data = json.load(fh)
            if isinstance(data, dict):
                return data
        except (OSError, json.JSONDecodeError) as exc:
            print(f"Warning: could not read {path}: {exc}", file=sys.stderr)
    return {}


def resolve_api_base(cli_api: str | None) -> str:
    if cli_api:
        return _normalize_http_base(cli_api)
    env = os.environ.get("CONSOLE_API_BASE", "").strip()
    if env:
        return _normalize_http_base(env)
    cfg = load_agent_config()
    for key in ("apiUrl", "api_url", "api"):
        val = cfg.get(key)
        if val:
            return _normalize_http_base(str(val))
    return "http://127.0.0.1:4000"


def resolve_agent_token(cli_token: str | None) -> str | None:
    if cli_token:
        return cli_token
    env = os.environ.get("CONSOLE_AGENT_TOKEN", "").strip()
    if env:
        return env
    tok = load_agent_config().get("token")
    if tok is None:
        return None
    s = str(tok).strip()
    return s or None


def probe_api(api_base: str) -> None:
    try:
        base = _normalize_http_base(api_base)
        r = httpx.get(f"{base}/health", timeout=3.0)
        print("health:", r.status_code, r.text)
    except httpx.HTTPError as exc:
        print("health check failed:", exc, file=sys.stderr)


def main() -> None:
    parser = argparse.ArgumentParser(description="NEXUS INTELLIGENCE Windows agent")
    parser.add_argument(
        "--api",
        default=None,
        help="Nest API origin (no path). Overrides console-agent.json / CONSOLE_API_BASE.",
    )
    parser.add_argument(
        "--token",
        default=None,
        help="Bearer token for authenticated handshakes",
    )
    args = parser.parse_args()
    args.api = resolve_api_base(args.api)
    args.token = resolve_agent_token(args.token)
    print(f"Connecting to API: {args.api}", flush=True)
    print(
        f"Capabilities: screen={'yes' if _HAS_SCREEN else 'no'}, "
        f"terminal/ConPTY={'yes' if pty_available() else 'NO'}",
        flush=True,
    )
    if not pty_available():
        print(
            "WARNING: CMD/PowerShell terminal needs pywinpty. Reinstall from latest ConsoleAgent-Setup.exe.",
            file=sys.stderr,
        )

    if platform.system().lower() != "windows":
        print("Warning: agent targets Windows; continuing for development.", file=sys.stderr)

    _ensure_dpi_awareness()
    if not _HAS_SCREEN:
        print(
            "Screen capture disabled: install deps with\n"
            "  py -m pip install -r requirements.txt\n"
            "(needs mss + Pillow)",
            file=sys.stderr,
        )
    probe_api(args.api)
    try:
        asyncio.run(run_agent(args.api, args.token))
    except KeyboardInterrupt:
        print("agent stopped")


if __name__ == "__main__":
    main()
