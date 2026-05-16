# Windows agent — PowerShell / CMD bridge

> **Note:** Yeh folder **Python** ka hai — yahan **`package.json` / `npm i` nahi** chalta. Dependencies: `py -m pip install -r requirements.txt`. Poora flow: repo root par **`SETUP-AND-RUN.md`** dekho.

This process runs **on the same PC** where you want commands to execute. The web UI talks to the NestJS backend over Socket.IO; the dashboard terminal uses **ConPTY** (`pywinpty`) for interactive CMD / PowerShell (`pty:*` events). Quick tools still use one-line `terminal:input` → `agent:shell_exec`.

## What runs where

| Piece | Role |
|-------|------|
| **Browser (Next.js)** | xterm + `pty:start` / `pty:input` / `pty:resize` for live shells; optional legacy line mode via `terminal:input`. |
| **Backend (NestJS `/console`)** | Routes PTY traffic to the registered agent; streams `pty:output` back to the browser. |
| **Agent (this Python app)** | Registers with `agent:register`; spawns ConPTY sessions (`agent/src/pty_manager.py`) and handles portal / screen capture. |

## Shell selection (from the UI terminal)

- **CMD / PowerShell** tabs start separate **ConPTY** sessions (`pywinpty`): real `cmd.exe` / `powershell.exe` from **x64 System32**, UTF-8, arrow-key history, pipes, `diskpart` when you run it interactively, etc.
- Optional agent env: **`CONSOLE_PTY_CWD`** (initial PTY folder), **`CONSOLE_PS_LOAD_PROFILE=1`** (load PowerShell profiles in the PTY; default is `-NoProfile` for speed), **`CONSOLE_API_BASE`** (same as `--api`, e.g. `http://192.168.1.10:4000` when the Nest API is on another machine).
- **Quick tools** panel sends one-shot lines as `terminal:input` (non-interactive script runner on the agent).

## Silent / background install

See **`agent/scripts/README-silent.md`** and **`agent/scripts/install-silent.ps1`** (Task Scheduler registration example).

## Quick start (development)

1. Start API: `cd apps/api && npm run start:dev` (port **4000**).
2. Start UI: `cd apps/web && npm run dev` (port **3000**), or `npm run dev:lan` so other PCs can open `http://<your-LAN-IP>:3000`.
3. Install deps and run agent:

```powershell
cd C:\Users\adn\Desktop\console\agent
py -m pip install -r requirements.txt
py src\main.py --api http://127.0.0.1:4000
```

4. Open `http://localhost:3000`, use the yellow **Terminal Test Console**, type a command, press **Enter**.

## Getting system details (examples)

PowerShell:

```text
whoami
hostname
Get-ComputerInfo | Select-Object WindowsProductName, OsHardwareAbstractionLayer
systeminfo
```

CMD:

```text
cmd: whoami
cmd: hostname
cmd: systeminfo
```

## Installing as a Windows service / auto-start

This repo ships a **normal Python script**, not a signed installer. For production you typically:

1. **Task Scheduler** — trigger “At startup” or “At log on”; action: `py C:\path\to\console\agent\src\main.py --api http://YOUR_SERVER:4000`.
2. **NSSM** (Non-Sucking Service Manager) — wrap `py.exe` with arguments pointing at `main.py`; run as a dedicated service account after hardening.
3. **pywin32 `servicemodule`** — implement a proper Windows Service class (more code).

Running as **SYSTEM** or elevated admin is optional but increases risk — use least privilege and an allowlist before exposing beyond localhost.

## Security warning

The agent can run arbitrary commands allowed for the Windows user running the process. **Do not** expose the orchestrator socket to the public internet without TLS, authentication, and strict command policy. Treat this as a **trusted internal** tool until you add RBAC and auditing end-to-end.
