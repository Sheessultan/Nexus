# Live AWS + Windows agent

**Public IP:** `3.26.196.232`

| Service | URL |
|---------|-----|
| Web (browser) | http://3.26.196.232:3000 |
| API (Nest) | http://3.26.196.232:4000 |

## Important

The **agent does NOT run on AWS**. It runs on each **Windows laptop/PC** where you want CMD, PowerShell, and desktop control. It connects **out** to the API on AWS.

```
[Browser] --> http://3.26.196.232:3000  (web on AWS)
                 |
                 v (Socket.IO)
            http://3.26.196.232:4000  (API on AWS)
                 ^
                 |
[ConsoleAgent on Windows PC] --api http://3.26.196.232:4000
```

If the agent uses `http://127.0.0.1:4000`, it only talks to a **local** API on that PC — the live portal will not get CMD/terminal (sometimes screen looks like it works if you also run API locally).

---

## 1) AWS — web env + rebuild

On Ubuntu server:

```bash
cd ~/Nexus/console/apps/web

cat > .env.production << 'EOF'
NEXT_PUBLIC_SOCKET_URL=http://3.26.196.232:4000/console
CONSOLE_API_INTERNAL=http://127.0.0.1:4000
EOF

npm install
npm run build
pm2 restart nexus-web
```

API should already be on port 4000 (`pm2 status` → `nexus-api` online).

**Security group:** inbound TCP **3000**, **4000** from your networks.

---

## 2) Windows PC — connect agent to live API

### Option A — script (dev)

```powershell
cd C:\Users\ankur\OneDrive\Desktop\console\agent
.\start-live.ps1
```

### Option B — one command

```powershell
cd agent
py -m pip install -r requirements.txt
py src\main.py --api http://3.26.196.232:4000
```

You should see:

```text
Connecting to API: http://3.26.196.232:4000
health: 200 ...
```

### Option C — already installed ConsoleAgent.exe

Edit:

`C:\Program Files\ConsoleAgent\console-agent.json`

```json
{
  "apiUrl": "http://3.26.196.232:4000",
  "token": null
}
```

Restart the **ConsoleAgent** task in Task Scheduler, or reboot.

---

## 3) Browser check

1. Open **http://3.26.196.232:3000**
2. Header **Machine** dropdown → your PC hostname → **Online**
3. Test **Terminal** (CMD/PowerShell) and **Quick tools**

If dropdown says **No agents online** → agent is not reaching AWS (wrong API URL, firewall, or API down).

---

## 4) Only desktop screen works (drives / CMD empty)?

**Common cause:** The browser opens **before** the agent registers. The UI asked for drives too early (`No agent connected`), but **live desktop** still works later because it uses a different stream.

**Fix:**
1. Keep agent running: `py src\main.py --api http://3.26.196.232:4000`
2. On the portal click **Retry drives**, or refresh the page **after** the agent window shows `Agent registered`
3. Redeploy web with latest code (auto-retries when agent registers)

---

## 5) Only desktop screen works? (other causes)

| Cause | Fix |
|-------|-----|
| Agent on `localhost` | Use `http://3.26.196.232:4000` |
| No machine selected (2+ agents) | Pick your PC in the header dropdown |
| Old `.exe` without terminal DLLs | Rebuild/install latest `ConsoleAgent-Setup.exe` or use `py src\main.py` with `pip install -r requirements.txt` |
| Laptop firewall | Allow outbound TCP **4000** to `3.26.196.232` |

Test API from the laptop:

```powershell
Invoke-WebRequest http://3.26.196.232:4000/health -UseBasicParsing
```

---

## 5) Auto-start at logon (optional)

Task Scheduler → New task → At log on → Program:

`py.exe`  
Arguments: `C:\...\console\agent\src\main.py --api http://3.26.196.232:4000`  
Start in: `agent` folder
