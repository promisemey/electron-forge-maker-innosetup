# 自定义脚本输出目录处理

## 问题描述

当使用 `scriptPath` 配置选项指定自定义 ISS 脚本时，如果脚本中定义了 `OutputDir`，会导致以下问题：

1. **编译成功但找不到文件**：安装包被输出到脚本指定的目录，但 Maker 在默认目录中查找，导致 `ENOENT` 错误
2. **路径不一致**：脚本中的输出目录和 Maker 期望的输出目录不同

### 错误示例

```
Warning: A message named "DownloadingLabel" has not been defined for the "chinesesimplified" language.
Successful compile (66.391 sec). Resulting Setup program filename is:
E:\innoSoft\police-self-report\Police Self Report_1.0.0.exe

Error: ENOENT: no such file or directory, scandir 'E:\workSpace\police-self-report\out\installers'
```

## 解决方案

现在 Maker 会自动解析自定义脚本中的 `OutputDir` 配置，并在正确的目录中查找生成的安装包。

### 实现细节

1. **解析脚本配置**：当使用 `scriptPath` 时，自动解析 ISS 文件
2. **提取输出目录**：从 `[Setup]` 段落中读取 `OutputDir` 值
3. **路径解析**：
   - 如果是绝对路径，直接使用
   - 如果是相对路径，相对于脚本文件的目录解析
4. **在正确位置查找**：在解析出的目录中查找生成的安装包

### 代码示例

```typescript
// 自动解析脚本中的 OutputDir
if (this.config.scriptPath) {
  scriptPath = this.config.scriptPath;
  
  // 解析脚本以获取实际的输出目录
  const parsedConfig = InnoScriptParser.parseFile(scriptPath);
  if (parsedConfig.Setup?.OutputDir) {
    const scriptOutputDir = parsedConfig.Setup.OutputDir;
    actualOutputDir = path.isAbsolute(scriptOutputDir) 
      ? scriptOutputDir 
      : path.resolve(path.dirname(scriptPath), scriptOutputDir);
  }
}
```

## 使用场景

### 场景 1: 脚本中使用绝对路径

```ini
; installer.iss
[Setup]
AppName=Police Self Report
AppVersion=1.0.0
OutputDir=E:\innoSoft\police-self-report
OutputBaseFilename=Police Self Report_{#MyAppVersion}
```

**Forge 配置**：

```typescript
{
  name: "@electron-forge/maker-innosetup",
  config: {
    scriptPath: "./installer.iss"
  }
}
```

**结果**：Maker 会在 `E:\innoSoft\police-self-report` 中查找安装包 ✅

### 场景 2: 脚本中使用相对路径

```ini
; installer.iss
[Setup]
AppName=My App
OutputDir=output
OutputBaseFilename=MyApp-Setup
```

**项目结构**：
```
project/
├── installer.iss
└── output/           ← 相对于 installer.iss
    └── MyApp-Setup.exe
```

**结果**：Maker 会在 `project/output` 中查找安装包 ✅

### 场景 3: 脚本中未定义 OutputDir

```ini
; installer.iss
[Setup]
AppName=My App
OutputBaseFilename=MyApp-Setup
; 没有 OutputDir
```

**Forge 配置**：

```typescript
{
  name: "@electron-forge/maker-innosetup",
  config: {
    scriptPath: "./installer.iss",
    outputDir: "./out/installers"  // 使用 Maker 配置的目录
  }
}
```

**结果**：使用 `outputDir` 或默认的 `makeDir/innosetup.windows/x64` ✅

## 最佳实践

### 1. 推荐：使用 Maker 管理输出目录

不在 ISS 脚本中定义 `OutputDir`，让 Maker 控制输出位置：

```typescript
// forge.config.ts
{
  name: "@electron-forge/maker-innosetup",
  config: {
    scriptPath: "./installer.iss",
    outputDir: "./out/installers"  // Maker 控制输出目录
  }
}
```

```ini
; installer.iss
[Setup]
AppName=My App
; 不定义 OutputDir，让 Maker 控制
OutputBaseFilename=MyApp-Setup
```

### 2. 使用相对路径

如果必须在脚本中定义 `OutputDir`，使用相对路径：

```ini
[Setup]
OutputDir=output
; 相对于脚本文件所在目录
```

### 3. 架构感知的输出

利用 Maker 的架构感知功能，自动为不同架构创建子目录：

```typescript
// 不指定 scriptPath，使用配置对象
{
  name: "@electron-forge/maker-innosetup",
  config: {
    appName: "My App",
    // 自动输出到: out/make/innosetup.windows/x64/
    //            out/make/innosetup.windows/arm64/
  }
}
```

## 调试输出

Maker 现在会输出更详细的日志：

```
Using custom script: ./installer.iss
Script defines OutputDir: E:\innoSoft\police-self-report
Compiling installer...
Searching for installer in: E:\innoSoft\police-self-report
Installer created: E:\innoSoft\police-self-report\Police Self Report_1.0.0.exe
```

## 关于中文语言警告

你看到的警告：

```
Warning: A message named "DownloadingLabel" has not been defined for the "chinesesimplified" language.
```

这是 Inno Setup 的正常警告，表示中文语言文件缺少某些消息定义，会回退到英文消息。这不影响功能，但如果需要完整的中文支持，可以：

1. 使用 Inno Setup 6.2+ 自带的完整中文语言文件
2. 或者移除 `[Languages]` 中的中文配置，只使用英文

## 迁移指南

### 从旧版本迁移

如果你之前遇到过 "ENOENT" 错误：

**之前的解决方法**（不再需要）：
```typescript
// ❌ 旧方法：手动复制文件
config: {
  scriptPath: "./installer.iss",
  // 需要手动确保路径一致
}
```

**现在的方法**（自动处理）：
```typescript
// ✅ 新方法：自动解析和查找
config: {
  scriptPath: "./installer.iss",
  // Maker 会自动解析脚本中的 OutputDir
}
```

## 相关文档

- [ISS_PARSER.md](./ISS_PARSER.md) - ISS 文件解析器
- [ARCHITECTURE_OUTPUT.md](./ARCHITECTURE_OUTPUT.md) - 架构感知输出目录
- [Inno Setup OutputDir 参数](https://jrsoftware.org/ishelp/index.php?topic=setup_outputdir)

## 故障排除

### 问题：仍然找不到安装包

**可能原因**：
1. 脚本中的 `OutputBaseFilename` 与预期不符
2. 编译失败但没有报错

**解决方法**：
```typescript
// 启用详细日志
config: {
  scriptPath: "./installer.iss",
  isccOptions: ["/V5"]  // 最详细的输出
}
```

### 问题：路径包含空格导致错误

**解决方法**：
```ini
; 在 ISS 中使用引号
[Setup]
OutputDir="C:\Program Files\MyApp\Installers"
```

## 总结

现在使用自定义 ISS 脚本时，不再需要担心输出目录不一致的问题。Maker 会：

1. ✅ 自动解析脚本中的 `OutputDir`
2. ✅ 处理绝对路径和相对路径
3. ✅ 在正确的位置查找安装包
4. ✅ 提供详细的日志输出

这使得从现有的 Inno Setup 项目迁移到 Electron Forge 更加简单！
