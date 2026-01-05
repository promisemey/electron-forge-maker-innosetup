# 路径解析功能实现总结

## 问题

用户在使用配置时发现硬编码绝对路径非常不友好：

```typescript
// ❌ 问题代码 - 绝对路径
SetupIconFile: "E:\\workSpace\\police-self-report\\assets\\icons\\win32.ico",
Source: "E:\\workSpace\\police-self-report\\out\\PoliceSelfReport-win32-x64\\*",
```

**问题：**

- 不可移植 - 绑定到特定机器
- 团队协作困难 - 每个开发者路径不同
- CI/CD 不兼容 - 自动化构建路径完全不同

## 解决方案

### 1. 新增配置选项

在 `MakerInnosetupConfig` 接口中添加：

```typescript
interface MakerInnosetupConfig {
  // 路径解析配置
  paths?: {
    projectDir?: string; // 项目根目录，默认为 cwd()
    assetsDir?: string; // 资源目录，默认为 "assets"
    buildDir?: string; // 构建输出目录
  };

  // 是否自动解析相对路径，默认为 true
  resolveRelativePaths?: boolean;
}
```

### 2. 核心功能

#### 相对路径解析

```typescript
private resolvePath(pathStr: string | undefined, baseDir?: string): string | undefined {
  // 如果禁用了解析，直接返回
  if (this.config.resolveRelativePaths === false) {
    return pathStr;
  }

  // 如果已经是绝对路径，直接返回
  if (path.isAbsolute(pathStr)) {
    return pathStr;
  }

  // 解析为绝对路径
  const base = baseDir || this.projectDir || process.cwd();
  return path.resolve(base, pathStr);
}
```

#### 占位符解析

支持三种占位符：

| 占位符      | 说明                        | 示例                           |
| ----------- | --------------------------- | ------------------------------ |
| `{project}` | 项目根目录                  | `{project}/resources/icon.ico` |
| `{build}`   | Electron Forge 打包输出目录 | `{build}\\*`                   |
| `{assets}`  | 资源目录                    | `{assets}/icons/icon.ico`      |

```typescript
private resolvePathPlaceholders(pathStr: string | undefined): string | undefined {
  let resolved = pathStr;

  // 替换占位符
  resolved = resolved.replace(/\{project\}/g, this.projectDir);
  resolved = resolved.replace(/\{build\}/g, this.buildDir);
  resolved = resolved.replace(/\{assets\}/g, path.resolve(this.projectDir, assetsDir));

  return resolved;
}
```

#### 配置路径解析

自动解析以下配置字段：

**Setup 部分：**

- `SetupIconFile`
- `LicenseFile`
- `InfoBeforeFile`
- `InfoAfterFile`
- `WizardImageFile`
- `WizardSmallImageFile`

**Languages 部分：**

- `LicenseFile`
- `InfoBeforeFile`
- `InfoAfterFile`

**Files 部分：**

- `Source`（如果不以 `{` 开头）

### 3. 使用示例

#### 之前（绝对路径）

```typescript
new MakerInnosetup({
  config: {
    Setup: {
      SetupIconFile:
        "E:\\workSpace\\police-self-report\\assets\\icons\\win32.ico",
    },
    Files: [
      {
        Source:
          "E:\\workSpace\\police-self-report\\out\\PoliceSelfReport-win32-x64\\*",
        DestDir: "{app}",
      },
    ],
  },
});
```

#### 现在（相对路径）

```typescript
new MakerInnosetup({
  config: {
    Setup: {
      SetupIconFile: "./assets/icons/win32.ico", // ✅ 相对路径
    },
    Files: [
      {
        Source: "{build}\\*", // ✅ 使用占位符
        DestDir: "{app}",
      },
    ],
  },
});
```

### 4. 文件修改

#### 核心文件

1. **src/types.ts**
   - 添加 `paths` 配置
   - 添加 `resolveRelativePaths` 开关

2. **src/MakerInnosetup.ts**
   - 添加 `resolvePath()` 方法 - 相对路径解析
   - 添加 `resolvePathPlaceholders()` 方法 - 占位符替换
   - 添加 `resolveConfigPaths()` 方法 - 配置路径解析
   - 修改 `make()` 方法 - 应用路径解析

#### 文档文件

1. **README.md**
   - 强调相对路径的优势
   - 添加路径占位符说明
   - 更新示例代码

2. **docs/path-resolution.md**
   - 完整的路径解析指南
   - 详细的示例和最佳实践

3. **example/forge.config.simple.ts**
   - 简化的可移植配置示例

4. **CHANGELOG.md**
   - 记录新功能

#### 测试文件

**test/path-resolution.test.ts**

- 相对路径解析测试
- 占位符解析测试
- 配置路径解析测试
- 通配符支持测试
- 边界情况测试

### 5. 特性

✅ **自动解析** - 相对路径自动转换为绝对路径  
✅ **占位符支持** - `{project}`, `{build}`, `{assets}`  
✅ **可移植** - 配置可在不同机器间共享  
✅ **向后兼容** - 绝对路径仍然支持  
✅ **可选功能** - 可通过 `resolveRelativePaths: false` 禁用  
✅ **通配符支持** - 正确处理路径中的通配符

### 6. 最佳实践

1. ✅ 始终使用相对路径或占位符
2. ✅ 使用 `{build}` 引用打包输出
3. ✅ 使用 Defines 定义常量
4. ✅ 保持配置简洁
5. ❌ 避免硬编码绝对路径

### 7. 用户收益

- 🚀 **提升开发体验** - 无需关心路径问题
- 🤝 **改善团队协作** - 配置可共享
- ⚡ **加速 CI/CD** - 无需特殊处理
- 📦 **配置可移植** - 跨平台、跨环境使用

## 实现完成度

- ✅ 核心功能实现
- ✅ 类型定义更新
- ✅ 文档编写
- ✅ 示例代码
- ✅ 测试用例
- ✅ 变更日志

## 下一步

建议用户在实际项目中测试路径解析功能，确保在各种场景下都能正常工作。
