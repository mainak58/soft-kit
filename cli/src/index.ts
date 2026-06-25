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
  /** Global stylesheet that component CSS is appended to */
  globalCss: string;
}

const DEFAULT_CONFIG: TkConfig = {
  alias: "@",
  componentsDir: "src/components",
  globalCss: "src/app/globals.css",
};

function loadConfig(): TkConfig | null {
  const configPath = path.resolve(process.cwd(), CONFIG_FILE);
  if (!fs.existsSync(configPath)) return null;
  const parsed = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  // Backfill defaults so older config files keep working
  return { ...DEFAULT_CONFIG, ...parsed };
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

/**
 * Sync a component's CSS into the project's global stylesheet.
 * Each block is wrapped in soft-kit markers so it's idempotent.
 *   - overwrite=false (add):    skip if a block already exists
 *   - overwrite=true  (update): replace the existing block in place
 * The global file is created if missing.
 */
function syncCss(
  globalCssPath: string,
  componentName: string,
  css: string,
  overwrite: boolean
) {
  const absPath = path.resolve(process.cwd(), globalCssPath);
  const startMarker = `/* soft-kit:${componentName} start */`;
  const endMarker = `/* soft-kit:${componentName} end */`;
  const block = `${startMarker}\n${css.trim()}\n${endMarker}`;

  const existing = fs.existsSync(absPath) ? fs.readFileSync(absPath, "utf-8") : "";
  const start = existing.indexOf(startMarker);
  const hasBlock = start !== -1;

  if (hasBlock && !overwrite) {
    console.log(pc.yellow(`  skip ${globalCssPath} (${componentName} css already present)`));
    return;
  }

  let next: string;
  if (hasBlock) {
    // Replace the existing block (markers included) in place
    const end = existing.indexOf(endMarker) + endMarker.length;
    next = existing.slice(0, start) + block + existing.slice(end);
  } else {
    next = existing.trim().length > 0 ? `${existing.trimEnd()}\n\n${block}\n` : `${block}\n`;
  }

  ensureDir(path.dirname(absPath));
  fs.writeFileSync(absPath, next, "utf-8");
  const verb = hasBlock ? "update" : existing ? "update" : "create";
  console.log(pc.green(`  ${verb} ${globalCssPath} (${componentName} css)`));
}

/**
 * Is a component already present in the user's project? (any of its files)
 */
function isInstalled(name: string, baseDir: string): boolean {
  const comp = REGISTRY[name];
  if (!comp) return false;
  return comp.files.some((f) =>
    fs.existsSync(path.resolve(process.cwd(), baseDir, f.path))
  );
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
  .option("-c, --css <path>", "global stylesheet for component CSS", DEFAULT_CONFIG.globalCss)
  .option("-y, --yes", "skip prompts, use defaults")
  .action((opts) => {
    const config: TkConfig = {
      alias: opts.alias,
      componentsDir: opts.dir,
      globalCss: opts.css,
    };

    const configPath = path.resolve(process.cwd(), CONFIG_FILE);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
    console.log(pc.green(`Created ${CONFIG_FILE}`));
    console.log(pc.dim(`  alias:         ${config.alias}`));
    console.log(pc.dim(`  componentsDir: ${config.componentsDir}`));
    console.log(pc.dim(`  globalCss:     ${config.globalCss}`));

    // Write shared JS utilities at the src root (the alias target), NOT inside
    // the components folder. e.g. componentsDir "src/components" puts lib at
    // "src/lib". Existing files are left untouched. No CSS token file is
    // created — components style themselves with plain Tailwind utilities,
    // and any component-specific CSS is appended to globalCss on `add`.
    const baseDir = config.componentsDir;
    const srcRoot = path.dirname(baseDir);
    console.log(pc.bold("\nInstalling shared utilities..."));

    writeFileWithLog(
      path.resolve(process.cwd(), srcRoot, LIB_FILES.cn.path),
      LIB_FILES.cn.content,
      false
    );
    writeFileWithLog(
      path.resolve(process.cwd(), srcRoot, LIB_FILES.variants.path),
      LIB_FILES.variants.content,
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
    const srcRoot = path.dirname(baseDir);

    // The alias maps to the src root (e.g. "@" -> "src").
    //   aliasRoot ("@")           -> shared util imports resolve to @/lib/cn
    //   aliasBase ("@/components") -> used only for the "import with" hint
    const aliasRoot = config.alias;
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
        const depComp = REGISTRY[dep];
        if (!depComp) continue;
        for (const file of depComp.files) {
          const destPath = path.resolve(process.cwd(), baseDir, file.path);
          if (!fs.existsSync(destPath)) {
            console.log(pc.dim(`  installing dependency: ${dep}`));
            const content = file.content.replaceAll("{{ALIAS}}", aliasRoot);
            writeFileWithLog(destPath, content, false);
          }
        }
        // A dependency may also need its CSS appended to the global stylesheet
        if (depComp.css) syncCss(config.globalCss, depComp.name, depComp.css, false);
      }

      // Ensure shared lib files exist at the src root (@/lib/*)
      for (const key of ["cn", "variants"] as const) {
        const libFile = LIB_FILES[key];
        const destPath = path.resolve(process.cwd(), srcRoot, libFile.path);
        writeFileWithLog(destPath, libFile.content, false);
      }

      // Write component files
      for (const file of component.files) {
        const content = file.content.replaceAll("{{ALIAS}}", aliasRoot);
        const destPath = path.resolve(process.cwd(), baseDir, file.path);
        writeFileWithLog(destPath, content, opts.overwrite);
      }

      // Append this component's CSS to the global stylesheet (if it has any).
      // Components like button ship no CSS, so nothing is written for them.
      if (component.css) {
        syncCss(config.globalCss, component.name, component.css, false);
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
      // kebab/snake-case → PascalCase, e.g. "tab-switcher" → "TabSwitcher"
      const exportName = name
        .split(/[-_]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
      console.log(pc.cyan(`  import { ${exportName} } from "${importPath}";`));
    }
  });

// ── update ──────────────────────────────────────────────

program
  .command("update")
  .description("Re-fetch installed component(s) to the latest version")
  .argument("<components...>", 'component name(s), or "all"')
  .action((componentNames: string[]) => {
    const config = requireConfig();
    const baseDir = config.componentsDir;
    const srcRoot = path.dirname(baseDir);
    const aliasRoot = config.alias;

    // Resolve which components to update
    let targets: string[];
    if (componentNames.length === 1 && componentNames[0] === "all") {
      targets = Object.keys(REGISTRY).filter((name) => isInstalled(name, baseDir));
      if (targets.length === 0) {
        console.log(pc.yellow("No soft-kit components found in this project."));
        return;
      }
      console.log(pc.dim(`Updating: ${targets.join(", ")}`));
    } else {
      targets = componentNames;
    }

    for (const name of targets) {
      const component = REGISTRY[name];
      if (!component) {
        console.error(pc.red(`Unknown component: "${name}"`));
        console.log(pc.dim(`Available: ${Object.keys(REGISTRY).join(", ")}`));
        process.exit(1);
      }

      if (!isInstalled(name, baseDir)) {
        console.log(
          pc.yellow(`\n${name} is not installed — use \`npx soft-kit add ${name}\``)
        );
        continue;
      }

      console.log(pc.bold(`\nUpdating ${pc.cyan(component.name)}...`));

      // Overwrite the component files with the latest version
      for (const file of component.files) {
        const content = file.content.replaceAll("{{ALIAS}}", aliasRoot);
        const destPath = path.resolve(process.cwd(), baseDir, file.path);
        writeFileWithLog(destPath, content, true);
      }

      // Refresh its CSS block in place (replace, don't duplicate)
      if (component.css) {
        syncCss(config.globalCss, component.name, component.css, true);
      }

      // Make sure any (possibly new) dependencies are installed
      if (component.npmDependencies.length > 0) {
        installDeps(component.npmDependencies);
      }

      console.log(pc.green(`  ${component.name} updated!`));
    }

    console.log(pc.green(pc.bold("\nDone!")));
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
