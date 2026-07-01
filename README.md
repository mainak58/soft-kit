# soft-kit

A **shadcn-style component system** for React + Tailwind. A CLI copies component
source code straight into your project — you own the code, with no runtime library
dependency to lock you in.

- 📦 npm: [`soft-kit`](https://www.npmjs.com/package/soft-kit)
- 🐙 GitHub: [mainak58/soft-kit](https://github.com/mainak58/soft-kit)

## Requirements

Your project needs:

- **React 18+**
- **Tailwind CSS** configured (components are Tailwind utility classes; make sure your
  `content` globs include `./src/**/*.{ts,tsx}`)
- An **`@` path alias** pointing to `src`, in `tsconfig.json`:
  ```json
  { "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./src/*"] } } }
  ```

## Install & use

There's **nothing to `npm install`** — `npx` runs the CLI on demand.

```bash
# 1. One-time setup: writes soft-kit.config.json + src/lib/cn.ts + src/lib/variants.ts
npx soft-kit init

# 2. Add components — copied into src/components/ui/
npx soft-kit add button
npx soft-kit add input
npx soft-kit add sidebar
npx soft-kit add button input        # several at once
```

A component's npm dependencies (e.g. `lucide-react` for the sidebar) are installed
automatically, and any component-specific CSS is appended to your global stylesheet
(default `src/app/globals.css`; override with `npx soft-kit init --css <path>`).

### Use a component

```tsx
import { Button } from "@/components/ui/button";

export default function Page() {
  return <Button variant="primary">Click me</Button>;
}
```

### Update components later

```bash
npx soft-kit update sidebar    # re-fetch one (overwrites your local copy)
npx soft-kit update all        # update every installed soft-kit component
```

### List what's available

```bash
npx soft-kit list
```

## Components

Each component has its own reference page with props, examples, and notes:

| Component | Description | Docs |
|-----------|-------------|------|
| Button | Variants, sizes, and a loading state | [How to use →](docs/button.md) |
| Input | Sizes, error state, start/end adornments | [How to use →](docs/input.md) |
| Checkbox | Optional label, sizes, error state | [How to use →](docs/checkbox.md) |
| Field | Label + required marker + hint/error wrapper | [How to use →](docs/field.md) |
| Dropdown | Searchable select, multi-select, apply/cancel | [How to use →](docs/dropdown.md) |
| Sidebar | Collapsible nav with nested groups, badges, tooltips | [How to use →](docs/sidebar.md) |
| TabSwitcher | Accessible tabs, keyboard nav, animated indicator | [How to use →](docs/tab-switcher.md) |
| Search | Generic async search box, debounce, request cancellation | [How to use →](docs/search.md) |

Dark mode works out of the box via Tailwind `dark:` variants — toggle with a `.dark`
class (or `data-theme="dark"`) on a parent element.

## CLI commands

| Command | What it does |
|---------|--------------|
| `npx soft-kit init` | Sets up config + shared helpers. `--alias`, `--dir`, `--css` flags available. |
| `npx soft-kit add <name…>` | Copies component(s) in, installs deps, appends CSS. `-o` to overwrite. |
| `npx soft-kit update <name…>` | Re-fetches installed component(s) and overwrites them. |
| `npx soft-kit update all` | Updates every installed soft-kit component. |
| `npx soft-kit list` | Lists available components. |

## Development (contributing to soft-kit itself)

```bash
git clone https://github.com/mainak58/soft-kit.git
cd soft-kit
npm install

node scripts/generate-registry.js   # rebuild the registry from src/components
npm run build:cli                    # registry + build the CLI
npm run typecheck                    # typecheck the @soft-kit/core library
```

Components are authored in `src/components/<name>/`. See [CLAUDE.md](CLAUDE.md) for the
full component-authoring runbook and conventions.

## Issues

Found a bug or have a feature request? Please open an issue:

👉 **https://github.com/mainak58/soft-kit/issues**

When reporting a bug, include:
- the command you ran (e.g. `npx soft-kit add sidebar`)
- what you expected vs. what happened
- your framework (Next.js / Vite / …), Node version, and package manager

## License

MIT © [mainak58](https://github.com/mainak58)
