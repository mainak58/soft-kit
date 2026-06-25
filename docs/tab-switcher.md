# TabSwitcher

Accessible, animated tabs for React. Supports controlled and uncontrolled modes,
full keyboard navigation (WAI-ARIA tab pattern), a sliding active indicator, light/dark
themes, and an optional fade-in for panel content.

## Install

```bash
npx soft-kit add tab-switcher
```

This copies `src/components/ui/tab-switcher.tsx` into your project and appends the
panel animation to your global stylesheet (default `src/app/globals.css`). No extra
npm dependencies beyond the soft-kit baseline (`clsx`, `tailwind-merge`).

## Import

```tsx
import { TabSwitcher } from "@/components/ui/tab-switcher";
import type { TabItem } from "@/components/ui/tab-switcher";
```

## Quick start (uncontrolled)

Pass `tabs`, set a `defaultValue`, and let the component manage its own active state.

```tsx
<TabSwitcher
  aria-label="Account sections"
  defaultValue="overview"
  onChange={(id) => console.log("active:", id)}
  tabs={[
    { id: "overview", label: "Overview", content: <p>Overview content</p> },
    { id: "analytics", label: "Analytics", content: <p>Analytics content</p> },
    { id: "settings", label: "Settings", content: <p>Settings content</p> },
  ]}
/>
```

## Controlled

Own the state yourself by passing `value` + `onChange`. Useful when the active tab is
driven by the URL, a store, or another component.

```tsx
const [tab, setTab] = useState("overview");

<TabSwitcher
  value={tab}
  onChange={setTab}
  tabs={[
    { id: "overview", label: "Overview" },
    { id: "analytics", label: "Analytics" },
    { id: "settings", label: "Settings" },
  ]}
/>
// Render content yourself based on `tab`, or pass it via tabs[].content.
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `TabItem[]` | — | **Required.** The tabs to render. |
| `value` | `string` | — | Controlled active tab id. Pass with `onChange`. |
| `defaultValue` | `string` | first enabled tab | Initial active tab (uncontrolled). |
| `onChange` | `(id: string) => void` | — | Called with the new tab id on every change. |
| `variant` | `"underline" \| "pill"` | `"underline"` | Indicator style. |
| `fitted` | `boolean` | `false` | Stretch tabs to fill the width evenly. |
| `aria-label` | `string` | — | Accessible name for the tab list (recommended). |
| `className` | `string` | — | Extra classes for the root wrapper. |

### `TabItem`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique, stable id. |
| `label` | `ReactNode` | Tab label (text, or icon + text). |
| `content` | `ReactNode?` | Panel content shown when active. Omit if you render content yourself. |
| `disabled` | `boolean?` | Make the tab unselectable. |

## Variants

```tsx
<TabSwitcher variant="underline" tabs={tabs} defaultValue="a" />  {/* sliding bar */}
<TabSwitcher variant="pill"      tabs={tabs} defaultValue="a" />  {/* sliding chip */}
<TabSwitcher fitted              tabs={tabs} defaultValue="a" />  {/* full-width, even */}
```

## Accessibility

Implements the [WAI-ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/):

- `role="tablist"` / `role="tab"` / `role="tabpanel"` with `aria-selected`,
  `aria-controls`, and `aria-labelledby` wired up.
- **Roving tabindex** — only the active tab is in the tab order; focus moves between
  tabs with arrow keys.
- **Keyboard**: `←/→` (and `↑/↓`) move and activate; `Home`/`End` jump to first/last;
  `Enter`/`Space` activate the focused tab. Disabled tabs are skipped.
- Always pass `aria-label` (or label the region yourself) so screen readers announce
  the tab list's purpose.

## Theming & animation

- Colors are plain Tailwind utilities with `dark:` variants — dark mode works when a
  `.dark` class (or `data-theme="dark"`) is on a parent.
- The active indicator slides via a CSS transform transition.
- Panel content fades in using the `sk-tab-panel` rule appended to your global
  stylesheet; it's disabled automatically under `prefers-reduced-motion`.

## Notes

- In controlled mode you can omit `tabs[].content` and render the body yourself.
- The component is a client component (`"use client"`) because it uses state and
  effects — safe to import directly in the Next.js App Router.
