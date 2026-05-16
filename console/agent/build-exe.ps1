$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

Write-Host "Installing dependencies..." -ForegroundColor Cyan
py -m pip install -r requirements.txt -r requirements-build.txt

Write-Host "Building ConsoleAgent.exe..." -ForegroundColor Cyan
py -m PyInstaller --noconfirm console-agent.spec

$exe = Join-Path $here "dist\ConsoleAgent.exe"
if (-not (Test-Path $exe)) {
    Write-Host "Build failed." -ForegroundColor Red
    exit 1
}
Write-Host "OK: $exe" -ForegroundColor Green
