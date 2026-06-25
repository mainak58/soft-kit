# Dropdown

An accessible select with optional search, multi-select, and a deferred apply/cancel mode.

## Install

```bash
npx soft-kit add dropdown
```

Appends its CSS to your global stylesheet.

## Import

```tsx
import { Dropdown } from "@/components/ui/dropdown";
import type { DropdownOption } from "@/components/ui/dropdown";
```

## Usage

```tsx
const options: DropdownOption[] = [
  { label: "Overview", value: "overview" },
  { label: "Analytics", value: "analytics" },
  { label: "Settings", value: "settings", disabled: true },
];

// Uncontrolled, single-select
<Dropdown options={options} placeholder="Choose one" onChange={(v) => console.log(v)} />

// Multi-select with search
<Dropdown options={options} multiSelect showSearch onChange={(vals) => console.log(vals)} />

// Deferred commit (Apply / Cancel)
<Dropdown options={options} multiSelect onApply={(vals) => console.log(vals)} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `DropdownOption[]` | — | **Required.** Selectable items. |
| `value` | `OptionValue \| OptionValue[]` | — | Controlled selection (array for multi-select). |
| `onChange` | `(value) => void` | — | Fires on every change (immediate mode). |
| `onApply` | `(value) => void` | — | Switches to Apply/Cancel; commit deferred until Apply. |
| `placeholder` | `string` | — | Text shown when nothing is selected. |
| `showSearch` | `boolean` | `false` | Show the search field in the panel. |
| `multiSelect` | `boolean` | `false` | Enable multi-select with checkboxes. |
| `disabled` | `boolean` | `false` | Disable the whole control. |
| `className` | `string` | — | Extra classes for the root (merged with `tailwind-merge`). |

### `DropdownOption`

| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | Shown in the list and on the trigger. |
| `value` | `string \| number` | Unique id passed to `onChange`/`onApply`. |
| `disabled` | `boolean?` | Render the option unselectable. |

## Notes

- `onChange` is ignored while `onApply` is set (deferred mode owns the commit).
- Plain Tailwind + `dark:` variants.
