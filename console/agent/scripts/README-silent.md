# Silent / background agent (Windows)

These patterns run the agent **without a visible console window** (or as a service). Use only on machines you own and with clear security policy.

## Option A — Task Scheduler (hidden window)

1. Open **Task Scheduler** → **Create Task…**
2. **General:** name `AIConsoleAgent`; select **Run whether user is logged on or not** if you need background at lock screen (requires saved password).
3. **Triggers:** At log on, or At startup.
4. **Actions:** Start a program  
   - Program: `C:\Users\YOUR_USER\AppData\Local\Programs\Python\Python311\python.exe` (or `py.exe` launcher path)  
   - Arguments: `"C:\Users\YOUR_USER\Desktop\console\agent\src\main.py" --api http://127.0.0.1:4000`  
   - Start in: `C:\Users\YOUR_USER\Desktop\console\agent`
5. **Settings:** allow task to run on demand.

To run **minimized** instead of fully hidden, use `pythonw.exe` (no console) for the program, or a small VBS wrapper.

## Option B — PowerShell script (installer helper)

From an elevated PowerShell (only if you trust this repo), you can register a scheduled task:

```powershell
cd C:\Users\adn\Desktop\console\agent\scripts
.\install-silent.ps1 -ApiBase "http://127.0.0.1:4000"
```

Edit `install-silent.ps1` paths if your Python or project folder differs.

## Option C — NSSM Windows Service

1. Install [NSSM](https://nssm.cc/).
2. `nssm install AIConsoleAgent` → Application: `py.exe`, Arguments: `C:\path\to\agent\src\main.py --api http://SERVER:4000`, Startup directory: `C:\path\to\agent`.
3. Set service account to a **least-privilege** user (not SYSTEM) unless required.

## Notes

- **Silent** does not mean **safe**: the agent still runs commands as the configured user. Combine with firewall rules, VPN, JWT on sockets, and command allowlists for production.
- For **true** “no window”, prefer **Task Scheduler** with `pythonw.exe` or a service wrapper rather than keeping a terminal open.
