# 架构感知的输出目录结构

## 问题描述

之前的实现存在以下问题：

1. **输出目录硬编码**：使用固定的 `innosetup.windows` 目录，没有根据架构区分
2. **架构配置不准确**：使用简单的架构名称（如 "x64"）而不是架构兼容性标识符（如 "x64compatible"）
3. **目录查找不一致**：生成配置时使用 `installers` 目录，但查找时使用 `innosetup.windows` 目录

## 解决方案

### 1. 架构标识符规范化

新增 `getArchIdentifier()` 方法，将 Electron Forge 的架构名称转换为标准标识符：

```typescript
private getArchIdentifier(arch: string): string {
  switch (arch) {
    case "x64":
      return "x64";
    case "ia32":
    case "x86":
      return "x86";
    case "arm64":
      return "arm64";
    default:
      return arch;
  }
}
```

### 2. 架构兼容性配置

新增 `getArchitecturesAllowed()` 方法，生成符合 Inno Setup 规范的架构兼容性表达式：

```typescript
private getArchitecturesAllowed(arch: string): string {
  switch (arch) {
    case "x64":
      return "x64compatible";  // 支持 x64 原生和 ARM64 上的 x64 模拟
    case "ia32":
    case "x86":
      return "x86compatible";  // 支持 x86 原生和 x64/ARM64 上的 x86 模拟
    case "arm64":
      return "arm64";          // 仅 ARM64
    default:
      return arch;
  }
}
```

### 3. 架构特定的输出目录

输出目录结构现在遵循以下格式：

```
makeDir/
└── innosetup.windows/
    ├── x64/
    │   └── MyApp-1.0.0-x64-setup.exe
    ├── x86/
    │   └── MyApp-1.0.0-x86-setup.exe
    └── arm64/
        └── MyApp-1.0.0-arm64-setup.exe
```

**实现代码**：

```typescript
const baseOutputDir =
  this.config.outputDir || path.join(makeDir, "innosetup.windows");
const outputDir = path.join(baseOutputDir, archId);

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
```

### 4. 自定义输出目录支持

用户可以通过 `outputDir` 配置项自定义基础输出目录：

```typescript
// 默认：makeDir/innosetup.windows/x64/
// 自定义：customDir/x64/
config: {
  outputDir: "C:\\MyInstallers";
}
```

## 使用示例

### 基本用法

```typescript
// forge.config.ts
{
  makers: [
    {
      name: "electron-forge-maker-innosetup",
      config: {
        appName: "MyApp",
        appVersion: "1.0.0",
        // 输出到默认位置: out/make/innosetup.windows/x64/
      },
    },
  ];
}
```

### 自定义输出目录

```typescript
{
  makers: [
    {
      name: "electron-forge-maker-innosetup",
      config: {
        appName: "MyApp",
        appVersion: "1.0.0",
        outputDir: "D:\\Installers", // 输出到: D:\Installers\x64\
      },
    },
  ];
}
```

### 多架构构建

```bash
# 构建 x64 版本
npm run make -- --arch=x64
# 输出: out/make/innosetup.windows/x64/MyApp-1.0.0-x64-setup.exe

# 构建 ARM64 版本
npm run make -- --arch=arm64
# 输出: out/make/innosetup.windows/arm64/MyApp-1.0.0-arm64-setup.exe
```

## 架构兼容性说明

根据 Inno Setup 官方文档，设置正确的架构标识符非常重要：

| Electron Arch | ArchitecturesAllowed | ArchitecturesInstallIn64BitMode | 说明                                  |
| ------------- | -------------------- | ------------------------------- | ------------------------------------- |
| `x64`         | `x64compatible`      | `x64compatible`                 | 可在 x64 原生和 ARM64 Win11 上运行    |
| `ia32/x86`    | `x86compatible`      | (空)                            | 可在 x86/x64/ARM64 上运行（通过模拟） |
| `arm64`       | `arm64`              | (空)                            | 仅在 ARM64 上运行                     |

### 高级示例

如果你有一个 x64 应用但包含一些 x86 二进制文件：

```typescript
config: {
  config: {
    Setup: {
      ArchitecturesAllowed: "x64compatible and x86compatible";
    }
  }
}
```

如果你想阻止 ARM64 用户安装 x64 版本（假设你有单独的 ARM64 安装包）：

```typescript
config: {
  config: {
    Setup: {
      ArchitecturesAllowed: "x64compatible and not arm64";
    }
  }
}
```

## 优势

1. ✅ **清晰的目录结构**：每个架构的安装包都在独立的子目录中
2. ✅ **避免文件冲突**：多架构构建不会相互覆盖
3. ✅ **符合标准**：使用 Inno Setup 推荐的架构兼容性标识符
4. ✅ **向后兼容**：支持自定义 `outputDir`，不破坏现有配置
5. ✅ **更好的 CI/CD 支持**：可以并行构建不同架构的安装包

## 相关文档

- [Inno Setup - ArchitecturesAllowed](https://jrsoftware.org/ishelp/index.php?topic=setup_architecturesallowed)
