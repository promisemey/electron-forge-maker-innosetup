# 使用示例

## 安装

```bash
npm install --save-dev @electron-forge/maker-innosetup
```

## 配置方式一：简单配置

在 `forge.config.js` 中：

```javascript
module.exports = {
  makers: [
    {
      name: "@electron-forge/maker-innosetup",
      config: {
        appName: "My Electron App",
        appPublisher: "My Company",
        setupIconFile: "./assets/icon.ico",
        createDesktopIcon: true,
      },
    },
  ],
};
```

## 配置方式二：完整 TypeScript 配置

在 `forge.config.ts` 中：

```typescript
import type { ForgeConfig } from "@electron-forge/shared-types";
import MakerInnosetup from "@electron-forge/maker-innosetup";

const config: ForgeConfig = {
  makers: [
    new MakerInnosetup(
      {
        appName: "My Electron App",
        appVersion: "1.0.0",
        appPublisher: "My Company",
        appId: "{{MyElectronApp}}",
        setupIconFile: "./assets/icon.ico",
        licenseFile: "./LICENSE",
        createDesktopIcon: true,
        outputDir: "./out/installers",

        config: {
          Setup: {
            AppName: "My Electron App",
            AppVersion: "1.0.0",
            AppPublisher: "My Company",
            AppPublisherURL: "https://mycompany.com",
            DefaultDirName: "{autopf}\\MyElectronApp",
            Compression: "lzma2",
            SolidCompression: true,
            ArchitecturesAllowed: "x64",
            ArchitecturesInstallIn64BitMode: "x64",
            PrivilegesRequired: "admin",
            WizardStyle: "modern",
          },
          Languages: [
            {
              Name: "english",
              MessagesFile: "compiler:Default.isl",
            },
            {
              Name: "chinesesimplified",
              MessagesFile: "compiler:Languages\\ChineseSimplified.isl",
            },
          ],
          Icons: [
            {
              Name: "{group}\\My Electron App",
              Filename: "{app}\\MyElectronApp.exe",
            },
            {
              Name: "{autodesktop}\\My Electron App",
              Filename: "{app}\\MyElectronApp.exe",
              Tasks: "desktopicon",
            },
          ],
          Run: [
            {
              Filename: "{app}\\MyElectronApp.exe",
              Description: "Launch My Electron App",
              Flags: "nowait postinstall skipifsilent",
            },
          ],
        },
      },
      ["win32"]
    ),
  ],
};

export default config;
```

## 配置方式三：使用自定义脚本

如果你已经有自己的 `.iss` 脚本文件：

```javascript
module.exports = {
  makers: [
    {
      name: "@electron-forge/maker-innosetup",
      config: {
        scriptPath: "./installer.iss",
        innosetupPath: "C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe",
      },
    },
  ],
};
```

## 运行构建

```bash
npm run make
```

或者只为 Windows 构建：

```bash
npm run make -- --platform=win32
```

## 完整项目示例

### package.json

```json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "electron-forge start",
    "package": "electron-forge package",
    "make": "electron-forge make"
  },
  "devDependencies": {
    "@electron-forge/cli": "^7.0.0",
    "@electron-forge/maker-innosetup": "^0.1.0",
    "electron": "^28.0.0"
  }
}
```

### forge.config.ts

```typescript
import type { ForgeConfig } from "@electron-forge/shared-types";
import MakerInnosetup from "@electron-forge/maker-innosetup";

const config: ForgeConfig = {
  packagerConfig: {
    name: "MyElectronApp",
    executableName: "MyElectronApp",
    icon: "./assets/icon",
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    new MakerInnosetup(
      {
        appName: "My Electron App",
        appPublisher: "My Company",
        setupIconFile: "./assets/icon.ico",
        licenseFile: "./LICENSE",
        createDesktopIcon: true,
        config: {
          Setup: {
            Compression: "lzma2",
            SolidCompression: true,
            PrivilegesRequired: "admin",
            WizardStyle: "modern",
          },
        },
      },
      ["win32"]
    ),
  ],
};

export default config;
```

## 高级配置示例

### 添加注册表项

```typescript
config: {
  Registry: [
    {
      Root: 'HKCU',
      Subkey: 'Software\\MyElectronApp',
      ValueType: 'string',
      ValueName: 'InstallPath',
      ValueData: '{app}',
      Flags: 'uninsdeletekey',
    },
    {
      Root: 'HKLM',
      Subkey: 'Software\\MyElectronApp',
      ValueType: 'string',
      ValueName: 'Version',
      ValueData: '1.0.0',
    },
  ],
}
```

### 多组件安装

```typescript
config: {
  Types: [
    {
      Name: 'full',
      Description: 'Full installation',
    },
    {
      Name: 'compact',
      Description: 'Compact installation',
    },
    {
      Name: 'custom',
      Description: 'Custom installation',
      Flags: 'iscustom',
    },
  ],
  Components: [
    {
      Name: 'main',
      Description: 'Main application',
      Types: 'full compact custom',
      Flags: 'fixed',
    },
    {
      Name: 'docs',
      Description: 'Documentation',
      Types: 'full',
    },
    {
      Name: 'examples',
      Description: 'Example files',
      Types: 'full',
    },
  ],
}
```

### 添加自定义 Pascal 代码

```typescript
config: {
  Code: `
function InitializeSetup(): Boolean;
begin
  Result := True;
  if MsgBox('Do you want to continue?', mbConfirmation, MB_YESNO) = IDNO then
    Result := False;
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
  begin
    MsgBox('Installation completed!', mbInformation, MB_OK);
  end;
end;
  `,
}
```

## 环境变量

可以通过环境变量指定 Innosetup 编译器路径：

```bash
set INNOSETUP_PATH=C:\Program Files (x86)\Inno Setup 6\ISCC.exe
npm run make
```

或在 PowerShell 中：

```powershell
$env:INNOSETUP_PATH = "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
npm run make
```
