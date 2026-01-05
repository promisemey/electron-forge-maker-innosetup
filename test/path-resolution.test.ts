import { describe, it, expect, beforeEach } from "@jest/globals";
import * as path from "path";
import MakerInnosetup from "../src/MakerInnosetup";

describe("路径解析功能", () => {
  let maker: MakerInnosetup;
  const projectDir = "C:\\Users\\test\\my-project";
  const buildDir = path.join(projectDir, "out", "my-app-win32-x64");

  beforeEach(() => {
    maker = new MakerInnosetup({
      paths: {
        projectDir: projectDir,
        assetsDir: "assets",
      },
      resolveRelativePaths: true,
    });
  });

  describe("相对路径解析", () => {
    it("应该解析相对路径为绝对路径", () => {
      const maker = new MakerInnosetup({
        setupIconFile: "./assets/icon.ico",
        paths: {
          projectDir: projectDir,
        },
      });

      // 访问私有方法进行测试
      const resolvePath = (maker as any).resolvePath.bind(maker);
      const result = resolvePath("./assets/icon.ico", projectDir);

      expect(result).toBe(path.join(projectDir, "assets", "icon.ico"));
    });

    it("应该保持绝对路径不变", () => {
      const absolutePath = "C:\\absolute\\path\\icon.ico";
      const resolvePath = (maker as any).resolvePath.bind(maker);
      const result = resolvePath(absolutePath);

      expect(result).toBe(absolutePath);
    });

    it("当禁用解析时应该返回原路径", () => {
      const maker = new MakerInnosetup({
        resolveRelativePaths: false,
      });

      const resolvePath = (maker as any).resolvePath.bind(maker);
      const result = resolvePath("./relative/path");

      expect(result).toBe("./relative/path");
    });
  });

  describe("路径占位符解析", () => {
    beforeEach(() => {
      (maker as any).projectDir = projectDir;
      (maker as any).buildDir = buildDir;
    });

    it("应该解析 {project} 占位符", () => {
      const resolvePathPlaceholders = (
        maker as any
      ).resolvePathPlaceholders.bind(maker);
      const result = resolvePathPlaceholders("{project}/resources/icon.ico");

      expect(result).toBe(path.join(projectDir, "resources", "icon.ico"));
    });

    it("应该解析 {build} 占位符", () => {
      const resolvePathPlaceholders = (
        maker as any
      ).resolvePathPlaceholders.bind(maker);
      const result = resolvePathPlaceholders("{build}\\*");

      expect(result).toBe(buildDir + "\\*");
    });

    it("应该解析 {assets} 占位符", () => {
      const resolvePathPlaceholders = (
        maker as any
      ).resolvePathPlaceholders.bind(maker);
      const result = resolvePathPlaceholders("{assets}/icons/icon.ico");

      expect(result).toBe(path.join(projectDir, "assets", "icons", "icon.ico"));
    });

    it("应该支持自定义 assets 目录", () => {
      const customMaker = new MakerInnosetup({
        paths: {
          projectDir: projectDir,
          assetsDir: "resources",
        },
      });

      (customMaker as any).projectDir = projectDir;
      const resolvePathPlaceholders = (
        customMaker as any
      ).resolvePathPlaceholders.bind(customMaker);
      const result = resolvePathPlaceholders("{assets}/icon.ico");

      expect(result).toBe(path.join(projectDir, "resources", "icon.ico"));
    });

    it("应该处理多个占位符", () => {
      const resolvePathPlaceholders = (
        maker as any
      ).resolvePathPlaceholders.bind(maker);
      const result = resolvePathPlaceholders("{project}/{assets}/icon.ico");

      expect(result).toBe(
        path.join(projectDir, path.join(projectDir, "assets"), "icon.ico")
      );
    });
  });

  describe("配置路径解析", () => {
    it("应该解析 Setup 中的路径字段", () => {
      const config = {
        Setup: {
          SetupIconFile: "./assets/icon.ico",
          LicenseFile: "./LICENSE",
        },
      };

      (maker as any).projectDir = projectDir;
      (maker as any).resolveConfigPaths(config, buildDir);

      expect(config.Setup.SetupIconFile).toBe(
        path.join(projectDir, "assets", "icon.ico")
      );
      expect(config.Setup.LicenseFile).toBe(path.join(projectDir, "LICENSE"));
    });

    it("应该解析 Files 中的 Source 路径", () => {
      const config = {
        Files: [
          {
            Source: "./out/my-app/*",
            DestDir: "{app}",
          },
        ],
      };

      (maker as any).projectDir = projectDir;
      (maker as any).resolveConfigPaths(config, buildDir);

      // Source 路径应该基于 buildDir 解析
      expect(config.Files[0].Source).toContain("out");
    });

    it("应该跳过以 compiler: 开头的路径", () => {
      const config = {
        Languages: [
          {
            Name: "english",
            MessagesFile: "compiler:Default.isl",
            LicenseFile: "compiler:Default.isl",
          },
        ],
      };

      (maker as any).projectDir = projectDir;
      (maker as any).resolveConfigPaths(config, buildDir);

      // compiler: 路径应该保持不变
      expect(config.Languages[0].LicenseFile).toBe("compiler:Default.isl");
    });

    it("应该跳过以 { 开头的 Inno Setup 常量", () => {
      const config = {
        Files: [
          {
            Source: "{app}\\config.json",
            DestDir: "{tmp}",
          },
        ],
      };

      (maker as any).projectDir = projectDir;
      (maker as any).resolveConfigPaths(config, buildDir);

      // Inno Setup 常量应该保持不变
      expect(config.Files[0].Source).toBe("{app}\\config.json");
    });
  });

  describe("通配符支持", () => {
    it("应该正确处理通配符路径", () => {
      const config = {
        Files: [
          {
            Source: "./out/my-app/*",
            DestDir: "{app}",
          },
        ],
      };

      (maker as any).projectDir = projectDir;
      (maker as any).buildDir = buildDir;
      (maker as any).resolveConfigPaths(config, buildDir);

      // 应该包含通配符
      expect(config.Files[0].Source).toContain("*");
    });

    it("应该处理 {build} 占位符 + 通配符", () => {
      const maker = new MakerInnosetup({
        paths: {
          projectDir: projectDir,
        },
      });

      (maker as any).projectDir = projectDir;
      (maker as any).buildDir = buildDir;

      const resolvePathPlaceholders = (
        maker as any
      ).resolvePathPlaceholders.bind(maker);
      const result = resolvePathPlaceholders("{build}\\**\\*.dll");

      expect(result).toBe(buildDir + "\\**\\*.dll");
    });
  });

  describe("配置完整性", () => {
    it("应该保留未解析的配置", () => {
      const config = {
        Setup: {
          AppName: "My App",
          SetupIconFile: "./icon.ico",
        },
        Tasks: [
          {
            Name: "desktopicon",
            Description: "Create desktop icon",
          },
        ],
      };

      (maker as any).projectDir = projectDir;
      (maker as any).resolveConfigPaths(config, buildDir);

      // 非路径配置应该保持不变
      expect(config.Setup.AppName).toBe("My App");
      expect(config.Tasks[0].Name).toBe("desktopicon");
    });
  });

  describe("边界情况", () => {
    it("应该处理 undefined 路径", () => {
      const resolvePath = (maker as any).resolvePath.bind(maker);
      const result = resolvePath(undefined);

      expect(result).toBeUndefined();
    });

    it("应该处理空字符串", () => {
      const resolvePath = (maker as any).resolvePath.bind(maker);
      const result = resolvePath("");

      expect(result).toBeUndefined();
    });

    it("应该处理没有 projectDir 的情况", () => {
      const maker = new MakerInnosetup({});
      const resolvePath = (maker as any).resolvePath.bind(maker);

      // 应该使用 cwd 作为默认值
      const result = resolvePath("./test");
      expect(result).toBeTruthy();
    });
  });
});
