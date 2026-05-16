#Requires -Version 5.1
<#
.SYNOPSIS
  Read-only host summary for redirected / NonInteractive PowerShell (no CLIXML spam).

.DESCRIPTION
  Avoids Write-Host (Information stream). Writes plain text via [Console]::Out so output
  stays readable when stdout is captured (e.g. NEXUS INTELLIGENCE agent, CI, WinRM).

.NOTES
  Run examples:
    powershell.exe -NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -File .\read-audit-clean.ps1
    powershell.exe -NoLogo -NoProfile -NonInteractive -Command "& 'C:\path\to\read-audit-clean.ps1'"
#>

[CmdletBinding()]
param()

$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'
$VerbosePreference = 'SilentlyContinue'
$WarningPreference = 'SilentlyContinue'
$InformationPreference = 'SilentlyContinue'

function Write-PlainLine {
    param([string]$Text = '')
    [Console]::Out.WriteLine($Text)
}

function Write-PlainSection {
    param([string]$Title)
    Write-PlainLine ''
    Write-PlainLine "===== $Title ====="
}

Write-PlainLine 'READ-ONLY AUDIT SUMMARY (plain text)'
Write-PlainLine ('Generated: {0}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz'))

try {
    $elevated = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
        [Security.Principal.WindowsBuiltInRole]::Administrator)
    Write-PlainSection 'SESSION'
    Write-PlainLine ('User: {0}' -f $env:USERNAME)
    Write-PlainLine ('Elevated: {0}' -f $elevated)
}
catch {
    Write-PlainSection 'SESSION'
    Write-PlainLine ('User: {0}' -f $env:USERNAME)
}

Write-PlainSection 'SYSTEM'
try {
    $os = Get-CimInstance Win32_OperatingSystem -ErrorAction Stop
    $cs = Get-CimInstance Win32_ComputerSystem -ErrorAction SilentlyContinue
    $bios = Get-CimInstance Win32_BIOS -ErrorAction SilentlyContinue
    Write-PlainLine ('Caption: {0}' -f $os.Caption)
    Write-PlainLine ('Version: {0}' -f $os.Version)
    Write-PlainLine ('Architecture: {0}' -f $os.OSArchitecture)
    Write-PlainLine ('Computer: {0}' -f $cs.Name)
    Write-PlainLine ('Manufacturer / Model: {0} / {1}' -f $cs.Manufacturer, $cs.Model)
    if ($bios.SMBIOSBIOSVersion) {
        Write-PlainLine ('BIOS: {0}' -f ($bios.SMBIOSBIOSVersion -join ', '))
    }
}
catch {
    Write-PlainLine ('(system query failed: {0})' -f $_.Exception.Message)
}

Write-PlainSection 'LOGGED-IN SESSIONS'
try {
    $qu = (query user 2>$null | Out-String -Width 400).TrimEnd()
    if ($qu) { Write-PlainLine $qu } else { Write-PlainLine '(no output from query user)' }
}
catch {
    Write-PlainLine ('(query user failed: {0})' -f $_.Exception.Message)
}

Write-PlainSection 'LOCAL USERS (summary)'
try {
    Get-LocalUser -ErrorAction Stop |
        Select-Object Name, Enabled, LastLogon |
        Format-Table -AutoSize |
        Out-String -Width 220 |
        ForEach-Object { $_.TrimEnd() } |
        Write-PlainLine
}
catch {
    Write-PlainLine ('(Get-LocalUser failed: {0})' -f $_.Exception.Message)
}

Write-PlainSection 'DRIVES'
try {
    Get-PSDrive -PSProvider FileSystem -ErrorAction Stop |
        Select-Object Name, @{n = 'UsedGB'; e = { [math]::Round($_.Used / 1GB, 2) } }, @{n = 'FreeGB'; e = { [math]::Round($_.Free / 1GB, 2) } } |
        Format-Table -AutoSize |
        Out-String -Width 120 |
        ForEach-Object { $_.TrimEnd() } |
        Write-PlainLine
}
catch {
    Write-PlainLine ('(drives failed: {0})' -f $_.Exception.Message)
}

Write-PlainSection 'NETWORK ADAPTERS'
try {
    Get-NetAdapter -ErrorAction Stop |
        Where-Object { $_.Status -eq 'Up' -or $_.Status -eq 'Disconnected' } |
        Select-Object Name, Status, LinkSpeed, MacAddress -First 20 |
        Format-Table -AutoSize |
        Out-String -Width 220 |
        ForEach-Object { $_.TrimEnd() } |
        Write-PlainLine
}
catch {
    Write-PlainLine ('(adapters failed: {0})' -f $_.Exception.Message)
}

Write-PlainSection 'IP CONFIG (summary)'
try {
    $ip = (ipconfig | Out-String -Width 400).TrimEnd()
    Write-PlainLine $ip
}
catch {
    Write-PlainLine ('(ipconfig failed: {0})' -f $_.Exception.Message)
}

Write-PlainLine ''
Write-PlainLine '--- end ---'
