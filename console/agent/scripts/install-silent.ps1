<#
  Registers a Windows Scheduled Task to run the NEXUS INTELLIGENCE agent at logon.
  Run from PowerShell:  .\install-silent.ps1 -ApiBase "http://52.62.136.167:4000"
  Requires: Python on PATH or set -PythonExe to full path to python.exe / py.exe
#>
param(
  [string]$ApiBase = "http://52.62.136.167:4000",
  [string]$PythonExe = "",
  [string]$TaskName = "AIConsoleAgent",
  [switch]$Hidden
)

$ErrorActionPreference = "Stop"
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$agentDir = Join-Path $root "agent"
$scriptPath = Join-Path $agentDir "src\main.py"

if (-not (Test-Path $scriptPath)) {
  throw "Agent script not found: $scriptPath"
}

if (-not $PythonExe) {
  if ($Hidden) {
    $pyw = Get-Command pythonw -ErrorAction SilentlyContinue
    if ($pyw) { $PythonExe = $pyw.Source }
  }
  if (-not $PythonExe) {
    $py = Get-Command py -ErrorAction SilentlyContinue
    if ($py) { $PythonExe = $py.Source }
    else {
      $py = Get-Command python -ErrorAction SilentlyContinue
      if ($py) { $PythonExe = $py.Source }
    }
  }
}
if (-not $PythonExe -or -not (Test-Path $PythonExe)) {
  throw "Python not found. Install Python or pass -PythonExe 'C:\...\python.exe'"
}

$argLine = "`"$scriptPath`" --api $ApiBase"
$action = New-ScheduledTaskAction -Execute $PythonExe -Argument $argLine -WorkingDirectory $agentDir
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Force
Write-Host "Registered scheduled task '$TaskName' -> $ApiBase"
Write-Host "Agent starts at logon (no console if you used -Hidden with pythonw). Open Task Scheduler to review privileges."
