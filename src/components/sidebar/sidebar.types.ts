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
   * Current dark-mode state. When provided (even `false`), a light/dark toggle
   * button renders pinned to the bottom of the sidebar. Omit the prop entirely
   * to hide the button.
   */
  darkMode?: boolean;
  /**
   * Called with the next dark-mode state when the toggle is pressed.
   * Wire this to your theme state (e.g. toggle the `dark` class on <html>).
   * @example onDarkModeChange={(next) => document.documentElement.classList.toggle("dark", next)}
   */
  onDarkModeChange?: (next: boolean) => void;
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
