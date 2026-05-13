# Console — setup, versions, and how to run

This document covers the **NestJS API**, **Next.js web app**, and **Windows Python agent**.  
The `agent` folder has **no `package.json`** — do not run `npm install` there; use Python and `pip`.

---

## Required tools

| Tool | Recommended | Notes |
|------|-------------|--------|
| **Node.js** | **20.x LTS** or **22.x LTS** | Used for Nest + Next builds. |
| **npm** | **10+** | Bundled with Node. |
| **Python** | **3.10+** (3.11 / 3.12 OK) | On Windows, `py` launcher is common. |
| **OS** | **Windows 10 / 11** | The agent runs CMD / PowerShell on this OS. |

### Pinned dependency versions (from this repo)

**Frontend — `apps/web/package.json`**

- Next.js **16.2.6**
- React **19.2.4**
- socket.io-client **^4.8.3**
- @xterm/xterm **^6.0.0**, @xterm/addon-fit **^0.11.0**, @xterm/addon-web-links, @xterm/addon-unicode11

**Backend — `apps/api/package.json`**

- NestJS **^10.4.x** (common, websockets, platform-socket.io, etc.)
- socket.io **^4.8.x**
- TypeScript **^5.6.x**

**Agent — `agent/requirements.txt`**

- python-socketio[asyncio_client] **5.13.0**
- httpx **0.28.1**
- mss **10.0.0**, Pillow **11.1.0** (desktop capture)
- **pywinpty** (Windows) — ConPTY for interactive CMD / PowerShell in the browser terminal

### Agent environment (optional)

| Variable | Effect |
|----------|--------|
| `CONSOLE_PTY_CWD` | Initial working directory for new PTY sessions (must exist). Default: user profile. |
| `CONSOLE_PS_LOAD_PROFILE` | Set to `1`, `true`, `yes`, or `on` to load PowerShell profiles in the **interactive** PTY (default is `-NoProfile` for faster startup). |

Run the agent **as Administrator** when you need elevated CMD/PowerShell (UAC); the UI shows `[ADMIN]` when `session_info` reports elevation.

---

## One-time install

Adjust paths if your clone is not on the desktop.

### 1) API

```powershell
cd C:\Users\Administrator\Desktop\console\apps\api
npm install
```

(Optional) Copy `apps\api\.env.example` to `.env` and set `JWT_SECRET` and credentials.

### 2) Web

```powershell
cd C:\Users\Administrator\Desktop\console\apps\web
npm install
```

Create `apps\web\.env.local`:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000/console
```

If the API listens on another port or host, change this URL to match (must end with `/console` — Socket.IO namespace).

### 3) Agent (Python — not npm)

```powershell
cd C:\Users\Administrator\Desktop\console\agent
py -m pip install -r requirements.txt
```

---

## Run order (three terminals)

### Terminal A — API (default port **4000**)

```powershell
cd C:\Users\Administrator\Desktop\console\apps\api
npm run start:dev
```

### Terminal B — Web (default port **3000**)

```powershell
cd C:\Users\Administrator\Desktop\console\apps\web
npm run dev
```

### Terminal C — Agent (runs shells on **this** Windows PC)

```powershell
cd C:\Users\Administrator\Desktop\console\agent
py src\main.py --api http://127.0.0.1:4000
```

Open **http://localhost:3000** in the browser. If the agent is not connected, the UI shows a **no agent** style message for shell commands.

---

## Running on another PC (split roles)

Typical split:

| Machine | What runs |
|---------|-----------|
| **Server / dev box** | `apps/api` + `apps/web` (or only API + static hosting) |
| **Target Windows PC** | **Agent only** (`py src\main.py`) |

### Steps

1. **Clone or copy** this repo (or at least the `agent` folder + Python deps) onto the **target** Windows machine.

2. On the **server**, start the API and ensure **port 4000** (or your `PORT`) is reachable from the target PC:
   - Same LAN: use the server’s IP, e.g. `http://192.168.1.50:4000`
   - Open **Windows Firewall** inbound rule for TCP 4000 on the server (or bind behind nginx / TLS).

3. On the **target** PC, install Python deps and run:

   ```powershell
   py src\main.py --api http://192.168.1.50:4000
   ```

   Use the real IP/hostname and port of your Nest process.

4. On the **browser** machine (can be the same as the server or your laptop), set `NEXT_PUBLIC_SOCKET_URL` to the **same API base + `/console`**, e.g.:

   ```env
   NEXT_PUBLIC_SOCKET_URL=http://192.168.1.50:4000/console
   ```

   Rebuild or restart `npm run dev` after changing `.env.local`.

5. **TLS / HTTPS**: if the API is behind HTTPS, use `https://host/console` in `NEXT_PUBLIC_SOCKET_URL`. Mixed content rules apply (HTTPS page cannot open `ws:` to HTTP).

6. **Agent token** (optional): if you enable auth on the handshake, set `CONSOLE_AGENT_TOKEN` and pass `--token` — see `docs/API.md`.

### What executes where

- **Shell commands** and **desktop capture** run on the **machine where the agent runs**, under that user’s account (elevate the agent if you need admin-only tools).
- The **browser** only shows the UI and Socket.IO traffic; it does not run your CMD/PowerShell locally.

---

## Optional: login test

```powershell
cd C:\Users\Administrator\Desktop\console\apps\api
npm run login:test
```

Default credentials (unless changed in `.env`): **admin / admin**.

---

## Common errors

| Symptom | What to do |
|---------|------------|
| `ENOENT package.json` in `agent\` | The agent is not a Node project — use `pip` and `py src\main.py`. |
| `EADDRINUSE :::4000` | Stop the other process or run the API on another port and update `NEXT_PUBLIC_SOCKET_URL`. |
| Blank desktop / capture errors | On the agent PC: `pip install mss Pillow`; restart the API (large JPEG payloads). |
| CLIXML / XML in PowerShell output | Use the clean script `agent/scripts/read-audit-clean.ps1` or scripts that avoid `Write-Host` under redirection; restart the agent after upgrading `main.py`. |

---

## Where logic lives

- Socket bridge: `apps/api/src/console/console.gateway.ts`
- Agent: `agent/src/main.py`
- UI: `apps/web/src/components/ConsoleDashboard.tsx`, `TerminalPanel.tsx`
- Event list: `docs/API.md`

---

## Clean audit script (plain text)

See **`agent/scripts/read-audit-clean.ps1`** and **`agent/scripts/README.md`** — designed for **NonInteractive** runs and readable output (no `Write-Host` / CLIXML noise).
