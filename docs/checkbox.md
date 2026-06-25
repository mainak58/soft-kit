# Checkbox

A checkbox with an optional label, sizes, and an error state.

## Install

```bash
npx soft-kit add checkbox
```

## Import

```tsx
import { Checkbox } from "@/components/ui/checkbox";
```

## Usage

```tsx
<Checkbox label="Accept terms" />
<Checkbox label="Small" size="sm" />
<Checkbox label="Large" size="lg" />
<Checkbox label="Required" error />
<Checkbox label="Controlled" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
```

## Props

Extends all native `<input>` props (except `size` and `type`), plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | — | Label rendered next to the checkbox. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size preset. |
| `error` | `boolean` | `false` | Error styling. |

## Notes

- Plain Tailwind + `dark:` variants.
- Forwards `ref` to the underlying `<input type="checkbox">`.
