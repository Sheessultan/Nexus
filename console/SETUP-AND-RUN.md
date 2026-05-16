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

- NestJS **^11.1.x** (common, core, websockets, platform-socket.io, JWT, passport, etc.)
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
| `CONSOLE_AGENT_CONNECT_TIMEOUT` | Seconds to wait for Socket.IO `/console` (default **45**). Prevents the agent from appearing stuck when the API is down or the namespace never answers. |

Run the agent **as Administrator** when you need elevated CMD/PowerShell (UAC); the UI shows `[ADMIN]` when `session_info` reports elevation.

---

## One-time install

Use your real clone path (examples below use `%USERPROFILE%\Desktop\console` — replace if yours differs).

### 1) API

```powershell
cd $env:USERPROFILE\Desktop\console\apps\api
npm install
```

(Optional) Copy `apps\api\.env.example` to `.env` and set `JWT_SECRET` and credentials.

### 2) Web

```powershell
cd $env:USERPROFILE\Desktop\console\apps\web
npm install
```

Create `apps\web\.env.local` (see `apps\web\.env.example`):

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000/console
```

Or use a shorter form when the API is on the same host name but port **4000**:

```env
NEXT_PUBLIC_API_ORIGIN=http://localhost:4000
```

If the API listens on another host or port, set one of the above to match (Socket URL must end with `/console` — Socket.IO namespace).

When the UI is on **port 3000** and the API on **port 4000** on the **same non-loopback hostname** (e.g. your LAN IP), Socket.IO is proxied through Next (`/console-socket/socket.io` → API) so the browser only talks to **one origin** (fixes strict cross-origin to `:4000`). On **`localhost` / `127.0.0.1`**, the UI connects **directly** to `:4000` (no proxy), which is more reliable in Edge InPrivate. If the API is not on `http://127.0.0.1:4000` from Next’s point of view (e.g. Docker), set **`CONSOLE_API_INTERNAL`** in `apps\web\.env.local` (see `apps\web\.env.example`).

When you open the site as **`http://<LAN-IP>:3000`** and **neither** variable is set, the UI tries **`http://<LAN-IP>:4000/console`** automatically (HTTP only). If you copied `.env.local` with **`localhost:4000`**, the web app **rewrites** that to the same **LAN hostname** as the page so other devices still reach your PC’s API (port unchanged). For HTTPS, a different API host, or a non-default API port, set `NEXT_PUBLIC_SOCKET_URL` explicitly to the real URL.

### 3) Agent (Python — not npm)

```powershell
cd $env:USERPROFILE\Desktop\console\agent
py -m pip install -r requirements.txt
```

---

## Run order (three terminals)

### Terminal A — API (default port **4000**)

The API binds to **`0.0.0.0`** by default so other machines on the LAN can connect. Override with `HOST` in `.env` if needed (e.g. `HOST=127.0.0.1` for local-only).

```powershell
cd $env:USERPROFILE\Desktop\console\apps\api
npm run start:dev
```

Allow **inbound TCP 4000** on the Windows Firewall (or your OS firewall) on the machine that runs the API when agents or browsers connect over the network.

### Terminal B — Web (default port **3000**)

```powershell
cd $env:USERPROFILE\Desktop\console\apps\web
npm run dev
```

By default, `npm run dev` listens on **`0.0.0.0`** so you can open `http://<this-PC-LAN-IP>:3000` from a laptop or phone on the same network (Windows Firewall may prompt for Node). For **localhost-only** dev (no LAN), use `npm run dev:local`.

Next.js **15+** blocks `/_next/*` (including **webpack HMR WebSocket**) unless the page’s `Origin` host is allowlisted. This repo’s `next.config` already allowlists common **private LAN** patterns (`192.168.*.*`, `10.*.*.*`, `172.16.*.*`–`172.31.*.*`). For odd hostnames (e.g. `*.local`), set **`NEXT_ALLOWED_DEV_ORIGINS`** in `apps\web\.env.local` (comma-separated hostnames only).

The `dev:lan` script is the same bind as `dev` (kept for people following older notes).

### Terminal C — Agent (runs shells on **this** Windows PC)

```powershell
cd $env:USERPROFILE\Desktop\console\agent
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
cd $env:USERPROFILE\Desktop\console\apps\api
npm run login:test
```

Default credentials (unless changed in `.env`): **admin / admin**.

---

## Common errors

| Symptom | What to do |
|---------|------------|
| `ENOENT package.json` in `agent\` | The agent is not a Node project — use `pip` and `py src\main.py`. |
| `EADDRINUSE :::4000` | Stop the other process or run the API on another port and update `NEXT_PUBLIC_SOCKET_URL`. |
| Agent “hangs” on startup, no registration | Start **Terminal A (API)** first. If the API is wrong or unreachable, the agent exits after **~45s** (override with `CONSOLE_AGENT_CONNECT_TIMEOUT`). Check `health:` / stderr for `Socket.IO connect failed` or timeout. |
| `NameError` / crash on first **legacy** PowerShell line command | Use current `agent/src/main.py` from this repo (CLIXML strip helper must be defined). |
| Blank desktop / capture errors | On the agent PC: `pip install mss Pillow`; restart the API (large JPEG payloads). |
| CLIXML / XML in PowerShell output | Use the clean script `agent/scripts/read-audit-clean.ps1` or scripts that avoid `Write-Host` under redirection; restart the agent after upgrading `main.py`. |
| Portal “System” info very slow | The agent uses **CIM** (`Win32_ComputerSystem` / `Win32_OperatingSystem`) instead of `Get-ComputerInfo` so it returns in seconds. |
| UI **Online** on `localhost:3000` but **Offline** on `http://<LAN-IP>:3000` | Allow **inbound TCP 4000** (API) for Private networks in Windows Firewall; restart the API after changes. Open `http://<LAN-IP>:4000` in the browser — you should get a JSON/404 from Nest, not a timeout. |

---

## Where logic lives

- Socket bridge: `apps/api/src/console/console.gateway.ts`
- Agent: `agent/src/main.py`
- UI: `apps/web/src/components/ConsoleDashboard.tsx`, `TerminalPanel.tsx`
- Event list: `docs/API.md`

---

## Clean audit script (plain text)

See **`agent/scripts/read-audit-clean.ps1`** and **`agent/scripts/README.md`** — designed for **NonInteractive** runs and readable output (no `Write-Host` / CLIXML noise).
