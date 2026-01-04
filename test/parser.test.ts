/**
 * ISS 解析器测试
 */

import { MakerInnosetup, InnoScriptParser } from "../src/index";

// 测试 ISS 内容解析
const sampleIss = `
; Sample Inno Setup Script

[Setup]
AppName=My Application
AppVersion=1.0.0
AppPublisher=My Company
AppPublisherURL=https://example.com
DefaultDirName={autopf}\\MyApp
DefaultGroupName=My Application
OutputDir=output
OutputBaseFilename=myapp-setup
Compression=lzma2
SolidCompression=yes
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=admin
WizardStyle=modern

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "chinesesimplified"; MessagesFile: "compiler:Languages\\ChineseSimplified.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop icon"; GroupDescription: "Additional icons:"; Flags: unchecked

[Files]
Source: "{src}\\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\\My Application"; Filename: "{app}\\MyApp.exe"
Name: "{autodesktop}\\My Application"; Filename: "{app}\\MyApp.exe"; Tasks: desktopicon

[Registry]
Root: HKCU; Subkey: "Software\\MyApp"; ValueType: string; ValueName: "InstallPath"; ValueData: "{app}"

[Run]
Filename: "{app}\\MyApp.exe"; Description: "Launch My Application"; Flags: nowait postinstall skipifsilent

[Code]
function InitializeSetup(): Boolean;
begin
  Result := True;
end;
`;

console.log("Testing ISS content parsing...");
const config1 = InnoScriptParser.parse(sampleIss);
console.log("Parsed config:", JSON.stringify(config1, null, 2));

console.log("\nTesting MakerInnosetup.fromIssContent()...");
const makerConfig = MakerInnosetup.fromIssContent(sampleIss);
console.log("Maker config:", JSON.stringify(makerConfig, null, 2));

// 测试命名导入
console.log("\nTesting named import { MakerInnosetup }...");
const maker = new MakerInnosetup({
  appName: "TestApp",
  appVersion: "1.0.0",
});
console.log("Maker instance created:", maker.name);

console.log("\n✅ All ISS parser tests passed!");
