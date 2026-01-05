# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **智能路径解析系统**: 支持相对路径和占位符，告别绝对路径硬编码
  - 自动将相对路径解析为绝对路径
  - 支持 `{project}`, `{build}`, `{assets}` 路径占位符
  - 配置可移植，支持团队协作和 CI/CD
  - 新增 `paths` 配置选项，可自定义资源目录
  - 新增 `resolveRelativePaths` 开关，可禁用自动解析
  - 支持通配符路径解析
- 新增详细文档: `docs/path-resolution.md`
- 新增示例配置: `example/forge.config.simple.ts` - 展示相对路径用法
- **预处理器常量支持 (#define)**: 支持在配置中使用 `Defines` 字段定义预处理器常量
  - 支持 `{#ConstantName}` 语法引用常量
  - 支持字符串拼接 (e.g., `MyAppName + " File"`)
  - 支持 `StringChange()` 函数
  - ISS 脚本解析器可选择保留或替换常量引用
  - 生成的 ISS 脚本包含完整的 `#define` 指令
- 新增示例配置: `example/forge.config.with-defines.ts`

### Changed

- `MakerInnosetupConfig` 类型定义增加路径解析相关字段
- `MakerInnosetup.make()` 方法现在会自动解析配置中的路径
- `InnoScriptParser.parse()` 新增 `preserveDefineReferences` 参数
- `InnoScriptGenerator` 生成的脚本现在包含标准的 Inno Setup 注释头
- README 更新，强调相对路径的优势

## [0.1.0] - 2026-01-04

### Added

- Initial release
- Full TypeScript support with complete Innosetup type definitions
- Support for all Innosetup configuration sections:
  - Setup
  - Languages
  - Types
  - Components
  - Tasks
  - Files
  - Dirs
  - Icons
  - Registry
  - Run/UninstallRun
  - InstallDelete/UninstallDelete
  - INI
  - Messages/CustomMessages
  - Code (Pascal Script)
- **Built-in portable Innosetup support**
  - Automatically finds bundled portable version in `vendor/innosetup/`
  - Priority lookup: config → bundled → env var → system install
  - Setup script to easily create portable version from system install
- Automatic Innosetup compiler detection
- Support for custom `.iss` script files
- Desktop and Quick Launch icon creation options
- Multi-language installer support
- Extends `@electron-forge/maker-base` for seamless integration
- Comprehensive documentation and examples

### Features

- ✨ Complete TypeScript type definitions for all Innosetup options
- 🎯 Flexible configuration via code or custom scripts
- 📦 Built-in portable version support
- 🚀 Automatic compiler path detection (4-tier lookup)
- 📦 Support for multiple languages
- 🎨 Customizable installation wizard
- 🔧 Pascal Script code injection support
- 🛠️ Automated setup scripts for portable version
