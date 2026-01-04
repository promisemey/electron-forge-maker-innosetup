# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
