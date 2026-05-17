# Output: agent\release\ConsoleAgent-Setup.exe + ConsoleAgent-1.0.0.zip
$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

$version = "1.0.0"
$apiUrl = "http://52.62.136.167:4000"
$portalUrl = "http://52.62.136.167:3000"

& "$here\build-exe.ps1"

$releaseRoot = Join-Path $here "release"
$payloadDir = Join-Path $releaseRoot "ConsoleAgent-payload"
if (Test-Path $releaseRoot) { Remove-Item -Recurse -Force $releaseRoot }
New-Item -ItemType Directory -Force -Path $payloadDir | Out-Null

Copy-Item -Force (Join-Path $here "dist\ConsoleAgent.exe") (Join-Path $payloadDir "ConsoleAgent.exe")
@{ apiUrl = $apiUrl; token = $null } | ConvertTo-Json | Set-Content (Join-Path $payloadDir "console-agent.json") -Encoding UTF8

$installer = Join-Path $here "installer"
foreach ($f in @(
    "Install-ConsoleAgent.ps1",
    "Uninstall-ConsoleAgent.ps1",
    "INSTALL.bat",
    "check-agent.ps1",
    "README-INSTALL.txt"
)) {
    $src = Join-Path $installer $f
    if (Test-Path $src) { Copy-Item -Force $src $payloadDir }
}

$zipPath = Join-Path $releaseRoot "ConsoleAgent-$version.zip"
Compress-Archive -Path "$payloadDir\*" -DestinationPath $zipPath -Force
Write-Host "ZIP:  $zipPath" -ForegroundColor Green

$isccPath = @(
    "${env:LOCALAPPDATA}\Programs\Inno Setup 6\ISCC.exe",
    "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe",
    "${env:ProgramFiles}\Inno Setup 6\ISCC.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($isccPath) {
    Write-Host "Building Setup.exe..." -ForegroundColor Cyan
    & $isccPath (Join-Path $installer "console-agent.iss")
    $setup = Join-Path $releaseRoot "ConsoleAgent-Setup.exe"
    if (Test-Path $setup) { Write-Host "Setup: $setup" -ForegroundColor Green }
} else {
    Write-Host "Inno Setup not found - only ZIP/exe in dist and payload." -ForegroundColor Yellow
    Write-Host "Install Inno Setup 6 and re-run, or distribute the ZIP folder." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Install on any Windows PC (Run as Administrator):" -ForegroundColor Cyan
Write-Host "  release\ConsoleAgent-Setup.exe" -ForegroundColor White
Write-Host "Portal: $portalUrl" -ForegroundColor Cyan
Write-Host "API:    $apiUrl" -ForegroundColor Cyan
