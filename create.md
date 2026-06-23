# Dropdown Component — Build Prompt

## Overview

Build a reusable, accessible `<Dropdown />` component (React + Tailwind CSS) that supports single select, multi-select, search filtering, and deferred apply/cancel actions.

---

## Data Shape

The component accepts an array of options, each with a `label` (display text) and `value` (unique identifier):

```ts
type Option = {
  label: string;
  value: string | number;
};

// Example
const options: Option[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];
```

---

## Props

| Prop          | Type                       | Default       | Description                                                                                                                                                                                              |
| ------------- | -------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options`     | `Option[]`                 | **required**  | List of selectable items                                                                                                                                                                                 |
| `value`       | `string \| string[]`       | `undefined`   | Controlled selected value(s)                                                                                                                                                                             |
| `onChange`    | `(value) => void`          | `undefined`   | Fires on every selection (immediate mode)                                                                                                                                                                |
| `placeholder` | `string`                   | `"Select..."` | Text shown when nothing is selected                                                                                                                                                                      |
| `showSearch`  | `boolean`                  | `true`        | Show/hide the search input inside the dropdown. When `false`, the search field is completely removed from the DOM — not just hidden.                                                                     |
| `multiSelect` | `boolean`                  | `false`       | Enable multi-select with checkboxes                                                                                                                                                                      |
| `onApply`     | `(selectedValues) => void` | `undefined`   | When provided, show **Apply** and **Cancel** buttons and defer the callback until the user clicks Apply                                                                                                  |
| `className`   | `string`                   | `""`          | Tailwind classes that **merge with and override** the component's internal classes (e.g., passing `m-4` replaces the internal `m-2`). Use a utility like `tailwind-merge` or `clsx` with override logic. |
| `disabled`    | `boolean`                  | `false`       | Disables the entire dropdown                                                                                                                                                                             |

---

## Functional Requirements

### 1. Open / Close Behaviour

- Clicking the trigger button toggles the dropdown open/closed.
- **Clicking outside** the dropdown (trigger + panel) **closes** it.
  - Use a `mousedown` listener on `document` and check with a `ref` whether the click target is inside the component.
- Pressing `Escape` also closes the dropdown.

### 2. Search / Filter

- When `showSearch` is `true` (default), render a text input at the top of the dropdown panel.
- When `showSearch` is `false`, do **not** render the search input at all.
- Filtering is **case-insensitive** and matches against the `label` field only.
- As the user types, the visible option list updates in real time; options whose `label` does not contain the search string are hidden.
- Clearing the search field restores the full list.
- When the dropdown opens, auto-focus the search input (if present).

### 3. Single Select (default)

- Only one option can be selected at a time.
- Clicking an option **selects it and immediately closes the dropdown**.
- The trigger displays the selected option's `label`.
- If `onApply` is **not** provided, fire `onChange` on every click.

### 4. Multi-Select (`multiSelect={true}`)

- Each option renders with a checkbox.
- Clicking an option **toggles its selected state** without closing the dropdown — the user continues picking.
- The trigger displays a summary (e.g., `"3 selected"` or a comma-separated list up to a max width).
- If `onApply` is **not** provided, fire `onChange` after every toggle.

### 5. Apply / Cancel Mode (`onApply` provided)

- When `onApply` is passed as a prop, render two buttons at the **bottom** of the dropdown panel:
  - **Apply** — calls `onApply(selectedValues)` with the current selection, then closes the dropdown.
  - **Cancel** — discards any changes made since the dropdown was opened and closes the dropdown (revert to the last applied state).
- In this mode, selections are staged internally and **not** committed until Apply is clicked.
- This mode works with both single and multi-select.

### 6. Class Name Merging (`className`)

- The component has sensible default Tailwind classes (e.g., `m-2`, `rounded-md`, `border`).
- When the consumer passes a `className` prop, **conflicting utilities must be overridden, not duplicated**.
  - Example: internal `m-2` + prop `m-4` → resolved to `m-4`.
- Use [`tailwind-merge`](https://github.com/dcastil/tailwind-merge) (recommended) or a manual merge strategy so that the last class wins for each utility group.

---

## Behavioural Summary

| Scenario                      | On option click              | Dropdown stays open? | Buttons shown? |
| ----------------------------- | ---------------------------- | -------------------- | -------------- |
| Single select, no `onApply`   | `onChange` fires immediately | **No** — closes      | None           |
| Single select, with `onApply` | Selection staged internally  | **Yes** — stays open | Apply / Cancel |
| Multi-select, no `onApply`    | `onChange` fires immediately | **Yes** — stays open | None           |
| Multi-select, with `onApply`  | Selection staged internally  | **Yes** — stays open | Apply / Cancel |

---

## Edge Cases to Handle

- **Empty `options` array** — show a "No options" message inside the panel.
- **Search with no results** — show a "No results found" message.
- **Very long labels** — truncate with ellipsis; full text visible on hover (title attribute).
- **Rapid open/close** — debounce or guard against race conditions with outside-click detection.
- **Pre-selected values** — if `value` is provided on mount, reflect it immediately in the trigger and option list.

---

## Suggested File Structure

```
Dropdown/
├── Dropdown.tsx          # Main component
├── DropdownOption.tsx    # Individual option row (checkbox in multi-select mode)
├── SearchInput.tsx       # Conditional search field
├── ActionButtons.tsx     # Apply / Cancel footer
├── useClickOutside.ts   # Custom hook for outside-click detection
├── types.ts             # Option type, prop types
└── index.ts             # Barrel export
```

---

## Example Usage

```tsx
{
  /* Minimal — single select, search enabled */
}
<Dropdown options={fruits} onChange={(val) => console.log(val)} />;

{
  /* Multi-select with search hidden */
}
<Dropdown
  options={fruits}
  multiSelect
  showSearch={false}
  onChange={(vals) => console.log(vals)}
/>;

{
  /* Deferred apply with class override */
}
<Dropdown
  options={fruits}
  multiSelect
  onApply={(vals) => saveToDB(vals)}
  className="m-4 w-64"
/>;
```
