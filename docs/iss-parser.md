# ISS 文件解析器

这个包现在支持从 Inno Setup 脚本文件（.iss）解析配置，并转换为 `MakerInnosetupConfig` 对象。

## 功能特性

1. ✅ **命名导出支持**：可以使用 `{ MakerInnosetup }` 导入
2. ✅ **ISS 文件解析**：将 .iss 文件转换为配置对象
3. ✅ **ISS 内容解析**：直接解析 ISS 脚本内容
4. ✅ **完整段落支持**：支持所有 Inno Setup 段落（Setup, Files, Icons, Registry, Code 等）

## 安装

```bash
npm install electron-forge-maker-innosetup
```

## 导入方式

### 1. 命名导入（推荐）

```typescript
import { MakerInnosetup } from "electron-forge-maker-innosetup";
```

### 2. 默认导入

```typescript
import MakerInnosetup from "electron-forge-maker-innosetup";
```

### 3. 导入解析器

```typescript
import {
  MakerInnosetup,
  InnoScriptParser,
} from "electron-forge-maker-innosetup";
```

## 使用方法

### 方法 1: 从 ISS 文件创建配置

```typescript
import { MakerInnosetup } from "electron-forge-maker-innosetup";

// 从现有的 ISS 文件创建配置
const config = MakerInnosetup.fromIssFile("./path/to/installer.iss");

// 使用配置创建 Maker 实例
const maker = new MakerInnosetup(config);
```

### 方法 2: 从 ISS 内容创建配置

```typescript
import { MakerInnosetup } from "electron-forge-maker-innosetup";

const issContent = `
[Setup]
AppName=My Application
AppVersion=1.0.0
AppPublisher=My Company
DefaultDirName={autopf}\\MyApp
ArchitecturesAllowed=x64compatible
SolidCompression=yes

[Files]
Source: "{src}\\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs

[Icons]
Name: "{group}\\My Application"; Filename: "{app}\\MyApp.exe"
`;

// 从 ISS 内容创建配置
const config = MakerInnosetup.fromIssContent(issContent);

// 使用配置
const maker = new MakerInnosetup(config);
```

### 方法 3: 直接使用解析器

```typescript
import {
  InnoScriptParser,
  MakerInnosetupConfig,
} from "electron-forge-maker-innosetup";
import * as fs from "fs";

// 解析 ISS 文件
const issConfig = InnoScriptParser.parseFile("./installer.iss");

// 或者解析 ISS 内容
const issContent = fs.readFileSync("./installer.iss", "utf-8");
const issConfig2 = InnoScriptParser.parse(issContent);

// 转换为 MakerInnosetupConfig
const makerConfig: MakerInnosetupConfig = {
  config: issConfig,
  // 可以添加其他 Maker 特定的配置
  innosetupPath: "C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe",
  outputDir: "./out/installers",
};
```

## 在 Electron Forge 中使用

### forge.config.ts

```typescript
import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerInnosetup } from "electron-forge-maker-innosetup";

// 从现有的 ISS 文件加载配置
const innosetupConfig = MakerInnosetup.fromIssFile("./installer.iss");

const config: ForgeConfig = {
  packagerConfig: {
    name: "MyApp",
    executableName: "MyApp",
  },
  makers: [
    // 方法 1: 使用解析的配置
    {
      name: "electron-forge-maker-innosetup",
      config: innosetupConfig,
      platforms: ["win32"],
    },

    // 方法 2: 直接指定 ISS 文件
    {
      name: "electron-forge-maker-innosetup",
      config: {
        scriptPath: "./installer.iss", // 直接使用现有的 ISS 文件
        innosetupPath: "C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe",
      },
      platforms: ["win32"],
    },
  ],
};

export default config;
```

## 支持的 ISS 段落

解析器支持以下所有 Inno Setup 段落：

- ✅ **[Setup]** - 基本设置（AppName, AppVersion, 架构配置等）
- ✅ **[Languages]** - 语言配置
- ✅ **[Tasks]** - 任务（如桌面图标）
- ✅ **[Types]** - 安装类型（完整安装、最小安装等）
- ✅ **[Components]** - 组件
- ✅ **[Files]** - 文件列表
- ✅ **[Dirs]** - 目录
- ✅ **[Icons]** - 快捷方式
- ✅ **[INI]** - INI 文件配置
- ✅ **[InstallDelete]** - 安装前删除
- ✅ **[UninstallDelete]** - 卸载时删除
- ✅ **[Registry]** - 注册表项
- ✅ **[Run]** - 安装后运行
- ✅ **[UninstallRun]** - 卸载时运行
- ✅ **[Messages]** - 自定义消息
- ✅ **[CustomMessages]** - 自定义消息
- ✅ **[Code]** - Pascal 脚本代码

## 示例：从 ISS 文件迁移

假设你有一个现有的 ISS 文件：

```ini
; installer.iss
[Setup]
AppName=My Electron App
AppVersion=2.0.0
AppPublisher=My Company
AppPublisherURL=https://mycompany.com
DefaultDirName={autopf}\\MyElectronApp
DefaultGroupName=My Electron App
OutputDir=installers
OutputBaseFilename=MyElectronApp-Setup
Compression=lzma2
SolidCompression=yes
ArchitecturesAllowed=x64compatible and x86compatible
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=admin
WizardStyle=modern
SetupIconFile=assets\icon.ico
UninstallDisplayIcon={app}\MyElectronApp.exe

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "chinesesimplified"; MessagesFile: "compiler:Languages\ChineseSimplified.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop icon"; GroupDescription: "Additional icons:"; Flags: unchecked

[Files]
Source: "dist\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\My Electron App"; Filename: "{app}\MyElectronApp.exe"
Name: "{autodesktop}\My Electron App"; Filename: "{app}\MyElectronApp.exe"; Tasks: desktopicon
Name: "{group}\Uninstall My Electron App"; Filename: "{uninstallexe}"

[Registry]
Root: HKCU; Subkey: "Software\MyElectronApp"; ValueType: string; ValueName: "InstallPath"; ValueData: "{app}"

[Run]
Filename: "{app}\MyElectronApp.exe"; Description: "Launch My Electron App"; Flags: nowait postinstall skipifsilent
```

**迁移到 Electron Forge：**

```typescript
// forge.config.ts
import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerInnosetup } from "electron-forge-maker-innosetup";
import * as path from "path";

const config: ForgeConfig = {
  packagerConfig: {
    name: "MyElectronApp",
    executableName: "MyElectronApp",
    icon: "./assets/icon",
  },
  makers: [
    {
      name: "electron-forge-maker-innosetup",
      // 选项 1: 直接使用现有的 ISS 文件
      config: {
        scriptPath: path.resolve(__dirname, "installer.iss"),
      },

      // 选项 2: 解析 ISS 文件并使用配置
      // config: MakerInnosetup.fromIssFile("./installer.iss"),

      platforms: ["win32"],
    },
  ],
};

export default config;
```

## 高级用法

### 修改解析后的配置

```typescript
import { MakerInnosetup } from "electron-forge-maker-innosetup";

// 从 ISS 文件解析
const config = MakerInnosetup.fromIssFile("./installer.iss");

// 修改配置
config.config!.Setup!.AppVersion = "3.0.0";
config.config!.Setup!.ArchitecturesAllowed = "x64compatible and not arm64";

// 添加新的文件
config.config!.Files = config.config!.Files || [];
config.config!.Files.push({
  Source: "extra-files\\*",
  DestDir: "{app}\\extras",
  Flags: "ignoreversion",
});

// 使用修改后的配置
const maker = new MakerInnosetup(config);
```

### 合并多个配置

```typescript
import {
  MakerInnosetup,
  InnoScriptParser,
} from "electron-forge-maker-innosetup";

// 解析基础配置
const baseConfig = InnoScriptParser.parseFile("./base.iss");

// 解析特定平台的配置
const x64Config = InnoScriptParser.parseFile("./x64-specific.iss");

// 合并配置
const mergedConfig = {
  config: {
    Setup: {
      ...baseConfig.Setup,
      ...x64Config.Setup,
    },
    Files: [...(baseConfig.Files || []), ...(x64Config.Files || [])],
    // ... 合并其他段落
  },
};

const maker = new MakerInnosetup(mergedConfig);
```

## 解析器注意事项

1. **注释处理**：解析器会忽略以 `;` 或 `//` 开头的注释行
2. **空行处理**：空行会被自动忽略
3. **引号处理**：参数值的引号会被自动移除
4. **布尔值转换**：`yes`/`no` 会被转换为 `true`/`false`
5. **数字转换**：纯数字字符串会被转换为数字类型
6. **Code 段落**：[Code] 段落的内容会被完整保留

## API 参考

### MakerInnosetup 类

#### 静态方法

- **`fromIssFile(issFilePath: string): MakerInnosetupConfig`**
  - 从 ISS 文件路径解析配置
  - 返回包含解析后配置的 `MakerInnosetupConfig` 对象

- **`fromIssContent(issContent: string): MakerInnosetupConfig`**
  - 从 ISS 脚本内容解析配置
  - 返回包含解析后配置的 `MakerInnosetupConfig` 对象

### InnoScriptParser 类

#### 静态方法

- **`parseFile(issFilePath: string): InnoSetupConfig`**
  - 从文件路径解析 ISS 脚本
  - 返回 `InnoSetupConfig` 对象

- **`parse(content: string): InnoSetupConfig`**
  - 从字符串内容解析 ISS 脚本
  - 返回 `InnoSetupConfig` 对象

## 相关文档

- [TYPE_FIXES.md](./TYPE_FIXES.md) - 类型定义修正
- [ARCHITECTURE_OUTPUT.md](./ARCHITECTURE_OUTPUT.md) - 架构感知输出目录
- [Inno Setup 官方文档](https://jrsoftware.org/ishelp/)

## 贡献

欢迎提交 Issue 和 Pull Request！
