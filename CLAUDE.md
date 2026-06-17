# soft-kit — Project Guide for Claude

This file is the source of truth for working in this repo. When asked to **create a
component**, follow the "Adding a new component" runbook below exactly — do not
re-explore the project structure.

## What this project is

A **shadcn-style component system**: users run a CLI that **copies component source
code into their project** (they own the code; there is no runtime library dependency).

Two packages:

| Path | npm name | Role |
|------|----------|------|
| repo root | `@soft-kit/core` | Optional installable React library. Rarely used. |
| [`cli/`](cli/) | `soft-kit` | **The product.** `npx soft-kit add <name>` copies components into a user's project. |

## How the pipeline works

1. Components are authored in [`src/components/<name>/`](src/components/) as normal split files.
2. [`scripts/generate-registry.js`](scripts/generate-registry.js) reads every component
   folder, **merges** its `.ts`/`.tsx` files into a single `ui/<name>.tsx` string,
   rewrites `../../lib/*` imports to `{{ALIAS}}/lib/*`, reads an optional `<name>.css`,
   and writes everything into [`cli/src/registry.ts`](cli/src/registry.ts) (auto-generated — never edit by hand).
3. The CLI ([`cli/src/index.ts`](cli/src/index.ts)) reads the registry and, on `add`,
   writes files into the user's project, replacing `{{ALIAS}}` with their alias (`@`).

In a user's project the CLI produces:
- `src/lib/cn.ts`, `src/lib/variants.ts` (shared helpers, written once)
- `src/components/ui/<name>.tsx` (the component)
- appends any component CSS to their global stylesheet (default `src/app/globals.css`)

## Styling conventions (IMPORTANT)

- **Plain Tailwind utility classes ONLY.** No CSS variables, no design tokens. There is
  no `tokens.css` — it was deliberately removed.
- **Always include `dark:` variants** for colors so dark mode works.
- Use the **`variants()`** helper (our mini-cva) for variant/size logic — see existing components.
- Use **`cn()`** to merge incoming `className` with the variant output.
- Color palette in use: `blue-*` (primary/links), `gray-*` (secondary/neutral/borders),
  `red-*` (destructive/error). Stay consistent with these.
- Focus ring convention: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400`.

## Component folder structure

Mirror the existing [`button`](src/components/button/) / [`input`](src/components/input/) layout:

```
src/components/<name>/
├── <name>.types.ts      # exports the Props interface
├── <name>.styles.ts     # exports variants() config(s); imports { variants } from "../../lib/variants"
├── <name>.tsx           # the component; imports { cn } from "../../lib/cn", + styles + types
├── index.ts             # re-exports component + types
├── component.json       # metadata (see below)
└── <name>.css           # OPTIONAL — only if Tailwind can't express something
```

Authoring rules the generator relies on:
- Source files import shared utils with **relative** paths: `import { cn } from "../../lib/cn"`,
  `import { variants } from "../../lib/variants"`. The generator rewrites these.
- Cross-file imports inside the component use `./` (e.g. `./<name>.styles`); these get
  inlined by the merge, so don't worry about them in the output.
- Merge order is types → styles → component. `index.ts` is excluded from the merge.
- The component uses `forwardRef`, sets `displayName`, and `export { Component }` at the end.
- **`"use client";`**: if any source file needs it (hooks, state, context, event handlers —
  e.g. [sidebar](src/components/sidebar/)), just put the directive at the top of that file.
  The generator detects it, strips it from every file, and hoists a single `"use client";`
  to the very top of the merged output (required for Next.js App Router).
- **Framework-agnostic only.** Do NOT import `next/*`, `react-router`, or `radix-ui` in a
  component — not every consumer has them. For links, accept a `renderLink` prop that
  defaults to a plain `<a>` (see sidebar). For "active route", accept an `activePath` prop.
  Only reach for a real dependency (like `lucide-react`) when there's no reasonable
  alternative, and then declare it in `npmDependencies`.
- **Dependencies install automatically.** Whatever you list in `component.json`
  `npmDependencies` is `npm install`-ed when the user runs `add`/`update` — so a user who
  doesn't have `lucide-react` won't hit a missing-module error. Don't add deps to `init`.

### component.json

```json
{
  "name": "<name>",
  "description": "Short one-line description",
  "registryDependencies": [],
  "npmDependencies": ["clsx", "tailwind-merge"]
}
```
- `registryDependencies`: other soft-kit components this one needs (by name).
- `npmDependencies`: npm packages the component imports. `clsx` + `tailwind-merge` are
  the baseline (cn uses them). Add more only if the component imports them.

### Optional `<name>.css` (per-component CSS)

Only add this if a component needs CSS that Tailwind utilities can't express (e.g. the
[input autofill / number-spinner reset](src/components/input/input.css)). If present, the
CLI appends it to the user's global stylesheet, wrapped in
`/* soft-kit:<name> start */ … /* soft-kit:<name> end */` markers (idempotent).
Target a hook class named `sk-<name>` that the component puts on the relevant element.
**Components that don't need CSS must NOT have this file** — button has none.

## Runbook: Adding a new component

When asked to create component `<name>`:

1. Create `src/components/<name>/` with `<name>.types.ts`, `<name>.styles.ts`,
   `<name>.tsx`, `index.ts`, `component.json` — following the structure and styling
   conventions above. Add `<name>.css` + an `sk-<name>` hook class only if truly needed.
2. Add exports to [`src/index.ts`](src/index.ts) (for the `@soft-kit/core` library):
   ```ts
   export { Name } from "./components/<name>";
   export type { NameProps } from "./components/<name>";
   ```
3. Add the per-component build entry in [`tsup.config.ts`](tsup.config.ts) `entry`:
   ```ts
   "components/<name>/index": "src/components/<name>/index.ts",
   ```
4. Add the subpath export in [`package.json`](package.json) `exports` (mirror `./button`).
5. Regenerate the registry: `node scripts/generate-registry.js`
   (the new component must appear in the output list).
6. Build + verify the CLI:
   ```bash
   cd cli && npm run build
   node dist/index.js add <name>   # in a throwaway dir, after init, to sanity-check
   ```
7. Typecheck the library: `npm run typecheck` (from root).

## CLI commands (what the published `soft-kit` tool does for users)

| Command | Effect |
|---------|--------|
| `npx soft-kit init` | Writes `soft-kit.config.json` + `src/lib/cn.ts` + `src/lib/variants.ts`. **No** tokens file; **no** `lib` inside `components`. `--css <path>` sets the global stylesheet (default `src/app/globals.css`). |
| `npx soft-kit add <name…>` | Copies the component into `src/components/ui/`, installs its `npmDependencies`, and appends its CSS to the global stylesheet (skips if already present). |
| `npx soft-kit update <name…>` | Re-fetches installed component(s), **overwrites** their files, **replaces** their CSS block in place (no duplication), and re-installs deps. Warns if a name isn't installed. |
| `npx soft-kit update all` | Updates every soft-kit component currently present in the project. |
| `npx soft-kit list` | Lists available components. |

## Build / test commands

```bash
node scripts/generate-registry.js   # regenerate cli/src/registry.ts from src/components
npm run build:cli                   # registry + build the CLI (from root)
npm run typecheck                   # typecheck @soft-kit/core
cd cli && npm run build             # build just the CLI
```

End-to-end manual test of the CLI:
```bash
mkdir /tmp/sk && cd /tmp/sk && npm init -y
node <repo>/cli/dist/index.js init -y
node <repo>/cli/dist/index.js add <name>
```

## Releasing (publishing to npm)

The published package is **`soft-kit`** (unscoped, in `cli/`). Bump the version, then publish.

```bash
# 1. commit work FIRST so the tree is clean (npm version needs this to auto-commit)
git add . && git commit -m "..."
# 2. bump
cd cli && npm version patch|minor|major
# 3. publish — manual:
npm publish
#    OR via CI: push to main (GitHub Action publishes if version is new)
cd .. && git push origin main --follow-tags
```

Notes:
- npm refuses to republish an existing version — always bump.
- CI auth uses the `NPM_TOKEN` repo secret; it must be a **Granular token with
  "All packages" + Read and write** (a scope-only `@soft-kit` token can't publish the
  unscoped `soft-kit` and fails with 404).
- `bin` paths in `cli/package.json` must NOT have a `./` prefix (npm 11 strips them).
