export type QuickToolShell = 'cmd' | 'powershell';

export type QuickTool = {
  id: string;
  label: string;
  shell: QuickToolShell;
  /** Sent as one line (trailing \\n added by UI). */
  command: string;
};

export type QuickToolGroup = { title: string; tools: QuickTool[] };

/** Presets only — same limits as typing in the panel (no interactive stdin). */
export const WINDOWS_QUICK_TOOL_GROUPS: QuickToolGroup[] = [
  {
    title: 'Identity / policy',
    tools: [
      { id: 'sys32', label: 'Open System32 (Explorer)', shell: 'cmd', command: 'explorer C:\\Windows\\System32' },
      { id: 'whoami', label: 'whoami /all', shell: 'cmd', command: 'whoami /all' },
      { id: 'groups', label: 'net localgroup', shell: 'cmd', command: 'net localgroup' },
      { id: 'execpol', label: 'PS execution policy', shell: 'powershell', command: 'Get-ExecutionPolicy -List | Format-Table -AutoSize | Out-String -Width 220' },
      { id: 'psver', label: 'PS version table', shell: 'powershell', command: '$PSVersionTable | Format-List | Out-String -Width 220' },
    ],
  },
  {
    title: 'Network',
    tools: [
      { id: 'ipconfig', label: 'ipconfig /all', shell: 'cmd', command: 'ipconfig /all' },
      { id: 'netstat', label: 'netstat -ano', shell: 'cmd', command: 'netstat -ano' },
      { id: 'ping', label: 'ping 127.0.0.1', shell: 'cmd', command: 'ping -n 2 127.0.0.1' },
      { id: 'route', label: 'route print', shell: 'cmd', command: 'route print' },
      { id: 'arp', label: 'arp -a', shell: 'cmd', command: 'arp -a' },
    ],
  },
  {
    title: 'Processes / tasks',
    tools: [
      { id: 'tasklist', label: 'tasklist', shell: 'cmd', command: 'tasklist' },
      { id: 'qprocess', label: 'qprocess *', shell: 'cmd', command: 'qprocess *' },
      { id: 'schtasks', label: 'schtasks /query (table)', shell: 'cmd', command: 'schtasks /query /FO TABLE' },
      { id: 'psprocs', label: 'PS top CPU (sample)', shell: 'powershell', command: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 15 ProcessName,Id,CPU,WS | Format-Table -AutoSize | Out-String -Width 220' },
    ],
  },
  {
    title: 'Services (sc)',
    tools: [
      { id: 'scquery', label: 'sc query (first services)', shell: 'cmd', command: 'sc query type= service state= all' },
      { id: 'scqueryex', label: 'sc queryex (brief)', shell: 'cmd', command: 'sc queryex type= service state= active' },
    ],
  },
  {
    title: 'Registry (reg)',
    tools: [
      { id: 'regwin', label: 'reg query HKLM\\...\\CurrentVersion', shell: 'cmd', command: 'reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion"' },
      { id: 'regrun', label: 'reg query Run keys', shell: 'cmd', command: 'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"' },
    ],
  },
  {
    title: 'Users / shares (net)',
    tools: [
      { id: 'netuser', label: 'net user', shell: 'cmd', command: 'net user' },
      { id: 'netaccounts', label: 'net accounts', shell: 'cmd', command: 'net accounts' },
      { id: 'netshare', label: 'net share', shell: 'cmd', command: 'net share' },
      { id: 'netstatnet', label: 'netstat -n', shell: 'cmd', command: 'netstat -n' },
    ],
  },
  {
    title: 'Defender / AV (read-only samples)',
    tools: [
      {
        id: 'defpref',
        label: 'Get-MpPreference (sample)',
        shell: 'powershell',
        command: 'try { Get-MpPreference | Select-Object DisableRealtimeMonitoring,MAPSReporting,SubmitSamplesConsent | Format-List | Out-String -Width 220 } catch { $_.Exception.Message }',
      },
      {
        id: 'defstatus',
        label: 'Get-MpComputerStatus (sample)',
        shell: 'powershell',
        command: 'try { Get-MpComputerStatus | Select-Object AMServiceEnabled,AntispywareEnabled,AntivirusEnabled,NISEnabled,RealTimeProtectionEnabled | Format-List | Out-String -Width 220 } catch { $_.Exception.Message }',
      },
    ],
  },
  {
    title: 'DISM / SFC (slow — admin)',
    tools: [
      { id: 'dismhelp', label: 'DISM /?', shell: 'cmd', command: 'DISM /?' },
      { id: 'dismscan', label: 'DISM ScanHealth (long)', shell: 'cmd', command: 'DISM /Online /Cleanup-Image /ScanHealth' },
      { id: 'sfcverify', label: 'SFC /verifyonly', shell: 'cmd', command: 'sfc /verifyonly' },
    ],
  },
  {
    title: 'WMIC / CIM',
    tools: [
      { id: 'wmicos', label: 'wmic os (if available)', shell: 'cmd', command: 'wmic os get Caption,Version,OSArchitecture /format:list' },
      {
        id: 'cimos',
        label: 'CIM OS (modern)',
        shell: 'powershell',
        command: 'Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,OSArchitecture,LastBootUpTime | Format-List | Out-String -Width 220',
      },
    ],
  },
  {
    title: 'Events / GP / drivers (samples)',
    tools: [
      {
        id: 'appev',
        label: 'Application log (25)',
        shell: 'powershell',
        command: 'Get-WinEvent -LogName Application -MaxEvents 25 -ErrorAction SilentlyContinue | Format-Table TimeCreated,Id,LevelDisplayName -AutoSize | Out-String -Width 220',
      },
      { id: 'gpreport', label: 'gpresult /R', shell: 'cmd', command: 'gpresult /R' },
      { id: 'drvquery', label: 'driverquery (table)', shell: 'cmd', command: 'driverquery /FO table' },
    ],
  },
  {
    title: 'Clean audit (script file)',
    tools: [
      {
        id: 'cleanaudit',
        label: 'Run read-audit-clean.ps1 (plain text)',
        shell: 'powershell',
        command:
          "if (Test-Path '.\\\\scripts\\\\read-audit-clean.ps1') { & '.\\\\scripts\\\\read-audit-clean.ps1' } elseif (Test-Path (Join-Path $env:USERPROFILE 'Desktop\\\\console\\\\agent\\\\scripts\\\\read-audit-clean.ps1')) { & (Join-Path $env:USERPROFILE 'Desktop\\\\console\\\\agent\\\\scripts\\\\read-audit-clean.ps1') } else { Write-Output 'read-audit-clean.ps1 not found. cd to the repo agent folder (where scripts\\\\ lives) or run the file by full path - see agent\\\\scripts\\\\README.md.' }",
      },
    ],
  },
];
