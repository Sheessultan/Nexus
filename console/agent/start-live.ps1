# Run agent on THIS Windows PC against AWS API (live).
# Usage (Admin optional):  .\start-live.ps1

$Api = "http://52.62.136.167:4000"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

Write-Host "Portal: http://52.62.136.167:3000" -ForegroundColor Cyan
Write-Host "API:    $Api" -ForegroundColor Cyan
Write-Host "Starting agent..." -ForegroundColor Green

py -m pip install -q -r requirements.txt
py src\main.py --api $Api
