import type { ForgeConfig } from "@electron-forge/shared-types";

const config: ForgeConfig = {
  packagerConfig: {
    name: "MyElectronApp",
    executableName: "MyElectronApp",
    icon: "./assets/icon",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "electron-forge-maker-innosetup",
      config: {
        appName: "My Electron App",
        appVersion: "1.0.0",
        appPublisher: "My Company",
        appId: "{{MyElectronApp}}",
        setupIconFile: "./assets/icon.ico",
        licenseFile: "./LICENSE",
        createDesktopIcon: true,
        createQuickLaunchIcon: false,
        outputDir: "./out/installers",

        // 完整的 Innosetup 配置
        config: {
          Setup: {
            AppName: "My Electron App",
            AppVersion: "1.0.0",
            AppPublisher: "My Company",
            AppPublisherURL: "https://mycompany.com",
            AppSupportURL: "https://mycompany.com/support",
            AppUpdatesURL: "https://mycompany.com/updates",
            DefaultDirName: "{autopf}\\MyElectronApp",
            DefaultGroupName: "My Electron App",
            AllowNoIcons: true,
            OutputDir: "./out/installers",
            OutputBaseFilename: "MyElectronApp-Setup",
            Compression: "lzma2",
            SolidCompression: true,
            ArchitecturesAllowed: "x64",
            ArchitecturesInstallIn64BitMode: "x64",
            PrivilegesRequired: "admin",
            WizardStyle: "modern",
            SetupIconFile: "./assets/icon.ico",
            UninstallDisplayIcon: "{app}\\MyElectronApp.exe",
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
              Description: "Create a &desktop icon",
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
          Icons: [
            {
              Name: "{group}\\My Electron App",
              Filename: "{app}\\MyElectronApp.exe",
            },
            {
              Name: "{group}\\Uninstall My Electron App",
              Filename: "{uninstallexe}",
            },
            {
              Name: "{autodesktop}\\My Electron App",
              Filename: "{app}\\MyElectronApp.exe",
              Tasks: "desktopicon",
            },
          ],
          Registry: [
            {
              Root: "HKCU",
              Subkey: "Software\\MyElectronApp",
              ValueType: "string",
              ValueName: "InstallPath",
              ValueData: "{app}",
              Flags: "uninsdeletekey",
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
      platforms: ["win32"],
    },
  ],
};

export default config;
