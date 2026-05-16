$configPath = "${env:ProgramFiles}\ConsoleAgent\console-agent.json"
if (-not (Test-Path $configPath)) {
    Write-Host "Not installed. Run ConsoleAgent-Setup.exe as Admin." -ForegroundColor Yellow
    exit 1
}
$cfg = Get-Content $configPath -Raw | ConvertFrom-Json
Write-Host "apiUrl: $($cfg.apiUrl)"
if ($cfg.apiUrl -match '127\.0\.0\.1|localhost') {
    Write-Host "WRONG: still localhost. Set http://3.26.196.232:4000" -ForegroundColor Red
}
try {
    $r = Invoke-WebRequest "$($cfg.apiUrl)/health" -UseBasicParsing -TimeoutSec 10
    Write-Host "health OK: $($r.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "health FAIL: $_" -ForegroundColor Red
}
