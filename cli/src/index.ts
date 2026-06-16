import { Command } from "commander";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { REGISTRY, LIB_FILES } from "./registry.js";

// ─── Config ─────────────────────────────────────────────

const CONFIG_FILE = "soft-kit.config.json";

interface TkConfig {
  /** Path alias for imports, e.g. "@" or "~/src" */
  alias: string;
  /** Where components are placed relative to project root */
  componentsDir: string;
}

const DEFAULT_CONFIG: TkConfig = {
  alias: "@",
  componentsDir: "src/components",
};

function loadConfig(): TkConfig | null {
  const configPath = path.resolve(process.cwd(), CONFIG_FILE);
  if (!fs.existsSync(configPath)) return null;
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

function requireConfig(): TkConfig {
  const config = loadConfig();
  if (!config) {
    console.error(pc.red("No soft-kit.config.json found. Run `soft-kit init` first."));
    process.exit(1);
  }
  return config;
}

// ─── Helpers ────────────────────────────────────────────

function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFileWithLog(filePath: string, content: string, overwrite: boolean) {
  const exists = fs.existsSync(filePath);
  if (exists && !overwrite) {
    console.log(pc.yellow(`  skip ${filePath} (already exists)`));
    return;
  }
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(pc.green(`  ${exists ? "overwrite" : "create"} ${filePath}`));
}

function detectPackageManager(): "npm" | "pnpm" | "yarn" | "bun" {
  if (fs.existsSync("bun.lockb") || fs.existsSync("bun.lock")) return "bun";
  if (fs.existsSync("pnpm-lock.yaml")) return "pnpm";
  if (fs.existsSync("yarn.lock")) return "yarn";
  return "npm";
}

function installDeps(deps: string[]) {
  if (deps.length === 0) return;

  // Check which deps are already installed
  const pkgPath = path.resolve(process.cwd(), "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    deps = deps.filter((d) => !allDeps[d]);
  }

  if (deps.length === 0) {
    console.log(pc.dim("  dependencies already installed"));
    return;
  }

  const pm = detectPackageManager();
  const cmd = pm === "npm" ? `npm install ${deps.join(" ")}` : `${pm} add ${deps.join(" ")}`;
  console.log(pc.dim(`  running: ${cmd}`));
  execSync(cmd, { stdio: "inherit" });
}

// ─── CLI ────────────────────────────────────────────────

const program = new Command();

program
  .name("soft-kit")
  .description("Add soft-kit UI components to your project")
  .version("0.1.0");

// ── init ────────────────────────────────────────────────

program
  .command("init")
  .description("Initialize soft-kit in your project")
  .option("-a, --alias <alias>", "import alias", DEFAULT_CONFIG.alias)
  .option("-d, --dir <dir>", "components directory", DEFAULT_CONFIG.componentsDir)
  .option("-y, --yes", "skip prompts, use defaults")
  .action((opts) => {
    const config: TkConfig = {
      alias: opts.alias,
      componentsDir: opts.dir,
    };

    const configPath = path.resolve(process.cwd(), CONFIG_FILE);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
    console.log(pc.green(`Created ${CONFIG_FILE}`));
    console.log(pc.dim(`  alias:         ${config.alias}`));
    console.log(pc.dim(`  componentsDir: ${config.componentsDir}`));

    // Write shared lib files
    const baseDir = config.componentsDir;
    console.log(pc.bold("\nInstalling shared utilities..."));

    writeFileWithLog(
      path.resolve(process.cwd(), baseDir, LIB_FILES.cn.path),
      LIB_FILES.cn.content,
      false
    );
    writeFileWithLog(
      path.resolve(process.cwd(), baseDir, LIB_FILES.variants.path),
      LIB_FILES.variants.content,
      false
    );
    writeFileWithLog(
      path.resolve(process.cwd(), baseDir, LIB_FILES.tokens.path),
      LIB_FILES.tokens.content,
      false
    );

    // Install npm deps
    console.log(pc.bold("\nInstalling dependencies..."));
    installDeps(["clsx", "tailwind-merge"]);

    console.log(pc.green(pc.bold("\nDone! Now add components:")));
    console.log(pc.cyan("  npx soft-kit add button"));
    console.log(pc.cyan("  npx soft-kit add input"));
  });

// ── add ─────────────────────────────────────────────────

program
  .command("add")
  .description("Add a component to your project")
  .argument("<components...>", "component name(s) to add")
  .option("-o, --overwrite", "overwrite existing files", false)
  .action((componentNames: string[], opts) => {
    const config = requireConfig();
    const baseDir = config.componentsDir;

    // Resolve alias: "@" → "@/components" based on componentsDir
    // e.g. alias="@", componentsDir="src/components" → "@/components"
    const aliasBase = config.alias + "/" + path.basename(baseDir);

    for (const name of componentNames) {
      const component = REGISTRY[name];
      if (!component) {
        console.error(pc.red(`Unknown component: "${name}"`));
        console.log(pc.dim(`Available: ${Object.keys(REGISTRY).join(", ")}`));
        process.exit(1);
      }

      console.log(pc.bold(`\nAdding ${pc.cyan(component.name)}...`));

      // Install registry dependencies first (other components it depends on)
      for (const dep of component.registryDependencies) {
        if (!REGISTRY[dep]) continue;
        const depFiles = REGISTRY[dep].files;
        for (const file of depFiles) {
          const destPath = path.resolve(process.cwd(), baseDir, file.path);
          if (!fs.existsSync(destPath)) {
            console.log(pc.dim(`  installing dependency: ${dep}`));
            const content = file.content.replaceAll("{{ALIAS}}", aliasBase);
            writeFileWithLog(destPath, content, false);
          }
        }
      }

      // Ensure shared lib files exist
      for (const key of ["cn", "variants"] as const) {
        const libFile = LIB_FILES[key];
        const destPath = path.resolve(process.cwd(), baseDir, libFile.path);
        writeFileWithLog(destPath, libFile.content, false);
      }

      // Ensure tokens exist
      const tokensPath = path.resolve(process.cwd(), baseDir, LIB_FILES.tokens.path);
      writeFileWithLog(tokensPath, LIB_FILES.tokens.content, false);

      // Write component files
      for (const file of component.files) {
        const content = file.content.replaceAll("{{ALIAS}}", aliasBase);
        const destPath = path.resolve(process.cwd(), baseDir, file.path);
        writeFileWithLog(destPath, content, opts.overwrite);
      }

      // Install npm deps
      if (component.npmDependencies.length > 0) {
        installDeps(component.npmDependencies);
      }

      console.log(pc.green(`  ${component.name} installed!`));
    }

    console.log(pc.green(pc.bold("\nDone!")));
    console.log(pc.dim(`\nImport with:`));
    for (const name of componentNames) {
      const comp = REGISTRY[name];
      if (!comp) continue;
      const firstFile = comp.files[0];
      const importPath = `${aliasBase}/${firstFile.path.replace(/\.tsx?$/, "")}`;
      const exportName = name.charAt(0).toUpperCase() + name.slice(1);
      console.log(pc.cyan(`  import { ${exportName} } from "${importPath}";`));
    }
  });

// ── list ────────────────────────────────────────────────

program
  .command("list")
  .description("List all available components")
  .action(() => {
    console.log(pc.bold("\nAvailable components:\n"));
    for (const [name, comp] of Object.entries(REGISTRY)) {
      console.log(`  ${pc.cyan(name.padEnd(12))} ${pc.dim(comp.description)}`);
    }
    console.log(pc.dim(`\nAdd with: npx soft-kit add <name>`));
  });

program.parse();
