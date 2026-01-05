# 路径解析指南

## 问题背景

在使用绝对路径时会遇到以下问题：

```typescript
// ❌ 问题配置 - 使用硬编码的绝对路径
config: {
  Setup: {
    SetupIconFile: "E:\\workSpace\\police-self-report\\assets\\icons\\win32.ico",
  },
  Files: [
    {
      Source: "E:\\workSpace\\police-self-report\\out\\PoliceSelfReport-win32-x64\\*",
      DestDir: "{app}",
    },
  ],
}
```

**问题：**

- 🚫 不可移植 - 绑定到特定机器的路径
- 🚫 团队协作困难 - 每个开发者路径都不同
- 🚫 CI/CD 不兼容 - 自动化构建环境路径完全不同

## 解决方案

### 💡 推荐方案：使用 Inno Setup Defines + 相对路径

最佳实践是使用 Inno Setup 的 `#define` 预处理器定义路径前缀，结合相对路径：

```typescript
// ✅ 最佳实践 - 使用 Defines 定义
config: {
  Defines: {
    // 定义源文件目录（插件会自动设置为打包输出目录）
    SourceDir: "E:\\actual\\build\\path",  // 运行时自动设置
    MyAppExeName: "Police Self Report.exe",
  },
  Setup: {
    SetupIconFile: "./assets/icons/win32.ico",  // 相对于项目根目录
  },
  Files: [
    {
      // 使用 #define 定义的路径
      Source: "{#SourceDir}\\{#MyAppExeName}",
      DestDir: "{app}",
    },
    {
      Source: "{#SourceDir}\\*",
      DestDir: "{app}",
      Flags: "ignoreversion recursesubdirs createallsubdirs",
    },
  ],
}
```

**优点：**
- ✅ 使用 Inno Setup 原生语法，无需学习自定义占位符
- ✅ 所有路径定义集中在 Defines 中，易于管理
- ✅ 插件会自动设置 `SourceDir` 为实际的打包输出目录
- ✅ 更清晰、更易维护

### 1. 使用相对路径（推荐）

相对路径会基于项目根目录自动解析为绝对路径：

```typescript
// ✅ 推荐配置 - 使用相对路径
config: {
  Setup: {
    SetupIconFile: "./assets/icons/win32.ico",  // 基于项目根目录
  },
}
```

### 2. 使用路径占位符

插件提供了几个特殊的占位符：

| 占位符      | 说明                        | 示例                           |
| ----------- | --------------------------- | ------------------------------ |
| `{project}` | 项目根目录                  | `{project}/resources/icon.ico` |
| `{build}`   | Electron Forge 打包输出目录 | `{build}\\*`                   |
| `{assets}`  | 资源目录（默认 `assets`）   | `{assets}/icons/icon.ico`      |

**示例：**

```typescript
new MakerInnosetup({
  config: {
    Setup: {
      // 三种等价的写法
      SetupIconFile: "./assets/icons/icon.ico", // 相对路径
      SetupIconFile: "{assets}/icons/icon.ico", // 使用 {assets} 占位符
      SetupIconFile: "{project}/assets/icons/icon.ico", // 使用 {project} 占位符
    },
    Files: [
      {
        // 使用 {build} 占位符引用 Electron Forge 的打包输出
        Source: "{build}\\*",
        DestDir: "{app}",
        Flags: "ignoreversion recursesubdirs createallsubdirs",
      },
    ],
  },
});
```

### 3. 自定义路径解析配置

```typescript
new MakerInnosetup({
  // 路径配置
  paths: {
    projectDir: process.cwd(), // 项目根目录，默认为 cwd()
    assetsDir: "resources", // 资源目录，默认为 "assets"
    buildDir: "./out", // 构建输出目录（通常由 Electron Forge 自动设置）
  },

  // 是否自动解析相对路径，默认为 true
  resolveRelativePaths: true,

  config: {
    // ... 其他配置
  },
});
```

## 完整示例对比

### 之前（使用绝对路径）

```typescript
// ❌ 不推荐 - 硬编码路径
new MakerInnosetup({
  config: {
    Defines: {
      MyAppExeName: "Police Self Report.exe",
    },
    Setup: {
      SetupIconFile:
        "E:\\workSpace\\police-self-report\\assets\\icons\\win32.ico",
    },
    Files: [
      {
        Source:
          "E:\\workSpace\\police-self-report\\out\\PoliceSelfReport-win32-x64\\{#MyAppExeName}",
        DestDir: "{app}",
        Flags: "ignoreversion",
      },
      {
        Source:
          "E:\\workSpace\\police-self-report\\out\\PoliceSelfReport-win32-x64\\*",
        DestDir: "{app}",
        Flags: "ignoreversion recursesubdirs createallsubdirs",
      },
    ],
  },
});
```

### 现在（使用相对路径）

```typescript
// ✅ 推荐 - 可移植配置
new MakerInnosetup({
  config: {
    Defines: {
      MyAppExeName: "Police Self Report.exe",
    },
    Setup: {
      SetupIconFile: "./assets/icons/win32.ico", // 相对路径
    },
    Files: [
      {
        Source: "{build}\\{#MyAppExeName}", // 使用占位符
        DestDir: "{app}",
        Flags: "ignoreversion",
      },
      {
        Source: "{build}\\*", // 使用占位符
        DestDir: "{app}",
        Flags: "ignoreversion recursesubdirs createallsubdirs",
      },
    ],
  },
});
```

## 路径解析规则

### 自动解析的路径字段

以下配置字段会自动进行路径解析：

#### Setup 部分

- `SetupIconFile`
- `LicenseFile`
- `InfoBeforeFile`
- `InfoAfterFile`
- `WizardImageFile`
- `WizardSmallImageFile`

#### Languages 部分

- `LicenseFile`
- `InfoBeforeFile`
- `InfoAfterFile`

#### Files 部分

- `Source` （如果不以 `{` 开头）

### 不会解析的路径

以下路径不会被解析，会按原样使用：

- 已经是绝对路径的
- 以 `compiler:` 开头的（Inno Setup 内置资源）
- 以 `{app}`, `{tmp}` 等 Inno Setup 常量开头的
- 设置了 `resolveRelativePaths: false` 时的所有路径

## 通配符支持

路径解析支持通配符：

```typescript
Files: [
  {
    // ✅ 支持通配符
    Source: "./out/my-app-win32-x64/*",
    DestDir: "{app}",
  },
  {
    // ✅ 使用占位符 + 通配符
    Source: "{build}\\**\\*.dll",
    DestDir: "{app}",
  },
];
```

## 禁用自动路径解析

如果您需要完全控制路径，可以禁用自动解析：

```typescript
new MakerInnosetup({
  // 禁用相对路径解析
  resolveRelativePaths: false,

  config: {
    Setup: {
      // 现在必须使用绝对路径或 Inno Setup 常量
      SetupIconFile: "C:\\absolute\\path\\to\\icon.ico",
    },
  },
});
```

## 调试路径问题

启用日志查看路径解析过程：

```bash
# 运行 Electron Forge make 命令时会输出：
npm run make

# 日志输出示例：
# Project directory: E:\workSpace\my-app
# Build directory: E:\workSpace\my-app\out\my-app-win32-x64
# Using Innosetup compiler: E:\workSpace\my-app\vendor\innosetup\ISCC.exe
```

## 最佳实践

1. ✅ **始终使用相对路径或占位符** - 确保配置可移植
2. ✅ **使用 Defines 定义常量** - 避免重复硬编码
3. ✅ **使用 `{build}` 引用打包输出** - 自动适配不同架构
4. ✅ **保持配置简洁** - 仅配置必要的内容
5. ❌ **避免硬编码绝对路径** - 除非特殊情况

## 示例：完整的可移植配置

```typescript
import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerInnosetup } from "electron-forge-maker-innosetup";

const config: ForgeConfig = {
  makers: [
    new MakerInnosetup(
      {
        appName: "My Electron App",
        appVersion: "1.0.0",
        appPublisher: "My Company",

        // 使用相对路径
        setupIconFile: "./assets/icons/icon.ico",
        licenseFile: "./LICENSE",

        createDesktopIcon: true,

        config: {
          Defines: {
            MyAppName: "My Electron App",
            MyAppExeName: "MyElectronApp.exe",
          },

          Setup: {
            AppName: "{#MyAppName}",
            SetupIconFile: "{assets}/icons/icon.ico",
            UninstallDisplayIcon: "{app}\\{#MyAppExeName}",
            ArchitecturesAllowed: "x64compatible",
            PrivilegesRequired: "admin",
          },

          Files: [
            {
              Source: "{build}\\{#MyAppExeName}",
              DestDir: "{app}",
              Flags: "ignoreversion",
            },
            {
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
            {
              Name: "{autodesktop}\\{#MyAppName}",
              Filename: "{app}\\{#MyAppExeName}",
              Tasks: "desktopicon",
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

这个配置可以在任何机器、任何路径下运行，无需修改！
