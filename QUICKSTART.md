# 快速开始指南

## 1. 安装

```bash
npm install --save-dev @electron-forge/maker-innosetup
```

## 2. 准备 Innosetup

### 方式一：使用内置便携版（推荐）

将 Innosetup 便携版放置在 `vendor/innosetup/app` 目录：

```
your-project/
└── node_modules/
    └── @electron-forge/
        └── maker-innosetup/
            └── vendor/
                └── innosetup/
                    ├── ISCC.exe
                    ├── ISCmplr.dll
                    ├── Default.isl
                    └── Languages/
```

**获取便携版：**

1. 从 [Innosetup 官网](https://jrsoftware.org/isdl.php) 下载安装版
2. 安装后，从安装目录复制以下文件到 `vendor/innosetup/`：
   - ISCC.exe（命令行编译器）
   - ISCmplr.dll（编译器 DLL）
   - Default.isl（默认语言文件）
   - Languages/（语言文件目录）
   - Setup.e32, SetupLdr.e32（可选）

### 方式二：系统安装

从 [Innosetup 官网](https://jrsoftware.org/isdl.php) 下载并安装 Innosetup。

推荐安装位置：`C:\Program Files (x86)\Inno Setup 6\`

## 3. 配置 Electron Forge

### TypeScript 项目

创建或编辑 `forge.config.ts`：

```typescript
import type { ForgeConfig } from "@electron-forge/shared-types";
import MakerInnosetup from "@electron-forge/maker-innosetup";

const config: ForgeConfig = {
  packagerConfig: {
    name: "MyApp",
    executableName: "MyApp",
    icon: "./assets/icon", // .ico 文件路径（不含扩展名）
  },
  makers: [
    // 添加 Innosetup Maker
    new MakerInnosetup(
      {
        // 应用基本信息
        appName: "My Application",
        appPublisher: "My Company",
        appId: "{{MyApp}}", // 唯一 ID

        // 图标和许可证
        setupIconFile: "./assets/icon.ico",
        licenseFile: "./LICENSE",

        // 快捷方式选项
        createDesktopIcon: true,
        createQuickLaunchIcon: false,

        // 输出目录
        outputDir: "./out/installers",
      },
      ["win32"]
    ), // 指定平台
  ],
};

export default config;
```

### JavaScript 项目

创建或编辑 `forge.config.js`：

```javascript
module.exports = {
  packagerConfig: {
    name: "MyApp",
    executableName: "MyApp",
    icon: "./assets/icon",
  },
  makers: [
    {
      name: "@electron-forge/maker-innosetup",
      config: {
        appName: "My Application",
        appPublisher: "My Company",
        setupIconFile: "./assets/icon.ico",
        licenseFile: "./LICENSE",
        createDesktopIcon: true,
      },
    },
  ],
};
```

## 4. 构建安装包

```bash
npm run make
```

或者只为 Windows 构建：

```bash
npm run make -- --platform=win32
```

## 5. 查找生成的安装包

构建完成后，安装包位于：

```
./out/installers/MyApp-1.0.0-x64-setup.exe
```

## 常见问题

### Q: 找不到 Innosetup 编译器？

**A:** 设置环境变量：

```bash
# Windows CMD
set INNOSETUP_PATH=C:\Program Files (x86)\Inno Setup 6\ISCC.exe

# Windows PowerShell
$env:INNOSETUP_PATH = "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
```

或在配置中指定：

```typescript
new MakerInnosetup({
  innosetupPath: "C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe",
  // ...
});
```

### Q: 如何添加多语言支持？

**A:**

```typescript
new MakerInnosetup({
  config: {
    Languages: [
      { Name: "english", MessagesFile: "compiler:Default.isl" },
      {
        Name: "chinesesimplified",
        MessagesFile: "compiler:Languages\\ChineseSimplified.isl",
      },
      { Name: "japanese", MessagesFile: "compiler:Languages\\Japanese.isl" },
    ],
  },
});
```

### Q: 如何自定义安装选项？

**A:**

```typescript
new MakerInnosetup({
  config: {
    Setup: {
      Compression: "lzma2",
      SolidCompression: true,
      PrivilegesRequired: "admin",
      WizardStyle: "modern",
    },
    Tasks: [
      {
        Name: "desktopicon",
        Description: "创建桌面图标",
        GroupDescription: "附加图标：",
      },
    ],
  },
});
```

### Q: 如何添加注册表项？

**A:**

```typescript
new MakerInnosetup({
  config: {
    Registry: [
      {
        Root: "HKCU",
        Subkey: "Software\\MyApp",
        ValueType: "string",
        ValueName: "InstallPath",
        ValueData: "{app}",
        Flags: "uninsdeletekey",
      },
    ],
  },
});
```

## 下一步

- 查看 [完整配置示例](./example/forge.config.ts)
- 阅读 [详细使用文档](./USAGE.md)
- 查阅 [API 文档](./docs/API.md)
- 浏览 [Innosetup 官方文档](https://jrsoftware.org/ishelp/)

## 完整示例

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
            AppPublisherURL: "https://mycompany.com",
            AppSupportURL: "https://mycompany.com/support",
            Compression: "lzma2",
            SolidCompression: true,
            PrivilegesRequired: "admin",
            WizardStyle: "modern",
          },
          Languages: [
            { Name: "english", MessagesFile: "compiler:Default.isl" },
            {
              Name: "chinesesimplified",
              MessagesFile: "compiler:Languages\\ChineseSimplified.isl",
            },
          ],
          Run: [
            {
              Filename: "{app}\\MyElectronApp.exe",
              Description: "启动应用",
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

现在运行 `npm run make` 即可生成专业的 Windows 安装包！
