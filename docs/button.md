# Button

A versatile button with variants, sizes, and a loading state.

## Install

```bash
npx soft-kit add button
```

## Import

```tsx
import { Button } from "@/components/ui/button";
```

## Usage

```tsx
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon" aria-label="Settings"><GearIcon /></Button>

<Button loading>Saving…</Button>
```

## Props

Extends all native `<button>` props, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "destructive" \| "outline" \| "ghost" \| "link"` | `"primary"` | Visual style. |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | `"md"` | Size preset. |
| `loading` | `boolean` | `false` | Shows a spinner and disables interaction. |
| `className` | `string` | — | Extra classes (merged with `tailwind-merge`). |

## Notes

- Plain Tailwind + `dark:` variants; no extra CSS or dependencies.
- Forwards `ref` to the underlying `<button>`.
