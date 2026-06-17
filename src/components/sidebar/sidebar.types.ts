import type { ComponentType, ReactNode } from "react";

export interface SidebarItem {
  /** Label shown next to the icon. */
  name: string;
  /** Icon component, e.g. any lucide-react icon. */
  icon: ComponentType<{ className?: string }>;
  /** Link target. Omit for a group that only toggles its children. */
  href?: string;
  /** Optional badge/count. Use the string "!" for an attention marker. */
  badge?: string | number;
  /** Nested items render as a collapsible group. */
  children?: SidebarItem[];
}

export interface SidebarProps {
  /** Main navigation items. */
  items: SidebarItem[];
  /** Items pinned to the bottom (settings, help, profile, …). */
  footerItems?: SidebarItem[];
  /** Current route path for active highlighting (e.g. Next's usePathname()). */
  activePath?: string;
  /** Brand / workspace label in the header. */
  title?: string;
  /** Render collapsed on first paint. */
  defaultCollapsed?: boolean;
  /** Show the search box (visual only — wire it up yourself). */
  showSearch?: boolean;
  /**
   * Custom link renderer — plug in next/link or your router's Link.
   * Defaults to a plain <a>.
   * @example renderLink={({ href, className, children }) => <Link href={href} className={className}>{children}</Link>}
   */
  renderLink?: (props: {
    href: string;
    className?: string;
    children: ReactNode;
  }) => ReactNode;
  /** Extra classes for the <aside>. */
  className?: string;
}
