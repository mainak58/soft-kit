# Input

A text input with sizes, error state, and start/end adornments.

## Install

```bash
npx soft-kit add input
```

Appends a small CSS block to your global stylesheet (autofill reset + number-spinner
removal), targeting the `sk-input` class on the field.

## Import

```tsx
import { Input } from "@/components/ui/input";
```

## Usage

```tsx
<Input placeholder="Email" />
<Input size="sm" placeholder="Small" />
<Input size="lg" placeholder="Large" />
<Input error placeholder="Has error" />
<Input startAdornment={<SearchIcon />} placeholder="Search" />
<Input endAdornment={<span>.com</span>} placeholder="yoursite" />
```

## Props

Extends all native `<input>` props (except `size`), plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size preset. |
| `error` | `boolean` | `false` | Error styling + `aria-invalid`. |
| `startAdornment` | `ReactNode` | — | Content before the field (icon, prefix). |
| `endAdornment` | `ReactNode` | — | Content after the field (icon, clear button). |

## Notes

- Plain Tailwind + `dark:` variants.
- Forwards `ref` to the underlying `<input>`.
