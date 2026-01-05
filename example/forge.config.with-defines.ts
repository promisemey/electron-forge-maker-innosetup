import type { ForgeConfig } from "@electron-forge/shared-types";

/**
 * 示例：使用 #define 预处理器常量的配置
 */
const config: ForgeConfig = {
  packagerConfig: {
    name: "Police Self Report",
    executableName: "Police Self Report",
    icon: "./assets/icon",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "electron-forge-maker-innosetup",
      config: {
        // 完整的 Innosetup 配置，使用 Defines
        config: {
          // 定义预处理器常量
          Defines: {
            MyAppName: "xxxx",
            MyAppVersion: "1.0.0",
            MyAppPublisher: "xxxxx",
            MyAppExeName: "xxxx.exe",
            MyAppAssocName: "xxxx",
            MyAppAssocExt: ".myp",
            MyAppAssocKey: "xxxx",
            MyAppShortcutName: "xxxxxx",
          },
          Setup: {
            // 使用 {#ConstantName} 引用预处理器常量
            AppName: "{#MyAppName}",
            AppVersion: "{#MyAppVersion}",
            AppPublisher: "{#MyAppPublisher}",
            AppId: "PoliceSelfReport",
            DefaultDirName: "{autopf}\\{#MyAppName}",
            DefaultGroupName: "PoliceSelfReport",
            OutputDir: "E:\\innoSoft\\police-self-report",
            OutputBaseFilename: "{#MyAppName}_{#MyAppVersion}",
            Compression: "lzma2",
            SolidCompression: true,
            ArchitecturesAllowed: "x64compatible",
            ArchitecturesInstallIn64BitMode: "x64compatible",
            PrivilegesRequired: "admin",
            WizardStyle: "modern",
            ChangesAssociations: true,
          },
          Languages: [
            {
              Name: "chinesesimplified",
              MessagesFile: "compiler:Languages\\ChineseSimplified.isl",
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
              Name: "{group}\\{#MyAppShortcutName}",
              Filename: "{app}\\{#MyAppExeName}",
            },
            {
              Name: "{autodesktop}\\{#MyAppShortcutName}",
              Filename: "{app}\\{#MyAppExeName}",
            },
          ],
          Registry: [
            {
              Root: "HKCR",
              Subkey: "{#MyAppAssocExt}",
              ValueType: "string",
              ValueName: "",
              ValueData: "{#MyAppAssocKey}",
              Flags: "uninsdeletevalue",
            },
            {
              Root: "HKCR",
              Subkey: "{#MyAppAssocKey}",
              ValueType: "string",
              ValueName: "",
              ValueData: "{#MyAppAssocName}",
              Flags: "uninsdeletekey",
            },
            {
              Root: "HKCR",
              Subkey: "{#MyAppAssocKey}\\DefaultIcon",
              ValueType: "string",
              ValueName: "",
              ValueData: "{app}\\{#MyAppExeName},0",
            },
            {
              Root: "HKCR",
              Subkey: "{#MyAppAssocKey}\\shell\\open\\command",
              ValueType: "string",
              ValueName: "",
              ValueData: '"{app}\\{#MyAppExeName}" "%1"',
            },
          ],
          Run: [
            {
              Filename: "{app}\\{#MyAppExeName}",
              Description: "启动 {#MyAppShortcutName}",
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
