/**
 * Auto-generates cli/src/registry.ts from src/components/*
 *
 * How it works:
 *   1. Scans every folder inside src/components/
 *   2. Reads the component.json for metadata (name, description, deps)
 *   3. Reads all .ts/.tsx files in the folder
 *   4. Rewrites import paths (../../lib/X → {{ALIAS}}/lib/X)
 *   5. Merges all files into a single component output file (ui/<name>.tsx)
 *   6. Also reads shared lib files (cn.ts, variants.ts, tokens.css)
 *   7. Writes the final registry.ts
 *
 * Run: node scripts/generate-registry.js
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const COMPONENTS_DIR = path.join(ROOT, "src", "components");
const LIB_DIR = path.join(ROOT, "src", "lib");
const OUTPUT = path.join(ROOT, "cli", "src", "registry.ts");

// ─── Helpers ────────────────────────────────────────────

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

function escapeTemplate(str) {
  // Escape backticks and ${} for embedding inside template literals
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

/**
 * Reads a component folder and merges all .ts/.tsx files into a single
 * self-contained component file.
 *
 * It does:
 *   - Combines types, styles, and component into one file
 *   - Rewrites internal imports (from "./button.styles" etc) by inlining
 *   - Rewrites lib imports (../../lib/cn → {{ALIAS}}/lib/cn)
 */
function buildComponentFile(componentDir, componentName) {
  const files = fs.readdirSync(componentDir).filter(
    (f) => (f.endsWith(".ts") || f.endsWith(".tsx")) && f !== "index.ts"
  );

  // Sort: types first, then styles, then component
  files.sort((a, b) => {
    const order = (f) => {
      if (f.includes(".types")) return 0;
      if (f.includes(".styles")) return 1;
      return 2;
    };
    return order(a) - order(b);
  });

  // Imports are merged per source module so that two files importing from the
  // same package (e.g. both pulling `ReactNode` from "react") don't emit a
  // duplicate identifier in the merged output.
  const importsBySource = new Map(); // source -> { default, defaultType, namespace, named: Map<spec, isType> }
  const sourceOrder = [];
  const getImportEntry = (source) => {
    if (!importsBySource.has(source)) {
      importsBySource.set(source, {
        default: null,
        defaultType: false,
        namespace: null,
        named: new Map(),
      });
      sourceOrder.push(source);
    }
    return importsBySource.get(source);
  };
  const bodyParts = [];
  let useClient = false;

  for (const file of files) {
    let content = readFile(path.join(componentDir, file));

    // Detect + strip a "use client" / "use server" directive from each file.
    // It must end up as the very first line of the merged output (above
    // imports), so we hoist it instead of leaving it in the body.
    const directiveRegex = /^\s*["']use (?:client|server)["'];?\s*$/m;
    if (directiveRegex.test(content)) {
      useClient = true;
      content = content.replace(directiveRegex, "");
    }

    // Parse each import (single- or multi-line) and merge it by source module.
    const importRegex = /^import\s+([\s\S]*?)\s+from\s+["']([^"']+)["'];?\s*$/gm;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      let clause = match[1].trim();
      let source = match[2];
      // Skip local imports (./button.styles, ./button.types) — they get inlined
      if (source.startsWith("./")) continue;
      // Rewrite lib imports: ../../lib/cn -> {{ALIAS}}/lib/cn
      if (source.includes("../../lib/")) {
        source = source.replace("../../lib/", "{{ALIAS}}/lib/");
      }
      const entry = getImportEntry(source);

      // Whole-statement type-only import? ("import type ...")
      let stmtType = false;
      if (/^type\s+/.test(clause)) {
        stmtType = true;
        clause = clause.replace(/^type\s+/, "");
      }

      // Namespace import: "* as Foo"
      const ns = clause.match(/^\*\s+as\s+([A-Za-z0-9_$]+)$/);
      if (ns) {
        entry.namespace = ns[1];
        continue;
      }

      // Split optional default name from the named "{ ... }" block
      let namedPart = null;
      const braceIdx = clause.indexOf("{");
      if (braceIdx !== -1) {
        const before = clause.slice(0, braceIdx).replace(/,\s*$/, "").trim();
        if (before) {
          entry.default = before;
          if (stmtType) entry.defaultType = true;
        }
        namedPart = clause.slice(braceIdx + 1, clause.lastIndexOf("}"));
      } else if (clause) {
        entry.default = clause;
        if (stmtType) entry.defaultType = true;
      }

      if (namedPart !== null) {
        for (let spec of namedPart.split(",")) {
          spec = spec.trim();
          if (!spec) continue;
          let isType = stmtType;
          if (/^type\s+/.test(spec)) {
            isType = true;
            spec = spec.replace(/^type\s+/, "").trim();
          }
          // A name is type-only only if EVERY occurrence of it is type-only
          const prev = entry.named.get(spec);
          entry.named.set(spec, prev === undefined ? isType : prev && isType);
        }
      }
    }

    // Remove ALL import statements (single-line and multi-line)
    content = content.replace(/^import\s+(?:[\s\S]*?)from\s+["'][^"']+["'];?\s*$/gm, "");

    // Remove "export default" but keep "export const", "export interface", etc.
    // Remove empty lines at the start
    content = content.replace(/^\s*\n/gm, "").trim();

    if (content) {
      bodyParts.push(content);
    }
  }

  // Emit one merged import statement per source module.
  const importLines = [];
  for (const source of sourceOrder) {
    const e = importsBySource.get(source);
    if (e.namespace) {
      importLines.push(`import * as ${e.namespace} from "${source}";`);
    }
    const named = [...e.named.entries()];
    const hasDefault = !!e.default;
    if (!hasDefault && named.length === 0) continue;

    // A statement can be a single `import type { ... }` only when there's no
    // default and every named specifier is type-only; otherwise mark types inline.
    const typeOnlyStmt = !hasDefault && named.length > 0 && named.every(([, t]) => t);

    const segs = [];
    if (hasDefault) segs.push(e.default);
    if (named.length > 0) {
      const specs = named.map(([name, t]) =>
        typeOnlyStmt ? name : t ? `type ${name}` : name
      );
      segs.push(`{ ${specs.join(", ")} }`);
    }
    importLines.push(`import ${typeOnlyStmt ? "type " : ""}${segs.join(", ")} from "${source}";`);
  }

  const prefix = useClient ? `"use client";\n\n` : "";
  let combined = prefix + importLines.join("\n") + "\n\n" + bodyParts.join("\n\n") + "\n";
  combined = dedupeReexports(combined);
  return combined;
}

/**
 * After merging, a name can be both declared-and-exported (e.g.
 * `export const buttonVariants = …` from the styles file) AND named again in
 * the component file's trailing `export { Button, buttonVariants };`. In the
 * separate source modules that's a valid re-export, but once merged into one
 * file it's a duplicate export (TS2323 / TS2484). Drop any name from a local
 * `export { … }` block that the merged file already exports via a declaration;
 * keep the rest (e.g. the component itself, declared only as a local const).
 */
function dedupeReexports(body) {
  const exportedDecl = new Set();
  const declRegex =
    /\bexport\s+(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z0-9_$]+)/g;
  let m;
  while ((m = declRegex.exec(body)) !== null) {
    exportedDecl.add(m[1]);
  }

  // Local `export { … };` blocks only — never `export { … } from "…"`.
  return body.replace(/export\s*\{([^}]*)\}\s*;?(?!\s*from)/g, (full, inner) => {
    const kept = inner
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((spec) => {
        // The exported name is whatever follows `as`, else the name itself.
        const exportedName = spec.split(/\s+as\s+/).pop().trim();
        return !exportedDecl.has(exportedName);
      });
    return kept.length === 0 ? "" : `export { ${kept.join(", ")} };`;
  });
}

// ─── Main ───────────────────────────────────────────────

function generate() {
  console.log("Scanning src/components/...\n");

  // Read shared lib files
  const cnContent = readFile(path.join(LIB_DIR, "cn.ts"));
  const variantsContent = readFile(path.join(LIB_DIR, "variants.ts"));

  // Scan component folders
  const componentDirs = fs
    .readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .filter((d) => fs.existsSync(path.join(COMPONENTS_DIR, d.name, "component.json")));

  const components = [];

  for (const dir of componentDirs) {
    const componentDir = path.join(COMPONENTS_DIR, dir.name);
    const config = JSON.parse(readFile(path.join(componentDir, "component.json")));
    const mergedContent = buildComponentFile(componentDir, dir.name);

    // Optional per-component CSS: <name>.css gets appended to the project's
    // global stylesheet by the CLI. Components without one inject no CSS.
    const cssPath = path.join(componentDir, `${dir.name}.css`);
    const css = fs.existsSync(cssPath) ? readFile(cssPath) : null;

    components.push({
      name: config.name,
      description: config.description,
      registryDependencies: config.registryDependencies || [],
      npmDependencies: config.npmDependencies || [],
      content: mergedContent,
      css,
    });

    console.log(`  found: ${config.name} (${config.description})${css ? " [+css]" : ""}`);
  }

  // Generate registry.ts
  let output = `/**
 * AUTO-GENERATED — do not edit manually.
 * Run: node scripts/generate-registry.js
 */

export interface RegistryFile {
  path: string;
  content: string;
}

export interface RegistryComponent {
  name: string;
  description: string;
  files: RegistryFile[];
  registryDependencies: string[];
  npmDependencies: string[];
  /** CSS appended to the project's global stylesheet, or null if none. */
  css: string | null;
}

// ─── Shared utilities ───────────────────────────────────

export const LIB_FILES: Record<string, RegistryFile> = {
  cn: {
    path: "lib/cn.ts",
    content: \`${escapeTemplate(cnContent)}\`,
  },
  variants: {
    path: "lib/variants.ts",
    content: \`${escapeTemplate(variantsContent)}\`,
  },
};

// ─── Component Registry ─────────────────────────────────

export const REGISTRY: Record<string, RegistryComponent> = {
`;

  for (const comp of components) {
    output += `  "${comp.name}": {
    name: "${comp.name}",
    description: "${comp.description}",
    files: [
      {
        path: "ui/${comp.name}.tsx",
        content: \`${escapeTemplate(comp.content)}\`,
      },
    ],
    registryDependencies: ${JSON.stringify(comp.registryDependencies)},
    npmDependencies: ${JSON.stringify(comp.npmDependencies)},
    css: ${comp.css === null ? "null" : `\`${escapeTemplate(comp.css)}\``},
  },
`;
  }

  output += `};\n`;

  // Write
  fs.writeFileSync(OUTPUT, output, "utf-8");
  console.log(`\nGenerated: ${path.relative(ROOT, OUTPUT)}`);
  console.log(`Components: ${components.length}`);
}

generate();
