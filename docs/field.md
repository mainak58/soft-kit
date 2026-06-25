# Field

A form-field wrapper that adds a label, required marker, and hint/error text around any
control (Input, Dropdown, Checkbox, etc.).

## Install

```bash
npx soft-kit add field
```

## Import

```tsx
import { Field } from "@/components/ui/field";
```

## Usage

```tsx
<Field label="Email" htmlFor="email" required hint="We'll never share it.">
  <Input id="email" type="email" placeholder="you@example.com" />
</Field>

<Field label="Password" htmlFor="pw" error="Must be at least 8 characters">
  <Input id="pw" type="password" error />
</Field>
```

## Props

Extends all native `<div>` props, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | — | Field label. |
| `htmlFor` | `string` | — | id of the control the label points to. |
| `required` | `boolean` | `false` | Renders a red asterisk after the label. |
| `hint` | `ReactNode` | — | Helper text beneath the control. |
| `error` | `ReactNode` | — | Error text beneath the control (replaces `hint`). |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Sizing for label + helper text. |

## Notes

- Pair `htmlFor` with the control's `id` so the label is correctly associated.
- `error` takes visual priority over `hint` when both are set.
