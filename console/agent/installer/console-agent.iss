#define MyAppName "Console Agent"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Nexus"
#define MyAppURL "http://52.62.136.167:3000"
#define MyApiURL "http://52.62.136.167:4000"

[Setup]
AppId={{B8E4F2A1-9C3D-4E5F-A1B2-3D4E5F6A7B8C}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
DefaultDirName={autopf}\ConsoleAgent
DisableProgramGroupPage=yes
OutputDir=..\release
OutputBaseFilename=ConsoleAgent-Setup
Compression=lzma2
SolidCompression=yes
PrivilegesRequired=admin
ArchitecturesInstallIn64BitMode=x64compatible

[Files]
Source: "..\release\ConsoleAgent-payload\ConsoleAgent.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\release\ConsoleAgent-payload\console-agent.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "Install-ConsoleAgent.ps1"; DestDir: "{app}"; Flags: ignoreversion
Source: "Uninstall-ConsoleAgent.ps1"; DestDir: "{app}"; Flags: ignoreversion
Source: "README-INSTALL.txt"; DestDir: "{app}"; Flags: ignoreversion

[Run]
Filename: "powershell.exe"; Parameters: "-ExecutionPolicy Bypass -NoProfile -File ""{app}\Install-ConsoleAgent.ps1"" -ApiUrl ""{#MyApiURL}"""; StatusMsg: "Starting agent..."; Flags: runhidden waituntilterminated

[UninstallRun]
Filename: "powershell.exe"; Parameters: "-ExecutionPolicy Bypass -NoProfile -File ""{app}\Uninstall-ConsoleAgent.ps1"""; Flags: runhidden waituntilterminated

[UninstallDelete]
Type: filesandordirs; Name: "{app}"
