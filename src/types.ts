/**
 * Innosetup 完整的 TypeScript 类型定义
 */

/**
 * Setup 部分配置
 */
export interface InnoSetupConfig {
  /** Setup 部分配置 */
  Setup?: {
    /** 应用程序名称 */
    AppName?: string;
    /** 应用程序版本 */
    AppVersion?: string;
    /** 应用程序验证名（已弃用，使用AppVersion替代） */
    AppVerName?: string;
    /** 应用程序发布者 */
    AppPublisher?: string;
    /** 应用程序发布者 URL */
    AppPublisherURL?: string;
    /** 应用程序支持 URL */
    AppSupportURL?: string;
    /** 应用程序更新 URL */
    AppUpdatesURL?: string;
    /** 默认安装目录名称 */
    DefaultDirName?: string;
    /** 默认分组名称 */
    DefaultGroupName?: string;
    /** 默认用户信息名称 */
    DefaultUserInfoName?: string;
    /** 默认用户信息组织 */
    DefaultUserInfoOrg?: string;
    /** 默认用户信息序列号 */
    DefaultUserInfoSerial?: string;
    /** 默认设置类型名称 */
    DefaultSetupType?: string;
    /** 允许不开始菜单文件夹 */
    AllowNoIcons?: boolean;
    /** 许可证文件 */
    LicenseFile?: string;
    /** 信息前文件 */
    InfoBeforeFile?: string;
    /** 信息后文件 */
    InfoAfterFile?: string;
    /** 输出目录 */
    OutputDir?: string;
    /** 输出基础文件名 */
    OutputBaseFilename?: string;
    /** 输出清单文件 */
    OutputManifestFile?: string;
    /** 设置图标文件 */
    SetupIconFile?: string;
    /** 设置加载器 */
    SetupLogging?: boolean;
    /** 设置互斥 */
    SetupMutex?: string;
    /** 压缩类型 */
    Compression?:
      | "lzma"
      | "lzma2"
      | "zip"
      | "bzip"
      | "none"
      | "zip/1"
      | "zip/2"
      | "zip/3"
      | "zip/4"
      | "zip/5"
      | "zip/6"
      | "zip/7"
      | "zip/8"
      | "zip/9";
    /** 固实压缩（提高压缩比） */
    SolidCompression?: boolean;
    /** 磁盘签名 */
    DiskSignature?: string;
    /** 磁盘切片大小（字节） */
    DiskClusterSize?: number;
    /** 特权级别（安装所需的权限） */
    PrivilegesRequired?: "none" | "poweruser" | "admin" | "lowest";
    /** 特权级别覆盖允许（允许用户修改权限级别） */
    PrivilegesRequiredOverridesAllowed?:
      | "dialog"
      | "commandline"
      | "dialog commandline";
    /**
     * 允许的架构（支持复杂表达式）
     * 架构标识符: x86, x64, ia64, arm64, x86compatible, x64compatible, arm64compatible, x86os, x64os, ia64os, arm64os, win64
     * 逻辑运算符: and, or, not
     * 示例:
     * - "x64" - 仅x64
     * - "x64compatible and x86compatible" - 需要同时支持x64和x86
     * - "arm64 and x64compatible" - ARM64并支持x64
     * - "x86compatible and not x64compatible" - x86但不支持x64
     * - "x64compatible and not arm64" - x64但不是ARM64
     * - "x64os" - 仅原生x64（不含模拟）
     * - "win64" - 任何64位Windows
     */
    ArchitecturesAllowed?: string;
    /**
     * 在64位模式下安装的架构（支持复杂表达式）
     * 使用与ArchitecturesAllowed相同的语法
     * 示例: "x64" 或 "x64compatible" 或 "arm64"
     */
    ArchitecturesInstallIn64BitMode?: string;
    /** 卸载显示图标 */
    UninstallDisplayIcon?: string;
    /** 卸载显示名称 */
    UninstallDisplayName?: string;
    /** 卸载文件目录 */
    UninstallFilesDir?: string;
    /** 卸载日志模式 */
    UninstallLogMode?: "append" | "new" | "overwrite";
    /** 卸载重启电脑 */
    UninstallRestartComputer?: boolean;
    /** 卸载显示大小 */
    UninstallDisplaySize?: number;
    /** 应用程序 ID */
    AppId?: string;
    /** 向导样式 */
    WizardStyle?: "modern" | "classic";
    /** 向导图像拉伸 */
    WizardImageStretch?: boolean;
    /** 禁用完成页面 */
    DisableFinishedPage?: boolean;
    /** 禁用准备安装页面 */
    DisableReadyPage?: boolean;
    /** 禁用欢迎页面 */
    DisableWelcomePage?: boolean;
    /** 禁用目录页面 */
    DisableDirPage?: boolean;
    /** 禁用程序组页面 */
    DisableProgramGroupPage?: boolean;
    /** 禁用准备提示页面 */
    DisableReadyMemo?: boolean;
    /** 禁用启动提示 */
    DisableStartupPrompt?: boolean;
    /** 禁用预先存在文件夹页面 */
    DisableDirExistsWarning?: boolean;
    /** 创建应用程序目录 */
    CreateAppDir?: boolean;
    /** 创建卸载注册表键 */
    CreateUninstallRegKey?: boolean;
    /** 可卸载 */
    Uninstallable?: boolean;
    /** 启用目录不存在警告 */
    EnableDirDoesntExistWarning?: boolean;
    /** 目录存在警告 */
    DirExistsWarning?: "yes" | "no" | "auto";
    /** 最小Windows版本 */
    MinVersion?: string;
    /** 最大Windows版本 */
    OnlyBelowVersion?: string;
    /** 显示语言对话框 */
    ShowLanguageDialog?: "yes" | "no" | "auto";
    /** 语言检测方法 */
    LanguageDetectionMethod?: "locale" | "uilanguage" | "none";
    /** 应用程序互斥 */
    AppMutex?: string;
    /** 签名工具 */
    SignTool?: string;
    /** 签名工具重试计数 */
    SignToolRetryCount?: number;
    /** 签名工具重试延迟 */
    SignToolRetryDelay?: number;
    /** 更改文件关联 */
    ChangesAssociations?: boolean;
    /** 更改环境变量 */
    ChangesEnvironment?: boolean;
    /** 关闭应用程序 */
    CloseApplications?: boolean;
    /** 关闭应用程序过滤器 */
    CloseApplicationsFilter?: string;
    /** 重启应用程序 */
    RestartApplications?: boolean;
    /** 允许取消期间安装 */
    AllowCancelDuringInstall?: boolean;
    /** 允许根目录 */
    AllowRootDirectory?: boolean;
    /** 允许网络驱动器 */
    AllowNetworkDrive?: boolean;
    /** 允许 UNC 路径 */
    AllowUNCPath?: boolean;
    /** 始终重启 */
    AlwaysRestart?: boolean;
    /** 始终显示目录页 */
    AlwaysShowDirOnReadyPage?: boolean;
    /** 始终显示组页 */
    AlwaysShowGroupOnReadyPage?: boolean;
    /** 始终使用个人组 */
    AlwaysUsePersonalGroup?: boolean;
    /** 应用程序注释 */
    AppComments?: string;
    /** 应用联系方式 */
    AppContact?: string;
    /** 应用版权 */
    AppCopyright?: string;
    /** 应用程序修改路径 */
    AppModifyPath?: string;
    /** 应用程序自述文件 */
    AppReadmeFile?: string;
    /** 背景颜色 */
    BackColor?: string;
    /** 背景颜色2 */
    BackColor2?: string;
    /** 背景颜色方向 */
    BackColorDirection?: "toptobottom" | "lefttoright";
    /** 背景是否为固实 */
    BackSolid?: boolean;
    /** 密码（安装程序密码保护） */
    Password?: string;
    /** 加密（是否加密文件） */
    Encryption?: boolean;
    /** 磁盘跨度（多盘分卷） */
    DiskSpanning?: boolean;
    /** 每张磁盘的切片数 */
    SlicesPerDisk?: number;
    /** 使用以前的应用程序目录 */
    UsePreviousAppDir?: boolean;
    /** 使用以前的组 */
    UsePreviousGroup?: boolean;
    /** 使用以前的语言 */
    UsePreviousLanguage?: boolean;
    /** 使用以前的权限 */
    UsePreviousPrivileges?: boolean;
    /** 使用以前的设置类型 */
    UsePreviousSetupType?: boolean;
    /** 使用以前的任务 */
    UsePreviousTasks?: boolean;
    /** 使用以前的用户信息 */
    UsePreviousUserInfo?: boolean;
    /** 用户信息页面 */
    UserInfoPage?: boolean;
    /** 版本信息公司 */
    VersionInfoCompany?: string;
    /** 版本信息描述 */
    VersionInfoDescription?: string;
    /** 版本信息文本版本 */
    VersionInfoTextVersion?: string;
    /** 版本信息版本 */
    VersionInfoVersion?: string;
    /** 版本信息产品名称 */
    VersionInfoProductName?: string;
    /** 版本信息产品文本版本 */
    VersionInfoProductTextVersion?: string;
    /** 版本信息产品版本 */
    VersionInfoProductVersion?: string;
    /** 版本信息原始文件名 */
    VersionInfoOriginalFileName?: string;
    /** 版本信息内部名称 */
    VersionInfoInternalName?: string;
    /** 版本信息版权 */
    VersionInfoCopyright?: string;
    /** 窗口显示标题 */
    WindowShowCaption?: boolean;
    /** 窗口可调整大小 */
    WindowResizable?: boolean;
    /** 窗口可见 */
    WindowVisible?: boolean;
    /** 向导图像文件 */
    WizardImageFile?: string;
    /** 向导小图像文件 */
    WizardSmallImageFile?: string;
    /** 向导图像背景色 */
    WizardImageBackColor?: string;
    /** 向导调整图像大小 */
    WizardResizable?: boolean;
    /** 向导大小百分比 */
    WizardSizePercent?: number;
    /** 向导大小 X */
    WizardSizeX?: number;
    /** 向导大小 Y */
    WizardSizeY?: number;
    /** 额外磁盘空间需求 */
    ExtraDiskSpaceRequired?: number;
    /** 平台安装模式 */
    AppendDefaultDirName?: boolean;
    /** 平台组名追加 */
    AppendDefaultGroupName?: boolean;
    /** 内部压缩级别 */
    InternalCompressLevel?:
      | "none"
      | "fast"
      | "normal"
      | "max"
      | "ultra"
      | "ultra64";
    /** 合并复制文件 */
    MergeDuplicateFiles?: boolean;
    /** 保留字节数 */
    ReserveBytes?: number;
    /** 时间戳使用UTC */
    TimeStampsInUTC?: boolean;
    /** 文件修改日期 */
    TouchDate?: string;
    /** 文件修改时间 */
    TouchTime?: string;
    /** 使用设置加载器 */
    UseSetupLdr?: boolean;
    /** 版本信息（已弃用，使用具体的VersionInfo*指令） */
    VersionInfo?: string;
    /** 额外的自定义配置 */
    [key: string]: any;
  };

  /**
   * Languages 部分配置
   */
  Languages?: Array<{
    /** 语言名称 */
    Name: string;
    /** 消息文件 */
    MessagesFile: string;
    /** 许可证文件 */
    LicenseFile?: string;
    /** 信息前文件 */
    InfoBeforeFile?: string;
    /** 信息后文件 */
    InfoAfterFile?: string;
  }>;

  /**
   * Tasks 部分配置
   */
  Tasks?: Array<{
    /** 任务名称 */
    Name: string;
    /** 任务描述 */
    Description: string;
    /** 分组描述 */
    GroupDescription?: string;
    /** 标志 */
    Flags?: string;
    /** 组件 */
    Components?: string;
    /** 检查条件 */
    Check?: string;
  }>;

  /**
   * Types 部分配置 - 安装类型
   */
  Types?: Array<{
    /** 类型名称 */
    Name: string;
    /** 类型描述 */
    Description: string;
    /** 标志 */
    Flags?: string;
  }>;

  /**
   * Components 部分配置 - 组件
   */
  Components?: Array<{
    /** 组件名称 */
    Name: string;
    /** 组件描述 */
    Description: string;
    /** 类型 */
    Types?: string;
    /** 标志 */
    Flags?: string;
    /** 额外磁盘空间需求 */
    ExtraDiskSpaceRequired?: number;
  }>;

  /**
   * Files 部分配置
   */
  Files?: Array<{
    /** 源文件路径 */
    Source: string;
    /** 目标目录 */
    DestDir: string;
    /** 目标名称 */
    DestName?: string;
    /** 标志 */
    Flags?: string;
    /** 权限 */
    Permissions?: string;
    /** 强文件名 */
    StrongAssemblyName?: string;
    /** 组件 */
    Components?: string;
    /** 任务 */
    Tasks?: string;
    /** 语言 */
    Languages?: string;
    /** 检查条件 */
    Check?: string;
    /** 安装前 */
    BeforeInstall?: string;
    /** 安装后 */
    AfterInstall?: string;
    /** 属性 */
    Attribs?: string;
    /** 字体安装 */
    FontInstall?: string;
  }>;

  /**
   * Dirs 部分配置 - 目录
   */
  Dirs?: Array<{
    /** 目录名称 */
    Name: string;
    /** 权限 */
    Permissions?: string;
    /** 属性 */
    Attribs?: string;
    /** 标志 */
    Flags?: string;
    /** 组件 */
    Components?: string;
    /** 任务 */
    Tasks?: string;
    /** 检查条件 */
    Check?: string;
  }>;

  /**
   * Icons 部分配置 - 快捷方式
   */
  Icons?: Array<{
    /** 图标名称 */
    Name: string;
    /** 文件名 */
    Filename: string;
    /** 参数 */
    Parameters?: string;
    /** 工作目录 */
    WorkingDir?: string;
    /** 热键 */
    HotKey?: string;
    /** 注释 */
    Comment?: string;
    /** 图标文件名 */
    IconFilename?: string;
    /** 图标索引 */
    IconIndex?: number;
    /** 应用程序用户模型 ID */
    AppUserModelID?: string;
    /** 标志 */
    Flags?: string;
    /** 组件 */
    Components?: string;
    /** 任务 */
    Tasks?: string;
    /** 语言 */
    Languages?: string;
    /** 检查条件 */
    Check?: string;
  }>;

  /**
   * INI 部分配置
   */
  INI?: Array<{
    /** 文件名 */
    Filename: string;
    /** 节 */
    Section: string;
    /** 键 */
    Key?: string;
    /** 字符串 */
    String?: string;
    /** 标志 */
    Flags?: string;
    /** 组件 */
    Components?: string;
    /** 任务 */
    Tasks?: string;
    /** 检查条件 */
    Check?: string;
  }>;

  /**
   * InstallDelete 部分配置
   */
  InstallDelete?: Array<{
    /** 类型 */
    Type: "files" | "filesandordirs" | "dirifempty";
    /** 名称 */
    Name: string;
    /** 组件 */
    Components?: string;
    /** 任务 */
    Tasks?: string;
    /** 检查条件 */
    Check?: string;
  }>;

  /**
   * UninstallDelete 部分配置
   */
  UninstallDelete?: Array<{
    /** 类型 */
    Type: "files" | "filesandordirs" | "dirifempty";
    /** 名称 */
    Name: string;
    /** 组件 */
    Components?: string;
    /** 任务 */
    Tasks?: string;
    /** 检查条件 */
    Check?: string;
  }>;

  /**
   * Registry 部分配置
   */
  Registry?: Array<{
    /** 根键 */
    Root:
      | "HKCR"
      | "HKCU"
      | "HKLM"
      | "HKU"
      | "HKCC"
      | "HKEY_CLASSES_ROOT"
      | "HKEY_CURRENT_USER"
      | "HKEY_LOCAL_MACHINE"
      | "HKEY_USERS"
      | "HKEY_CURRENT_CONFIG";
    /** 子键 */
    Subkey: string;
    /** 值类型 */
    ValueType?:
      | "none"
      | "string"
      | "expandsz"
      | "multisz"
      | "dword"
      | "qword"
      | "binary";
    /** 值名称 */
    ValueName?: string;
    /** 值数据 */
    ValueData?: string | number;
    /** 权限 */
    Permissions?: string;
    /** 标志 */
    Flags?: string;
    /** 组件 */
    Components?: string;
    /** 任务 */
    Tasks?: string;
    /** 检查条件 */
    Check?: string;
  }>;

  /**
   * UninstallRun 部分配置
   */
  UninstallRun?: Array<{
    /** 文件名 */
    Filename: string;
    /** 参数 */
    Parameters?: string;
    /** 工作目录 */
    WorkingDir?: string;
    /** 状态消息 */
    StatusMsg?: string;
    /** 描述 */
    Description?: string;
    /** 标志 */
    Flags?: string;
    /** 运行一次 ID */
    RunOnceId?: string;
    /** 组件 */
    Components?: string;
    /** 任务 */
    Tasks?: string;
    /** 检查条件 */
    Check?: string;
  }>;

  /**
   * Run 部分配置
   */
  Run?: Array<{
    /** 文件名 */
    Filename: string;
    /** 参数 */
    Parameters?: string;
    /** 工作目录 */
    WorkingDir?: string;
    /** 状态消息 */
    StatusMsg?: string;
    /** 描述 */
    Description?: string;
    /** 标志 */
    Flags?: string;
    /** 运行一次 ID */
    RunOnceId?: string;
    /** 动词 */
    Verb?: string;
    /** 组件 */
    Components?: string;
    /** 任务 */
    Tasks?: string;
    /** 语言 */
    Languages?: string;
    /** 检查条件 */
    Check?: string;
  }>;

  /**
   * Code 部分配置 - Pascal Script 代码
   */
  Code?: string;

  /**
   * Messages 部分配置 - 自定义消息
   */
  Messages?: {
    [key: string]: string;
  };

  /**
   * CustomMessages 部分配置 - 自定义消息
   */
  CustomMessages?: {
    [key: string]: string;
  };

  /**
   * 其他自定义配置
   */
  [key: string]: any;
}

/**
 * Maker Innosetup 配置
 */
export interface MakerInnosetupConfig {
  /** Innosetup 配置 */
  config?: InnoSetupConfig;

  /** Innosetup 脚本路径（如果提供，则忽略 config） */
  scriptPath?: string;

  /** Innosetup 编译器路径 */
  innosetupPath?: string;

  /** 输出目录 */
  outputDir?: string;

  /** 是否使用 GUI 模式编译 */
  gui?: boolean;

  /** 额外的 ISCC 命令行参数 */
  isccOptions?: string[];

  /** 应用程序名称（如果未在 config 中指定） */
  appName?: string;

  /** 应用程序版本（如果未在 config 中指定） */
  appVersion?: string;

  /** 应用程序发布者（如果未在 config 中指定） */
  appPublisher?: string;

  /** 应用程序 ID（如果未在 config 中指定） */
  appId?: string;

  /** 许可证文件路径 */
  licenseFile?: string;

  /** 安装图标文件路径 */
  setupIconFile?: string;

  /** 是否创建桌面图标 */
  createDesktopIcon?: boolean;

  /** 是否创建快速启动图标 */
  createQuickLaunchIcon?: boolean;
}
