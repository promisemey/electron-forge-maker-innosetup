import * as fs from "fs";
import { InnoSetupConfig, InnoSetupDefines } from "./types";

/**
 * Inno Setup 脚本解析器
 * 将 .iss 文件解析为 InnoSetupConfig 对象
 */
export class InnoScriptParser {
  /**
   * 从文件路径解析 ISS 脚本
   */
  static parseFile(issFilePath: string): InnoSetupConfig {
    const content = fs.readFileSync(issFilePath, "utf-8");
    return this.parse(content);
  }

  /**
   * 解析 ISS 脚本内容
   * @param content ISS 脚本内容
   * @param preserveDefineReferences 是否保留 {#...} 引用（不替换为实际值）
   */
  static parse(
    content: string,
    preserveDefineReferences: boolean = true
  ): InnoSetupConfig {
    const config: InnoSetupConfig = {};
    const defines: InnoSetupDefines = {};
    const lines = content.split(/\r?\n/);
    let currentSection: string | null = null;
    let codeSection = "";
    let inCodeSection = false;

    // 第一次扫描：提取所有 #define 定义
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      // 跳过空行和注释
      if (!line || line.startsWith(";") || line.startsWith("//")) {
        continue;
      }

      // 解析 #define 指令
      const defineMatch = line.match(/^#define\s+(\w+)\s+(.+)$/);
      if (defineMatch) {
        const [, varName, varValue] = defineMatch;
        // 如果保留引用，则保存原始表达式；否则计算值
        defines[varName] = preserveDefineReferences
          ? this.preserveDefineExpression(varValue)
          : this.parseDefineValue(varValue, defines);
      }
    }

    // 如果有 defines，添加到配置中
    if (Object.keys(defines).length > 0) {
      config.Defines = defines;
    }

    // 第二次扫描：解析配置段落
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      // 跳过空行、注释和 #define 指令
      if (
        !line ||
        line.startsWith(";") ||
        line.startsWith("//") ||
        line.startsWith("#define")
      ) {
        continue;
      }

      // 如果不保留引用，则替换常量引用 {#ConstantName}
      if (!preserveDefineReferences) {
        line = this.replaceDefines(line, defines);
      }

      // 检测段落
      const sectionMatch = line.match(/^\[(\w+)\]$/);
      if (sectionMatch) {
        currentSection = sectionMatch[1];

        // 处理 Code 段落
        if (currentSection === "Code") {
          inCodeSection = true;
          codeSection = "";
        } else {
          inCodeSection = false;
        }
        continue;
      }

      // 如果在 Code 段落中，收集所有代码
      if (inCodeSection) {
        // 对于 Code 段落，使用原始行（带缩进）
        const processedLine = preserveDefineReferences
          ? lines[i]
          : this.replaceDefines(lines[i], defines);
        codeSection += processedLine + "\n";
        continue;
      }

      // 解析不同段落
      if (currentSection === "Setup") {
        this.parseSetupLine(line, config);
      } else if (currentSection === "Languages") {
        this.parseLanguagesLine(line, config);
      } else if (currentSection === "Tasks") {
        this.parseTasksLine(line, config);
      } else if (currentSection === "Types") {
        this.parseTypesLine(line, config);
      } else if (currentSection === "Components") {
        this.parseComponentsLine(line, config);
      } else if (currentSection === "Files") {
        this.parseFilesLine(line, config);
      } else if (currentSection === "Dirs") {
        this.parseDirsLine(line, config);
      } else if (currentSection === "Icons") {
        this.parseIconsLine(line, config);
      } else if (currentSection === "INI") {
        this.parseINILine(line, config);
      } else if (currentSection === "InstallDelete") {
        this.parseInstallDeleteLine(line, config);
      } else if (currentSection === "UninstallDelete") {
        this.parseUninstallDeleteLine(line, config);
      } else if (currentSection === "Registry") {
        this.parseRegistryLine(line, config);
      } else if (currentSection === "Run") {
        this.parseRunLine(line, config);
      } else if (currentSection === "UninstallRun") {
        this.parseUninstallRunLine(line, config);
      } else if (currentSection === "Messages") {
        this.parseMessagesLine(line, config);
      } else if (currentSection === "CustomMessages") {
        this.parseCustomMessagesLine(line, config);
      }
    }

    // 添加 Code 段落
    if (codeSection.trim()) {
      config.Code = codeSection.trim();
    }

    return config;
  }

  /**
   * 保留 #define 的原始表达式
   */
  private static preserveDefineExpression(value: string): string {
    value = value.trim();
    // 移除外层引号（如果有）
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }
    return value;
  }

  /**
   * 解析 #define 的值，支持字符串拼接和函数调用
   */
  private static parseDefineValue(
    value: string,
    defines: InnoSetupDefines
  ): string {
    value = value.trim();

    // 处理字符串拼接 (e.g., MyAppName + " File")
    if (value.includes("+")) {
      const parts = value.split("+").map((p) => p.trim());
      let result = "";
      for (const part of parts) {
        if (part.startsWith('"') && part.endsWith('"')) {
          // 直接的字符串字面量
          result += part.slice(1, -1);
        } else if (defines[part]) {
          // 引用已定义的常量
          result += defines[part];
        } else {
          // 未知引用，保持原样
          result += part;
        }
      }
      return result;
    }

    // 处理 StringChange 函数 (e.g., StringChange(MyAppAssocName, " ", ""))
    const stringChangeMatch = value.match(
      /StringChange\(([^,]+),\s*"([^"]*)",\s*"([^"]*)"\)/
    );
    if (stringChangeMatch) {
      const [, varRef, searchStr, replaceStr] = stringChangeMatch;
      const varName = varRef.trim();
      const sourceValue = defines[varName] ? String(defines[varName]) : varName;
      let result = sourceValue.replace(new RegExp(searchStr, "g"), replaceStr);

      // 处理后续的拼接，例如 StringChange(...) + ".myp"
      const fullMatch = value.match(/StringChange\([^)]+\)(.*)$/);
      if (fullMatch && fullMatch[1]) {
        const suffix = fullMatch[1].trim();
        if (suffix.startsWith("+")) {
          const suffixPart = suffix.substring(1).trim();
          if (suffixPart.startsWith('"') && suffixPart.endsWith('"')) {
            result += suffixPart.slice(1, -1);
          } else {
            result += suffixPart;
          }
        }
      }
      return result;
    }

    // 处理常量引用 (e.g., MyAppName)
    if (defines[value]) {
      return String(defines[value]);
    }

    // 移除外层引号
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }

    return value;
  }

  /**
   * 替换字符串中的常量引用 {#ConstantName}
   */
  private static replaceDefines(
    text: string,
    defines: InnoSetupDefines
  ): string {
    return text.replace(/\{#(\w+)\}/g, (match, varName) => {
      return defines[varName] !== undefined ? String(defines[varName]) : match;
    });
  }

  /**
   * 解析 Setup 段落的一行
   */
  private static parseSetupLine(line: string, config: InnoSetupConfig): void {
    const match = line.match(/^(\w+)\s*=\s*(.+)$/);
    if (!match) return;

    const [, key, value] = match;

    if (!config.Setup) {
      config.Setup = {};
    }

    // 移除引号
    let parsedValue: any = value.trim();
    if (parsedValue.startsWith('"') && parsedValue.endsWith('"')) {
      parsedValue = parsedValue.slice(1, -1);
    }

    // 转换布尔值
    if (parsedValue === "yes" || parsedValue === "true") {
      parsedValue = true;
    } else if (parsedValue === "no" || parsedValue === "false") {
      parsedValue = false;
    }

    // 转换数字
    if (/^\d+$/.test(parsedValue)) {
      parsedValue = parseInt(parsedValue, 10);
    }

    config.Setup[key] = parsedValue;
  }

  /**
   * 解析参数行（用于 Languages, Files, Icons 等段落）
   */
  private static parseParams(line: string): Record<string, string> {
    const params: Record<string, string> = {};
    const parts = line.split(";").map((p) => p.trim());

    for (const part of parts) {
      const match = part.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const [, key, value] = match;
        // 移除引号
        let parsedValue = value.trim();
        if (parsedValue.startsWith('"') && parsedValue.endsWith('"')) {
          parsedValue = parsedValue.slice(1, -1);
        }
        params[key] = parsedValue;
      }
    }

    return params;
  }

  /**
   * 解析 Languages 段落
   */
  private static parseLanguagesLine(
    line: string,
    config: InnoSetupConfig
  ): void {
    if (!config.Languages) {
      config.Languages = [];
    }

    const params = this.parseParams(line);
    if (params.Name && params.MessagesFile) {
      config.Languages.push({
        Name: params.Name,
        MessagesFile: params.MessagesFile,
        LicenseFile: params.LicenseFile,
        InfoBeforeFile: params.InfoBeforeFile,
        InfoAfterFile: params.InfoAfterFile,
      });
    }
  }

  /**
   * 解析 Tasks 段落
   */
  private static parseTasksLine(line: string, config: InnoSetupConfig): void {
    if (!config.Tasks) {
      config.Tasks = [];
    }

    const params = this.parseParams(line);
    if (params.Name && params.Description) {
      config.Tasks.push({
        Name: params.Name,
        Description: params.Description,
        GroupDescription: params.GroupDescription,
        Flags: params.Flags,
        Components: params.Components,
        Check: params.Check,
      });
    }
  }

  /**
   * 解析 Types 段落
   */
  private static parseTypesLine(line: string, config: InnoSetupConfig): void {
    if (!config.Types) {
      config.Types = [];
    }

    const params = this.parseParams(line);
    if (params.Name && params.Description) {
      config.Types.push({
        Name: params.Name,
        Description: params.Description,
        Flags: params.Flags,
      });
    }
  }

  /**
   * 解析 Components 段落
   */
  private static parseComponentsLine(
    line: string,
    config: InnoSetupConfig
  ): void {
    if (!config.Components) {
      config.Components = [];
    }

    const params = this.parseParams(line);
    if (params.Name && params.Description) {
      config.Components.push({
        Name: params.Name,
        Description: params.Description,
        Types: params.Types,
        Flags: params.Flags,
        ExtraDiskSpaceRequired: params.ExtraDiskSpaceRequired
          ? parseInt(params.ExtraDiskSpaceRequired)
          : undefined,
      });
    }
  }

  /**
   * 解析 Files 段落
   */
  private static parseFilesLine(line: string, config: InnoSetupConfig): void {
    if (!config.Files) {
      config.Files = [];
    }

    const params = this.parseParams(line);
    if (params.Source && params.DestDir) {
      config.Files.push({
        Source: params.Source,
        DestDir: params.DestDir,
        DestName: params.DestName,
        Flags: params.Flags,
        Permissions: params.Permissions,
        StrongAssemblyName: params.StrongAssemblyName,
        Components: params.Components,
        Tasks: params.Tasks,
        Languages: params.Languages,
        Check: params.Check,
        BeforeInstall: params.BeforeInstall,
        AfterInstall: params.AfterInstall,
        Attribs: params.Attribs,
        FontInstall: params.FontInstall,
      });
    }
  }

  /**
   * 解析 Dirs 段落
   */
  private static parseDirsLine(line: string, config: InnoSetupConfig): void {
    if (!config.Dirs) {
      config.Dirs = [];
    }

    const params = this.parseParams(line);
    if (params.Name) {
      config.Dirs.push({
        Name: params.Name,
        Permissions: params.Permissions,
        Attribs: params.Attribs,
        Flags: params.Flags,
        Components: params.Components,
        Tasks: params.Tasks,
        Check: params.Check,
      });
    }
  }

  /**
   * 解析 Icons 段落
   */
  private static parseIconsLine(line: string, config: InnoSetupConfig): void {
    if (!config.Icons) {
      config.Icons = [];
    }

    const params = this.parseParams(line);
    if (params.Name && params.Filename) {
      config.Icons.push({
        Name: params.Name,
        Filename: params.Filename,
        Parameters: params.Parameters,
        WorkingDir: params.WorkingDir,
        HotKey: params.HotKey,
        Comment: params.Comment,
        IconFilename: params.IconFilename,
        IconIndex: params.IconIndex ? parseInt(params.IconIndex) : undefined,
        AppUserModelID: params.AppUserModelID,
        Flags: params.Flags,
        Components: params.Components,
        Tasks: params.Tasks,
        Languages: params.Languages,
        Check: params.Check,
      });
    }
  }

  /**
   * 解析 INI 段落
   */
  private static parseINILine(line: string, config: InnoSetupConfig): void {
    if (!config.INI) {
      config.INI = [];
    }

    const params = this.parseParams(line);
    if (params.Filename && params.Section) {
      config.INI.push({
        Filename: params.Filename,
        Section: params.Section,
        Key: params.Key,
        String: params.String,
        Flags: params.Flags,
        Components: params.Components,
        Tasks: params.Tasks,
        Check: params.Check,
      });
    }
  }

  /**
   * 解析 InstallDelete 段落
   */
  private static parseInstallDeleteLine(
    line: string,
    config: InnoSetupConfig
  ): void {
    if (!config.InstallDelete) {
      config.InstallDelete = [];
    }

    const params = this.parseParams(line);
    if (params.Type && params.Name) {
      config.InstallDelete.push({
        Type: params.Type as any,
        Name: params.Name,
        Components: params.Components,
        Tasks: params.Tasks,
        Check: params.Check,
      });
    }
  }

  /**
   * 解析 UninstallDelete 段落
   */
  private static parseUninstallDeleteLine(
    line: string,
    config: InnoSetupConfig
  ): void {
    if (!config.UninstallDelete) {
      config.UninstallDelete = [];
    }

    const params = this.parseParams(line);
    if (params.Type && params.Name) {
      config.UninstallDelete.push({
        Type: params.Type as any,
        Name: params.Name,
        Components: params.Components,
        Tasks: params.Tasks,
        Check: params.Check,
      });
    }
  }

  /**
   * 解析 Registry 段落
   */
  private static parseRegistryLine(
    line: string,
    config: InnoSetupConfig
  ): void {
    if (!config.Registry) {
      config.Registry = [];
    }

    const params = this.parseParams(line);
    if (params.Root && params.Subkey) {
      let valueData: string | number | undefined = params.ValueData;
      // 尝试转换为数字
      if (valueData && /^\d+$/.test(valueData)) {
        valueData = parseInt(valueData, 10);
      }

      config.Registry.push({
        Root: params.Root as any,
        Subkey: params.Subkey,
        ValueType: params.ValueType as any,
        ValueName: params.ValueName,
        ValueData: valueData,
        Permissions: params.Permissions,
        Flags: params.Flags,
        Components: params.Components,
        Tasks: params.Tasks,
        Check: params.Check,
      });
    }
  }

  /**
   * 解析 Run 段落
   */
  private static parseRunLine(line: string, config: InnoSetupConfig): void {
    if (!config.Run) {
      config.Run = [];
    }

    const params = this.parseParams(line);
    if (params.Filename) {
      config.Run.push({
        Filename: params.Filename,
        Parameters: params.Parameters,
        WorkingDir: params.WorkingDir,
        StatusMsg: params.StatusMsg,
        Description: params.Description,
        Flags: params.Flags,
        RunOnceId: params.RunOnceId,
        Verb: params.Verb,
        Components: params.Components,
        Tasks: params.Tasks,
        Languages: params.Languages,
        Check: params.Check,
      });
    }
  }

  /**
   * 解析 UninstallRun 段落
   */
  private static parseUninstallRunLine(
    line: string,
    config: InnoSetupConfig
  ): void {
    if (!config.UninstallRun) {
      config.UninstallRun = [];
    }

    const params = this.parseParams(line);
    if (params.Filename) {
      config.UninstallRun.push({
        Filename: params.Filename,
        Parameters: params.Parameters,
        WorkingDir: params.WorkingDir,
        StatusMsg: params.StatusMsg,
        Description: params.Description,
        Flags: params.Flags,
        RunOnceId: params.RunOnceId,
        Components: params.Components,
        Tasks: params.Tasks,
        Check: params.Check,
      });
    }
  }

  /**
   * 解析 Messages 段落
   */
  private static parseMessagesLine(
    line: string,
    config: InnoSetupConfig
  ): void {
    const match = line.match(/^(\w+)\s*=\s*(.+)$/);
    if (!match) return;

    const [, key, value] = match;

    if (!config.Messages) {
      config.Messages = {};
    }

    config.Messages[key] = value;
  }

  /**
   * 解析 CustomMessages 段落
   */
  private static parseCustomMessagesLine(
    line: string,
    config: InnoSetupConfig
  ): void {
    const match = line.match(/^(\w+)\s*=\s*(.+)$/);
    if (!match) return;

    const [, key, value] = match;

    if (!config.CustomMessages) {
      config.CustomMessages = {};
    }

    config.CustomMessages[key] = value;
  }
}
