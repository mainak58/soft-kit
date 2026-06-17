# soft-kit

A shadcn-style CLI that copies framework-agnostic UI components straight into your project. You own the code — no runtime dependency on a component library.

## Usage

Initialize soft-kit in your project (creates `soft-kit.config.json`, shared `lib/` utilities and design tokens, installs `clsx` + `tailwind-merge`):

```bash
npx soft-kit init
```

Add components:

```bash
npx soft-kit add button
npx soft-kit add input
npx soft-kit add sidebar
npx soft-kit add button input   # multiple at once
```

Each component's npm dependencies (e.g. `lucide-react` for the sidebar) are installed
automatically, so you won't hit missing-module errors.

Update components after a new release:

```bash
npx soft-kit update sidebar     # re-fetch one component (overwrites your copy)
npx soft-kit update all         # update every installed soft-kit component
```

List everything available:

```bash
npx soft-kit list
```

## Options

`init`:
- `-a, --alias <alias>` — import alias (default `@`)
- `-d, --dir <dir>` — components directory (default `src/components`)
- `-y, --yes` — skip prompts

`add`:
- `-o, --overwrite` — overwrite existing files

`update`:
- accepts one or more component names, or `all`

## How it works

Components are written into your project (under `src/components/ui/` by default), import from your local `lib/cn` and `lib/variants`, and pull all colors/sizes from CSS variables in `tokens/tokens.css`. Theme by overriding those variables; switch dark mode with `data-theme="dark"` or a `.dark` class.

## License

MIT
