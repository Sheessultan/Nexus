<#
  Installs Python dependencies for the Console Windows agent under an elevated
  session. If not admin, re-launches this script with UAC so pip and the agent
  can run with full rights when you need elevated shells.

  Usage (from repo):
    cd agent
    powershell -ExecutionPolicy Bypass -File .\scripts\install-agent-elevated.ps1
#>
$ErrorActionPreference = 'Stop'
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
  [Security.Principal.WindowsBuiltInRole]::Administrator
)
if (-not $isAdmin) {
  Write-Host 'Requesting Administrator rights…' -ForegroundColor Yellow
  $here = Split-Path -Parent $MyInvocation.MyCommand.Path
  $script = Join-Path $here 'install-agent-elevated.ps1'
  Start-Process -FilePath 'powershell.exe' -Verb RunAs -ArgumentList @(
    '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $script
  ) | Out-Null
  exit 0
}

$root = (Resolve-Path (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) '..')).Path
Set-Location $root
Write-Host "Installing agent deps in: $root" -ForegroundColor Cyan
$py = Get-Command py -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
if (-not $py) {
  $py = Get-Command python -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
}
if (-not $py) {
  Write-Error 'Python launcher not found. Install Python 3.10+ and ensure py.exe or python.exe is on PATH.'
}
& $py -m pip install -r (Join-Path $root 'requirements.txt')
Write-Host 'Done. Run the agent with: py src\main.py --api http://127.0.0.1:4000' -ForegroundColor Green
