param(
  [Parameter(Mandatory = $true)]
  [string]$Path
)
$ErrorActionPreference = 'Stop'
$raw = [System.IO.File]::ReadAllText($Path)
$tokens = $null
$errs = $null
[void][System.Management.Automation.Language.Parser]::ParseInput($raw, [ref]$tokens, [ref]$errs)
foreach ($x in @($errs)) {
  if ($null -eq $x) { continue }
  if ($x.IncompleteInput) { exit 1 }
  $m = [string]$x.Message
  if ($m -match '(?i)\b(missing|incomplete)\b') { exit 1 }
}
exit 0
