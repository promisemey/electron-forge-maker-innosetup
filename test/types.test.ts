/**
 * 类型测试文件 - 确保所有类型定义正确
 */

import MakerInnosetup, {
  MakerInnosetupConfig,
  InnoSetupConfig,
} from "../src/index";
import type { ForgePlatform } from "@electron-forge/shared-types";

// 测试基本配置
const basicConfig: MakerInnosetupConfig = {
  appName: "TestApp",
  appVersion: "1.0.0",
  appPublisher: "Test Publisher",
};

// 测试完整配置
const fullConfig: MakerInnosetupConfig = {
  appName: "TestApp",
  appVersion: "1.0.0",
  appPublisher: "Test Publisher",
  appId: "{{TestApp}}",
  setupIconFile: "./icon.ico",
  licenseFile: "./LICENSE",
  outputDir: "./out",
  createDesktopIcon: true,
  createQuickLaunchIcon: false,
  innosetupPath: "C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe",
  gui: false,
  isccOptions: ["/Q"],

  config: {
    Setup: {
      AppName: "TestApp",
      AppVersion: "1.0.0",
      AppPublisher: "Test Publisher",
      AppPublisherURL: "https://test.com",
      AppSupportURL: "https://test.com/support",
      AppUpdatesURL: "https://test.com/updates",
      DefaultDirName: "{autopf}\\TestApp",
      DefaultGroupName: "TestApp",
      AllowNoIcons: true,
      LicenseFile: "./LICENSE",
      OutputDir: "./out",
      OutputBaseFilename: "TestApp-Setup",
      SetupIconFile: "./icon.ico",
      Compression: "lzma2",
      SolidCompression: true,
      ArchitecturesAllowed: "x64",
      ArchitecturesInstallIn64BitMode: "x64",
      PrivilegesRequired: "admin",
      WizardStyle: "modern",
      UninstallDisplayIcon: "{app}\\TestApp.exe",
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
    Types: [
      {
        Name: "full",
        Description: "Full installation",
      },
      {
        Name: "compact",
        Description: "Compact installation",
      },
    ],
    Components: [
      {
        Name: "main",
        Description: "Main application",
        Types: "full compact",
        Flags: "fixed",
      },
    ],
    Tasks: [
      {
        Name: "desktopicon",
        Description: "Create desktop icon",
        GroupDescription: "Additional icons:",
        Flags: "unchecked",
      },
    ],
    Files: [
      {
        Source: "{src}\\*",
        DestDir: "{app}",
        Flags: "ignoreversion recursesubdirs createallsubdirs",
      },
    ],
    Dirs: [
      {
        Name: "{app}\\logs",
        Permissions: "users-modify",
      },
    ],
    Icons: [
      {
        Name: "{group}\\TestApp",
        Filename: "{app}\\TestApp.exe",
        IconFilename: "{app}\\icon.ico",
        IconIndex: 0,
      },
      {
        Name: "{autodesktop}\\TestApp",
        Filename: "{app}\\TestApp.exe",
        Tasks: "desktopicon",
      },
    ],
    Registry: [
      {
        Root: "HKCU",
        Subkey: "Software\\TestApp",
        ValueType: "string",
        ValueName: "InstallPath",
        ValueData: "{app}",
        Flags: "uninsdeletekey",
      },
      {
        Root: "HKLM",
        Subkey: "Software\\TestApp",
        ValueType: "dword",
        ValueName: "Installed",
        ValueData: 1,
      },
    ],
    Run: [
      {
        Filename: "{app}\\TestApp.exe",
        Description: "Launch TestApp",
        Flags: "nowait postinstall skipifsilent",
      },
    ],
    UninstallRun: [
      {
        Filename: "{app}\\cleanup.exe",
        Parameters: "--uninstall",
        Flags: "runhidden",
      },
    ],
    InstallDelete: [
      {
        Type: "files",
        Name: "{app}\\temp\\*",
      },
    ],
    UninstallDelete: [
      {
        Type: "filesandordirs",
        Name: "{app}\\logs",
      },
    ],
    INI: [
      {
        Filename: "{app}\\config.ini",
        Section: "Settings",
        Key: "Version",
        String: "1.0.0",
      },
    ],
    Messages: {
      WelcomeLabel1: "Welcome to TestApp Setup",
    },
    CustomMessages: {
      MyCustomMessage: "This is a custom message",
    },
    Code: `
function InitializeSetup(): Boolean;
begin
  Result := True;
end;
    `,
  },
};

// 测试脚本路径配置
const scriptConfig: MakerInnosetupConfig = {
  scriptPath: "./custom-installer.iss",
  innosetupPath: "C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe",
};

// 测试架构兼容性配置
const archConfig: MakerInnosetupConfig = {
  appName: "TestApp",
  config: {
    Setup: {
      // 测试复杂架构表达式
      ArchitecturesAllowed: "x64compatible and x86compatible",
      ArchitecturesInstallIn64BitMode: "x64compatible",
    },
  },
};

// 测试 ARM64 配置
const arm64Config: MakerInnosetupConfig = {
  appName: "TestApp-ARM64",
  config: {
    Setup: {
      ArchitecturesAllowed: "arm64 and x64compatible",
    },
  },
};

// 测试防止 x64 用户安装 x86 版本
const x86OnlyConfig: MakerInnosetupConfig = {
  appName: "TestApp-x86",
  config: {
    Setup: {
      ArchitecturesAllowed: "x86compatible and not x64compatible",
    },
  },
};

// 测试 Maker 实例化
const maker1 = new MakerInnosetup(basicConfig);
const maker2 = new MakerInnosetup(fullConfig, ["win32"]);
const maker3 = new MakerInnosetup();
const maker4 = new MakerInnosetup(archConfig);
const maker5 = new MakerInnosetup(arm64Config);
const maker6 = new MakerInnosetup(x86OnlyConfig);

// 类型检查通过
console.log("All type checks passed!");
console.log("Maker name:", maker1.name);
console.log("Default platforms:", maker1.defaultPlatforms);
console.log("Architecture configs validated:", {
  standard: archConfig.config?.Setup?.ArchitecturesAllowed,
  arm64: arm64Config.config?.Setup?.ArchitecturesAllowed,
  x86Only: x86OnlyConfig.config?.Setup?.ArchitecturesAllowed,
});
