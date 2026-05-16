param(
    [string]$InstallDir = "$env:ProgramFiles\ConsoleAgent",
    [string]$TaskName = "ConsoleAgent"
)
$ErrorActionPreference = "Stop"
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
Get-Process -Name "ConsoleAgent" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1
Remove-Item -Recurse -Force $InstallDir -ErrorAction SilentlyContinue
Remove-Item "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\ConsoleAgent" -ErrorAction SilentlyContinue
Write-Host "Console Agent removed." -ForegroundColor Green
