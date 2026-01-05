# electron-forge-maker-innosetup

一个用于 [Electron Forge](https://www.electronforge.io/) 的 Innosetup Maker，支持使用 Innosetup 为 Windows 平台创建安装程序。继承自 `@electron-forge/maker-base`。

## 安装

```bash
npm install --save-dev electron-forge-maker-innosetup
```

## 使用方法

### 导入方式

```typescript
// 命名导入（推荐）
import { MakerInnosetup } from "electron-forge-maker-innosetup";

// 默认导入
import MakerInnosetup from "electron-forge-maker-innosetup";

// 导入解析器
import {
  MakerInnosetup,
  InnoScriptParser,
} from "electron-forge-maker-innosetup";
```

### 🎉 方式一：使用相对路径

**为什么推荐？**

- **可移植** - 配置可在不同机器间共享
- **团队协作** - 每个开发者的路径可以不同
- **CI/CD 友好** - 自动化构建无需修改配置

在 `forge.config.ts` 中：

```typescript
import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerInnosetup } from "electron-forge-maker-innosetup";

const config: ForgeConfig = {
  makers: [
    new MakerInnosetup(
      {
        // 基本信息
        appName: "My Electron App",
        appVersion: "1.0.0",
        appPublisher: "My Company",

        // 使用相对路径 - 自动基于项目根目录解析
        setupIconFile: "./assets/icons/icon.ico",
        licenseFile: "./LICENSE",

        createDesktopIcon: true,

        config: {
          // 使用占位符
          Defines: {
            MyAppName: "My Electron App",
            MyAppExeName: "MyElectronApp.exe",
          },

          Setup: {
            AppName: "{#MyAppName}",
            // 相对路径会自动解析
            SetupIconFile: "./assets/icons/icon.ico",
            ArchitecturesAllowed: "x64compatible",
            PrivilegesRequired: "admin",
          },

          Files: [
            {
              // {build} 占位符会被替换为 Electron Forge 的打包输出目录
              Source: "{build}\\*",
              DestDir: "{app}",
              Flags: "ignoreversion recursesubdirs createallsubdirs",
            },
          ],

          Icons: [
            {
              Name: "{autoprograms}\\{#MyAppName}",
              Filename: "{app}\\{#MyAppExeName}",
            },
          ],

          Run: [
            {
              Filename: "{app}\\{#MyAppExeName}",
              Description: "Launch {#MyAppName}",
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

#### 支持的路径占位符

- `{project}` - 项目根目录
- `{build}` - Electron Forge 打包输出目录
- `{assets}` - 资源文件目录（默认为 `assets`）

示例：

```typescript
setupIconFile: "{assets}/icons/icon.ico",  // 等同于 "./assets/icons/icon.ico"
setupIconFile: "{project}/resources/icon.ico",
Source: "{build}\\*",  // Electron Forge 打包后的文件
```

#### 路径配置

```typescript
new MakerInnosetup({
  // ... 其他配置

  // 路径解析配置
  paths: {
    projectDir: process.cwd(), // 项目根目录，默认为 cwd()
    assetsDir: "resources", // 资源目录，默认为 "assets"
  },

  // 自动解析相对路径，默认为 true
  resolveRelativePaths: true,
});
```

> 📖 **详细文档：**[docs/path-resolution.md](docs/path-resolution.md) - 查看完整的路径解析指南，包括更多示例和最佳实践

### 方式二：使用绝对路径

如果您坚持使用绝对路径，可以禁用自动解析：

```typescript
import type { ForgeConfig } from "@electron-forge/shared-types";
import MakerInnosetup from "electron-forge-maker-innosetup";

const config: ForgeConfig = {
  makers: [
    new MakerInnosetup(
      {
        // 禁用相对路径解析
        resolveRelativePaths: false,

        // 使用绝对路径
        setupIconFile: "E:\\workSpace\\my-app\\assets\\icon.ico",

        config: {
          Setup: {
            SetupIconFile: "E:\\workSpace\\my-app\\assets\\icon.ico",
          },
          Files: [
            {
              Source: "E:\\workSpace\\my-app\\out\\*",
              DestDir: "{app}",
              Flags: "ignoreversion recursesubdirs",
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

### 方式三：使用配置对象

在 `forge.config.js` 中：

```javascript
module.exports = {
  makers: [
    {
      name: "electron-forge-maker-innosetup",
      config: {
        appName: "MyApp",
        appPublisher: "My Company",
        // 相对路径会自动解析
        setupIconFile: "./assets/icon.ico",
      },
    },
  ],
};
```

### 完整配置示例

```typescript
import type { MakerInnosetupConfig } from "electron-forge-maker-innosetup";

const config: MakerInnosetupConfig = {
  // 应用信息
  appName: "MyApp",
  appVersion: "1.0.0",
  appPublisher: "My Company",
  appId: "{{MyUniqueAppId}}",

  // 文件路径
  setupIconFile: "./assets/icon.ico",
  licenseFile: "./LICENSE",

  // 输出配置
  outputDir: "./out/installers",

  // 快捷方式
  createDesktopIcon: true,
  createQuickLaunchIcon: false,

  // Innosetup 编译器路径（可选，会自动查找）
  innosetupPath: "C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe",

  // 完整的 Innosetup 配置
  config: {
    Setup: {
      AppName: "MyApp",
      AppVersion: "1.0.0",
      AppPublisher: "My Company",
      AppPublisherURL: "https://mycompany.com",
      DefaultDirName: "{autopf}\\MyApp",
      DefaultGroupName: "MyApp",
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
    Tasks: [
      {
        Name: "desktopicon",
        Description: "Create a desktop icon",
        GroupDescription: "Additional icons:",
      },
    ],
    Files: [
      {
        Source: "{src}\\*",
        DestDir: "{app}",
        Flags: "ignoreversion recursesubdirs createallsubdirs",
      },
    ],
    Icons: [
      {
        Name: "{group}\\MyApp",
        Filename: "{app}\\MyApp.exe",
      },
      {
        Name: "{autodesktop}\\MyApp",
        Filename: "{app}\\MyApp.exe",
        Tasks: "desktopicon",
      },
    ],
    Run: [
      {
        Filename: "{app}\\MyApp.exe",
        Description: "Launch MyApp",
        Flags: "nowait postinstall skipifsilent",
      },
    ],
  },
};
```

### 使用自定义 Innosetup 脚本

如果您已有现成的 `.iss` 脚本文件：

#### 方法 1: 直接使用 ISS 文件

```javascript
{
  name: 'electron-forge-maker-innosetup',
  config: {
    scriptPath: './installer.iss'
  }
}

```

#### 方法 2: 解析 ISS 文件为配置

```typescript
import { MakerInnosetup } from "electron-forge-maker-innosetup";

// 从 ISS 文件解析配置
const config = MakerInnosetup.fromIssFile("./installer.iss");

// 或者从 ISS 内容解析
const issContent = fs.readFileSync("./installer.iss", "utf-8");
const config2 = MakerInnosetup.fromIssContent(issContent);

// 使用在 forge 配置中
const forgeConfig: ForgeConfig = {
  makers: [
    {
      name: "electron-forge-maker-innosetup",
      config: config, // 使用解析后的配置
      platforms: ["win32"],
    },
  ],
};
```

> 📝 **详细文档**: 查看 [iss-parser.md](./docs/iss-parser.md) 了解 ISS 解析器的完整使用方法

> ⚠️ **重要**: 如果你的 ISS 脚本中定义了 `OutputDir`，Maker 会自动解析并在正确的目录中查找安装包。详见 [custom-script-output.md](./docs/custom-script-output.md)

## 配置选项

### MakerInnosetupConfig

| 选项                    | 类型              | 默认值                    | 说明                                    |
| ----------------------- | ----------------- | ------------------------- | --------------------------------------- |
| `config`                | `InnoSetupConfig` | -                         | 完整的 Innosetup 配置对象               |
| `scriptPath`            | `string`          | -                         | 自定义脚本路径（如果提供则忽略 config） |
| `innosetupPath`         | `string`          | 自动查找                  | Innosetup 编译器路径                    |
| `outputDir`             | `string`          | `./out/innosetup.windows` | 输出目录                                |
| `appName`               | `string`          | -                         | 应用程序名称                            |
| `appVersion`            | `string`          | -                         | 应用程序版本                            |
| `appPublisher`          | `string`          | -                         | 应用程序发布者                          |
| `appId`                 | `string`          | -                         | 应用程序唯一 ID                         |
| `licenseFile`           | `string`          | -                         | 许可证文件路径                          |
| `setupIconFile`         | `string`          | -                         | 安装图标文件路径                        |
| `createDesktopIcon`     | `boolean`         | `false`                   | 是否创建桌面图标                        |
| `createQuickLaunchIcon` | `boolean`         | `false`                   | 是否创建快速启动图标                    |
| `gui`                   | `boolean`         | `false`                   | 是否使用 GUI 模式编译                   |
| `isccOptions`           | `string[]`        | -                         | 额外的 ISCC 命令行参数                  |

### InnoSetupConfig

完整的 Innosetup 配置类型支持，包括以下部分：

- `Setup` - 安装配置
- `Languages` - 语言支持
- `Types` - 安装类型
- `Components` - 组件选项
- `Tasks` - 任务选项
- `Files` - 文件安装
- `Dirs` - 目录创建
- `Icons` - 快捷方式
- `Registry` - 注册表项
- `Run` - 安装后运行
- `UninstallRun` - 卸载时运行
- `InstallDelete` - 安装时删除
- `UninstallDelete` - 卸载时删除
- `INI` - INI 文件操作
- `Messages` - 自定义消息
- `CustomMessages` - 自定义消息
- `Code` - Pascal Script 代码

## 高级用法

### 使用预处理器常量 (#define)

使用 `Defines` 字段可以定义预处理器常量，在配置中使用 `{#ConstantName}` 引用：

```typescript
config: {
  config: {
    // 定义预处理器常量
    Defines: {
      MyAppName: "Self Report",
      MyAppVersion: "1.0.0",
      MyAppPublisher: "信息科技有限公司",
      MyAppExeName: "Self Report.exe",
      MyAppAssocName: "Self Report File",
      MyAppAssocExt: ".myp",
      MyAppShortcutName: "XXXX系统",
    },
    Setup: {
      // 使用 {#ConstantName} 引用预处理器常量
      AppName: "{#MyAppName}",
      AppVersion: "{#MyAppVersion}",
      AppPublisher: "{#MyAppPublisher}",
      DefaultDirName: "{autopf}\\{#MyAppName}",
      OutputBaseFilename: "{#MyAppName}_{#MyAppVersion}",
      ChangesAssociations: true,
    },
    Icons: [
      {
        Name: "{group}\\{#MyAppShortcutName}",
        Filename: "{app}\\{#MyAppExeName}",
      },
    ],
    Registry: [
      {
        Root: "HKCR",
        Subkey: "{#MyAppAssocExt}",
        ValueType: "string",
        ValueName: "",
        ValueData: "{#MyAppAssocName}",
      },
    ],
  },
}
```

生成的 ISS 脚本将包含：

```iss
; Script generated by the Inno Setup Script Wizard.
; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!

#define MyAppName "Self Report"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "信息科技有限公司"
#define MyAppExeName "Self Report.exe"

[Setup]
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
```

**优势：**

- 🔄 更易维护：集中管理常量，修改一处即可
- 📖 更清晰：生成的 ISS 脚本更具可读性
- 🔧 更灵活：支持 Inno Setup 原生的预处理器功能

### 添加自定义 Pascal 代码

```typescript
config: {
  config: {
    Code: `
    function InitializeSetup(): Boolean;
      begin
        Result := True;
        // 自定义初始化逻辑
      end;

      procedure CurStepChanged(CurStep: TSetupStep);
      begin
        if CurStep = ssPostInstall then
      begin
      // 安装后的自定义操作
      end;
    end;
`;
  }
}
```

### 注册表操作

```typescript
config: {
  config: {
    Registry: [
      {
        Root: "HKLM",
        Subkey: "Software\\MyApp",
        ValueType: "string",
        ValueName: "InstallPath",
        ValueData: "{app}",
        Flags: "uninsdeletekey",
      },
    ];
  }
}
```

### 多语言支持

```typescript
config: {
  config: {
    Languages: [
      {
        Name: "english",
        MessagesFile: "compiler:Default.isl",
      },
      {
        Name: "chinesesimplified",
        MessagesFile: "compiler:Languages\\ChineseSimplified.isl",
      },
      {
        Name: "japanese",
        MessagesFile: "compiler:Languages\\Japanese.isl",
      },
    ];
  }
}
```

## 环境变量

- `INNOSETUP_PATH` - 指定 Innosetup 编译器路径

## 编译器查找顺序

1. 配置中指定的路径 (`config.innosetupPath`)
2. 内置便携版 (`vendor/innosetup/ISCC.exe`)
3. 环境变量 (`INNOSETUP_PATH`)
4. 系统安装路径：
   - `C:\Program Files (x86)\Inno Setup 6\ISCC.exe`
   - `C:\Program Files\Inno Setup 6\ISCC.exe`
   - `C:\Program Files (x86)\Inno Setup 5\ISCC.exe`
   - `C:\Program Files\Inno Setup 5\ISCC.exe`

## 许可证

MIT

## 相关链接

- [Electron Forge](https://www.electronforge.io/)
- [Innosetup 官方文档](https://jrsoftware.org/ishelp/)
- [Innosetup 下载](https://jrsoftware.org/isdl.php)
