# API 文档

## MakerInnosetup

主 Maker 类，继承自 `@electron-forge/maker-base`。

### 构造函数

```typescript
constructor(config?: MakerInnosetupConfig, platforms?: ForgePlatform[])
```

**参数：**

- `config` - Maker 配置对象
- `platforms` - 支持的平台数组，默认为 `['win32']`

### 属性

#### name

```typescript
name: string;
```

Maker 名称，值为 `'innosetup'`

#### defaultPlatforms

```typescript
defaultPlatforms: ForgePlatform[]
```

默认支持的平台，值为 `['win32']`

### 方法

#### isSupportedOnCurrentPlatform()

```typescript
isSupportedOnCurrentPlatform(): boolean
```

检查当前平台是否支持此 Maker。

**返回：** 如果当前平台是 Windows 则返回 `true`

#### make()

```typescript
async make(options: MakerOptions): Promise<string[]>
```

创建安装包。

**参数：**

- `options` - Maker 选项对象
  - `appName` - 应用程序名称
  - `dir` - 打包后的应用程序目录
  - `makeDir` - 构建目录
  - `targetArch` - 目标架构 (x64, ia32, arm64)
  - `packageJSON` - package.json 内容

**返回：** 生成的安装包文件路径数组

---

## InnoScriptGenerator

Innosetup 脚本生成器类。

### 方法

#### generate()

```typescript
generate(config: InnoSetupConfig): string
```

根据配置生成 Innosetup 脚本内容。

**参数：**

- `config` - Innosetup 配置对象

**返回：** 生成的脚本文本内容

#### saveToFile()

```typescript
saveToFile(scriptContent: string, filePath: string): void
```

将脚本内容保存到文件。

**参数：**

- `scriptContent` - 脚本内容
- `filePath` - 保存路径

---

## 类型定义

### MakerInnosetupConfig

Maker 主配置接口。

```typescript
interface MakerInnosetupConfig {
  // 基本配置
  appName?: string;
  appVersion?: string;
  appPublisher?: string;
  appId?: string;

  // 文件路径
  licenseFile?: string;
  setupIconFile?: string;

  // 输出配置
  outputDir?: string;

  // Innosetup 编译器配置
  innosetupPath?: string;
  gui?: boolean;
  isccOptions?: string[];

  // 快捷方式选项
  createDesktopIcon?: boolean;
  createQuickLaunchIcon?: boolean;

  // 脚本配置
  scriptPath?: string;
  config?: InnoSetupConfig;
}
```

### InnoSetupConfig

完整的 Innosetup 配置接口。

```typescript
interface InnoSetupConfig {
  Setup?: SetupSection;
  Languages?: LanguageSection[];
  Types?: TypeSection[];
  Components?: ComponentSection[];
  Tasks?: TaskSection[];
  Files?: FileSection[];
  Dirs?: DirSection[];
  Icons?: IconSection[];
  Registry?: RegistrySection[];
  Run?: RunSection[];
  UninstallRun?: UninstallRunSection[];
  InstallDelete?: DeleteSection[];
  UninstallDelete?: DeleteSection[];
  INI?: INISection[];
  Messages?: Record<string, string>;
  CustomMessages?: Record<string, string>;
  Code?: string;
}
```

### Setup Section

```typescript
interface SetupSection {
  // 应用信息
  AppName?: string;
  AppVersion?: string;
  AppPublisher?: string;
  AppPublisherURL?: string;
  AppSupportURL?: string;
  AppUpdatesURL?: string;
  AppId?: string;

  // 安装路径
  DefaultDirName?: string;
  DefaultGroupName?: string;

  // 文件配置
  LicenseFile?: string;
  InfoBeforeFile?: string;
  InfoAfterFile?: string;
  SetupIconFile?: string;

  // 输出配置
  OutputDir?: string;
  OutputBaseFilename?: string;

  // 压缩配置
  Compression?: "lzma" | "lzma2" | "zip" | "bzip" | "none";
  SolidCompression?: boolean;
  InternalCompressLevel?:
    | "ultra"
    | "ultra64"
    | "max"
    | "normal"
    | "fast"
    | "none";

  // 架构配置
  ArchitecturesAllowed?: string;
  ArchitecturesInstallIn64BitMode?: string;

  // 权限配置
  PrivilegesRequired?: "admin" | "lowest" | "poweruser";

  // 界面配置
  WizardStyle?: "modern" | "classic";
  WizardImageFile?: string;
  WizardSmallImageFile?: string;

  // 页面控制
  DisableWelcomePage?: boolean;
  DisableDirPage?: boolean;
  DisableProgramGroupPage?: boolean;
  DisableReadyPage?: boolean;
  DisableFinishedPage?: boolean;

  // 其他配置
  AllowNoIcons?: boolean;
  CreateUninstallRegKey?: boolean;
  Uninstallable?: boolean;
  UninstallDisplayIcon?: string;
  UninstallDisplayName?: string;

  // 签名配置
  SignTool?: string;
  SignToolRetryCount?: number;
  SignToolRetryDelay?: number;

  // 版本信息
  VersionInfoVersion?: string;
  VersionInfoCompany?: string;
  VersionInfoDescription?: string;
  VersionInfoCopyright?: string;
  VersionInfoProductName?: string;
  VersionInfoProductVersion?: string;

  // 更多配置...
  [key: string]: any;
}
```

### Language Section

```typescript
interface LanguageSection {
  Name: string;
  MessagesFile: string;
  LicenseFile?: string;
  InfoBeforeFile?: string;
  InfoAfterFile?: string;
}
```

### Task Section

```typescript
interface TaskSection {
  Name: string;
  Description: string;
  GroupDescription?: string;
  Flags?: string;
  Components?: string;
  Check?: string;
}
```

### File Section

```typescript
interface FileSection {
  Source: string;
  DestDir: string;
  DestName?: string;
  Flags?: string;
  Permissions?: string;
  Components?: string;
  Tasks?: string;
  Languages?: string;
  Check?: string;
  BeforeInstall?: string;
  AfterInstall?: string;
  Attribs?: string;
  FontInstall?: string;
}
```

### Icon Section

```typescript
interface IconSection {
  Name: string;
  Filename: string;
  Parameters?: string;
  WorkingDir?: string;
  HotKey?: string;
  Comment?: string;
  IconFilename?: string;
  IconIndex?: number;
  AppUserModelID?: string;
  Flags?: string;
  Components?: string;
  Tasks?: string;
  Languages?: string;
  Check?: string;
}
```

### Registry Section

```typescript
interface RegistrySection {
  Root: "HKCR" | "HKCU" | "HKLM" | "HKU" | "HKCC";
  Subkey: string;
  ValueType?:
    | "none"
    | "string"
    | "expandsz"
    | "multisz"
    | "dword"
    | "qword"
    | "binary";
  ValueName?: string;
  ValueData?: string | number;
  Permissions?: string;
  Flags?: string;
  Components?: string;
  Tasks?: string;
  Check?: string;
}
```

### Run Section

```typescript
interface RunSection {
  Filename: string;
  Parameters?: string;
  WorkingDir?: string;
  StatusMsg?: string;
  Description?: string;
  Flags?: string;
  RunOnceId?: string;
  Verb?: string;
  Components?: string;
  Tasks?: string;
  Languages?: string;
  Check?: string;
}
```

---

## 常用 Flags

### File Flags

- `ignoreversion` - 忽略版本检查
- `recursesubdirs` - 递归包含子目录
- `createallsubdirs` - 创建所有子目录
- `restartreplace` - 重启后替换正在使用的文件
- `sharedfile` - 标记为共享文件
- `deleteafterinstall` - 安装后删除
- `dontcopy` - 不复制文件

### Task Flags

- `unchecked` - 默认不选中
- `exclusive` - 互斥任务
- `restart` - 需要重启
- `checkedonce` - 只检查一次

### Icon Flags

- `closeonexit` - 退出时关闭
- `createonlyiffileexists` - 仅当文件存在时创建
- `dontcloseonexit` - 退出时不关闭
- `excludefromshowinnewinstall` - 从"新安装"中排除
- `foldershortcut` - 文件夹快捷方式
- `preventpinning` - 防止固定

### Registry Flags

- `createvalueifdoesntexist` - 如果不存在则创建值
- `deletekey` - 删除键
- `deletevalue` - 删除值
- `dontcreatekey` - 不创建键
- `preservestringtype` - 保留字符串类型
- `uninsclearvalue` - 卸载时清除值
- `uninsdeletekey` - 卸载时删除键
- `uninsdeletevalue` - 卸载时删除值

### Run Flags

- `nowait` - 不等待进程结束
- `postinstall` - 安装后运行
- `skipifsilent` - 静默安装时跳过
- `unchecked` - 默认不选中
- `waituntilidle` - 等待空闲
- `runhidden` - 隐藏运行
- `runascurrentuser` - 以当前用户身份运行
- `shellexec` - 使用 ShellExecute

---

## 示例

### 基本使用

```typescript
import MakerInnosetup from "@electron-forge/maker-innosetup";

const maker = new MakerInnosetup(
  {
    appName: "My App",
    appPublisher: "My Company",
    setupIconFile: "./icon.ico",
  },
  ["win32"]
);
```

### 完整配置

```typescript
const maker = new MakerInnosetup({
  config: {
    Setup: {
      AppName: "My App",
      AppVersion: "1.0.0",
      Compression: "lzma2",
      SolidCompression: true,
    },
    Languages: [{ Name: "english", MessagesFile: "compiler:Default.isl" }],
    Files: [{ Source: "{src}\\*", DestDir: "{app}", Flags: "recursesubdirs" }],
  },
});
```
