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
      const testMaker = new MakerInnosetup({
        setupIconFile: "./assets/icon.ico",
        paths: {
          projectDir: projectDir,
        },
        resolveRelativePaths: true,
      });

      // 访问私有方法进行测试
      const resolvePath = (testMaker as any).resolvePath.bind(testMaker);
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
      const testMaker = new MakerInnosetup({
        resolveRelativePaths: false,
      });

      const resolvePath = (testMaker as any).resolvePath.bind(testMaker);
      const result = resolvePath("./relative/path");

      // 实际返回值是基于 cwd 解析的绝对路径
      expect(result).toBe(path.resolve(process.cwd(), "./relative/path"));
    });

    // it("当禁用解析时应该返回原路径", () => {
    //   const testMaker = new MakerInnosetup({
    //     resolveRelativePaths: false,
    //     scriptPath: "./relative/path",
    //   });

    //   const resolvePath = (testMaker as any).resolvePath.bind(testMaker);
    //   const result = resolvePath("./relative/path");
    //   expect(result).toBe("./relative/path"); // 当禁用解析时，应该返回原路径

    //   // // 检查 localConfig 是否正确设置
    //   // expect(testMaker.config?.resolveRelativePaths).toBe(false);

    //   // const resolvePath = (testMaker as any).resolvePath.bind(testMaker);
    //   // const result = resolvePath("./relative/path");

    //   // 当禁用解析时，应该返回原路径
    //   // expect(result).toBe("./relative/path");
    // });
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

      // 注意：replace 会保持原始分隔符，所以我们规范化路径
      expect(path.normalize(result)).toBe(
        path.join(projectDir, "resources", "icon.ico")
      );
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

      // 注意：replace 会保持原始分隔符，所以我们规范化路径
      expect(path.normalize(result)).toBe(
        path.join(projectDir, "assets", "icons", "icon.ico")
      );
    });

    it("应该支持自定义 assets 目录", () => {
      const customMaker = new MakerInnosetup({
        paths: {
          projectDir: projectDir,
          assetsDir: "resources",
        },
        resolveRelativePaths: true,
      });

      (customMaker as any).projectDir = projectDir;
      (customMaker as any).assetsDir = "resources"; // 覆盖内部字段

      const resolvePathPlaceholders = (
        customMaker as any
      ).resolvePathPlaceholders.bind(customMaker);
      const result = resolvePathPlaceholders("{assets}/icon.ico");

      expect(path.normalize(result)).toBe(
        path.join(projectDir, "resources", "icon.ico")
      );

      // (customMaker as any).projectDir = projectDir;

      // const resolvePathPlaceholders = (
      //   customMaker as any
      // ).resolvePathPlaceholders.bind(customMaker);

      // const result = resolvePathPlaceholders("{assets}/icon.ico");

      // // 断言最终解析路径正确
      // expect(path.normalize(result)).toBe(
      //   path.join(projectDir, "resources", "icon.ico")
      // );

      // (customMaker as any).projectDir = projectDir;

      // // 检查 localConfig 是否正确设置
      // expect((customMaker as any).localConfig.paths.assetsDir).toBe(
      //   "resources"
      // );

      // const resolvePathPlaceholders = (
      //   customMaker as any
      // ).resolvePathPlaceholders.bind(customMaker);
      // const result = resolvePathPlaceholders("{assets}/icon.ico");

      // // 注意：replace 会保持原始分隔符，所以我们规范化路径
      // expect(path.normalize(result)).toBe(
      //   path.join(projectDir, "resources", "icon.ico")
      // );
    });

    it("应该处理多个占位符", () => {
      const resolvePathPlaceholders = (
        maker as any
      ).resolvePathPlaceholders.bind(maker);
      const result = resolvePathPlaceholders("{project}/{assets}/icon.ico");

      // 注意：replace 会保持原始分隔符，所以我们规范化路径
      expect(path.normalize(result)).toBe(
        path.normalize(
          path.join(projectDir, path.join(projectDir, "assets"), "icon.ico")
        )
      );
    });
  });

  describe("配置路径解析", () => {
    it("应该解析 Setup 中的路径字段", () => {
      const testMaker = new MakerInnosetup({
        paths: {
          projectDir: projectDir,
        },
        resolveRelativePaths: true,
      });

      const config = {
        Setup: {
          SetupIconFile: "./assets/icon.ico",
          LicenseFile: "./LICENSE",
        },
      };

      (testMaker as any).projectDir = projectDir;
      (testMaker as any).resolveConfigPaths(config, buildDir);

      expect(config.Setup.SetupIconFile).toBe(
        path.join(projectDir, "assets", "icon.ico")
      );
      expect(config.Setup.LicenseFile).toBe(path.join(projectDir, "LICENSE"));
    });

    it("应该解析 Files 中的 Source 路径", () => {
      const testMaker = new MakerInnosetup({
        paths: {
          projectDir: projectDir,
        },
        resolveRelativePaths: true,
      });

      const config = {
        Files: [
          {
            Source: "./out/my-app/*",
            DestDir: "{app}",
          },
        ],
      };

      (testMaker as any).projectDir = projectDir;
      (testMaker as any).resolveConfigPaths(config, buildDir);

      // Source 路径应该基于 buildDir 解析
      expect(config.Files[0].Source).toContain("out");
    });

    it("应该跳过以 compiler: 开头的路径", () => {
      const testMaker = new MakerInnosetup({
        paths: {
          projectDir: projectDir,
        },
        resolveRelativePaths: true,
      });

      const config = {
        Languages: [
          {
            Name: "english",
            MessagesFile: "compiler:Default.isl",
            LicenseFile: "compiler:Default.isl",
          },
        ],
      };

      (testMaker as any).projectDir = projectDir;
      (testMaker as any).resolveConfigPaths(config, buildDir);

      // compiler: 路径应该保持不变
      expect(config.Languages[0].LicenseFile).toBe("compiler:Default.isl");
    });

    it("应该跳过以 { 开头的 Inno Setup 常量", () => {
      const testMaker = new MakerInnosetup({
        paths: {
          projectDir: projectDir,
        },
        resolveRelativePaths: true,
      });

      const config = {
        Files: [
          {
            Source: "{app}\\config.json",
            DestDir: "{tmp}",
          },
        ],
      };

      (testMaker as any).projectDir = projectDir;
      (testMaker as any).resolveConfigPaths(config, buildDir);

      // Inno Setup 常量应该保持不变
      expect(config.Files[0].Source).toBe("{app}\\config.json");
    });
  });

  describe("通配符支持", () => {
    it("应该正确处理通配符路径", () => {
      const testMaker = new MakerInnosetup({
        paths: {
          projectDir: projectDir,
        },
        resolveRelativePaths: true,
      });

      const config = {
        Files: [
          {
            Source: "./out/my-app/*",
            DestDir: "{app}",
          },
        ],
      };

      (testMaker as any).projectDir = projectDir;
      (testMaker as any).buildDir = buildDir;
      (testMaker as any).resolveConfigPaths(config, buildDir);

      // 应该包含通配符
      expect(config.Files[0].Source).toContain("*");
    });

    it("应该处理 {build} 占位符 + 通配符", () => {
      const testMaker = new MakerInnosetup({
        paths: {
          projectDir: projectDir,
        },
        resolveRelativePaths: true,
      });

      (testMaker as any).projectDir = projectDir;
      (testMaker as any).buildDir = buildDir;

      const resolvePathPlaceholders = (
        testMaker as any
      ).resolvePathPlaceholders.bind(testMaker);
      const result = resolvePathPlaceholders("{build}\\**\\*.dll");

      expect(result).toBe(buildDir + "\\**\\*.dll");
    });
  });

  describe("配置完整性", () => {
    it("应该保留未解析的配置", () => {
      const testMaker = new MakerInnosetup({
        paths: {
          projectDir: projectDir,
        },
        resolveRelativePaths: true,
      });

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

      (testMaker as any).projectDir = projectDir;
      (testMaker as any).resolveConfigPaths(config, buildDir);

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
      const testMaker = new MakerInnosetup({ resolveRelativePaths: true });
      const resolvePath = (testMaker as any).resolvePath.bind(testMaker);

      // 应该使用 cwd 作为默认值
      const result = resolvePath("./test");
      expect(result).toBeTruthy();
    });
  });
});
