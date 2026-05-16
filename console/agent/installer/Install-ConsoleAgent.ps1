<#
.SYNOPSIS
  Installs Console Agent to Program Files + logon scheduled task.
#>
[CmdletBinding()]
param(
    [string]$ApiUrl = "http://3.26.196.232:4000",
    [string]$InstallDir = "$env:ProgramFiles\ConsoleAgent",
    [string]$TaskName = "ConsoleAgent"
)

$ErrorActionPreference = "Stop"

function Test-IsAdmin {
    $p = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $p.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-IsAdmin)) {
    Write-Error "Run as Administrator."
}

$SourceDir = $PSScriptRoot
$exeSrc = Join-Path $SourceDir "ConsoleAgent.exe"
if (-not (Test-Path $exeSrc)) {
    throw "ConsoleAgent.exe not found next to this script."
}

New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
Copy-Item -Force $exeSrc (Join-Path $InstallDir "ConsoleAgent.exe")

$configPath = Join-Path $InstallDir "console-agent.json"
$config = @{ apiUrl = $ApiUrl.Trim().TrimEnd('/'); token = $null }
$config | ConvertTo-Json | Set-Content $configPath -Encoding UTF8

$exePath = Join-Path $InstallDir "ConsoleAgent.exe"
$action = New-ScheduledTaskAction -Execute $exePath -WorkingDirectory $InstallDir
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1)
Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
Start-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue

$uninstall = Join-Path $InstallDir "Uninstall-ConsoleAgent.ps1"
Copy-Item -Force (Join-Path $SourceDir "Uninstall-ConsoleAgent.ps1") $uninstall -ErrorAction SilentlyContinue

$regPath = "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\ConsoleAgent"
New-Item -Path $regPath -Force | Out-Null
Set-ItemProperty $regPath DisplayName "Console Agent"
Set-ItemProperty $regPath DisplayVersion "1.0.0"
Set-ItemProperty $regPath Publisher "Nexus"
Set-ItemProperty $regPath InstallLocation $InstallDir
Set-ItemProperty $regPath UninstallString "powershell.exe -ExecutionPolicy Bypass -File `"$uninstall`""

Write-Host ""
Write-Host "Installed: $InstallDir" -ForegroundColor Green
Write-Host "API:       $($config.apiUrl)" -ForegroundColor Green
Write-Host "Portal:    http://3.26.196.232:3000" -ForegroundColor Cyan
Write-Host "Task:      $TaskName (runs at logon)" -ForegroundColor Green
