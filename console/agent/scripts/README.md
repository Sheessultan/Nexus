# Agent helper scripts

## `read-audit-clean.ps1`

Plain-text, read-only summary for **NonInteractive** / redirected sessions (avoids CLIXML from `Write-Host` / Information stream).

Run from the machine where the agent runs:

```powershell
cd C:\path\to\console\agent\scripts
powershell.exe -NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -File .\read-audit-clean.ps1
```

From the NEXUS INTELLIGENCE **PowerShell** tab (after `cd` to the folder that contains `scripts`):

```powershell
powershell -NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -File .\scripts\read-audit-clean.ps1
```

Use the **full path** to the script if your current directory is not the repo `agent` folder.
