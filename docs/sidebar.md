# Sidebar

A collapsible navigation sidebar with nested groups, badges, tooltips (when collapsed),
and an optional dark-mode toggle. Framework-agnostic — bring your own router via
`renderLink`.

## Install

```bash
npx soft-kit add sidebar
```

Installs `lucide-react` automatically (used for the chrome icons).

## Import

```tsx
import { Sidebar } from "@/components/ui/sidebar";
import type { SidebarItem } from "@/components/ui/sidebar";
```

## Usage

```tsx
import { Home, Inbox, Layers, LayoutDashboard } from "lucide-react";

const items: SidebarItem[] = [
  { name: "Home", icon: Home, href: "/home", badge: 2 },
  { name: "Inbox", icon: Inbox, href: "/inbox", badge: 12 },
  {
    name: "Workspace",
    icon: Layers,
    children: [
      { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard", badge: 9 },
    ],
  },
];

<Sidebar items={items} activePath={pathname} title="Acme Inc" />
```

### With Next.js links

```tsx
import Link from "next/link";
import { usePathname } from "next/navigation";

<Sidebar
  items={items}
  activePath={usePathname()}
  renderLink={({ href, className, children }) => (
    <Link href={href} className={className}>{children}</Link>
  )}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `SidebarItem[]` | — | **Required.** Main navigation items. |
| `footerItems` | `SidebarItem[]` | `[]` | Items pinned to the bottom. |
| `activePath` | `string` | `""` | Current route for active highlighting. |
| `title` | `string` | `"Workspace"` | Brand/workspace label in the header. |
| `defaultCollapsed` | `boolean` | `false` | Start collapsed. |
| `showSearch` | `boolean` | `true` | Show the search box (visual). |
| `darkMode` | `boolean` | — | When provided, renders a light/dark toggle button. |
| `onDarkModeChange` | `(next: boolean) => void` | — | Called with the next dark-mode state. |
| `renderLink` | `(props) => ReactNode` | `<a>` | Custom link renderer (Next.js / router). |
| `className` | `string` | — | Extra classes for the `<aside>`. |

### `SidebarItem`

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Label. |
| `icon` | `ComponentType<{ className?: string }>` | Icon component (e.g. lucide). |
| `href` | `string?` | Link target. Omit for a group that only toggles children. |
| `badge` | `string \| number?` | Count/marker (`"!"` shows an attention color). |
| `children` | `SidebarItem[]?` | Nested collapsible items. |

## Notes

- Client component (`"use client"`); pure Tailwind + `dark:` variants, no extra CSS.
- No `radix-ui` or `next/*` imports — collapsed tooltips are CSS-only.
