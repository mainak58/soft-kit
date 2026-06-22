"use client";

import { createContext, forwardRef, useContext, useState } from "react";
import {
  ChevronRight,
  ChevronsUpDown,
  Command,
  Moon,
  PanelLeft,
  PanelLeftClose,
  Search,
  Sun,
} from "lucide-react";
import { cn } from "../../lib/cn";
import {
  sidebarAside,
  sidebarRowBase,
  sidebarSearch,
  sidebarTooltip,
} from "./sidebar.styles";
import type { SidebarItem, SidebarProps } from "./sidebar.types";

type RenderLink = NonNullable<SidebarProps["renderLink"]>;

const defaultRenderLink: RenderLink = ({ href, className, children }) => (
  <a href={href} className={className}>
    {children}
  </a>
);

interface SidebarContextValue {
  collapsed: boolean;
  activePath: string;
  renderLink: RenderLink;
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  activePath: "",
  renderLink: defaultRenderLink,
});

const useSidebar = () => useContext(SidebarContext);

/** True when the item's href, or any descendant's href, matches the path. */
function subtreeHasActive(item: SidebarItem, activePath: string): boolean {
  if (
    item.href &&
    (activePath === item.href || activePath.startsWith(`${item.href}/`))
  ) {
    return true;
  }
  return item.children?.some((c) => subtreeHasActive(c, activePath)) ?? false;
}

interface NavItemProps {
  item: SidebarItem;
  depth?: number;
}

function SidebarNavItem({ item, depth = 0 }: NavItemProps) {
  const { collapsed, activePath, renderLink } = useSidebar();
  const Icon = item.icon;
  const hasChildren = !!item.children?.length;

  const isActive =
    !!item.href &&
    (activePath === item.href || activePath.startsWith(`${item.href}/`));
  const childActive = hasChildren && subtreeHasActive(item, activePath);

  // Open groups that contain the active route, and top-level groups by default.
  const [open, setOpen] = useState(
    () => subtreeHasActive(item, activePath) || (depth === 0 && hasChildren)
  );

  const toggle = () => {
    if (hasChildren) setOpen((prev) => !prev);
  };

  const rowClass = cn(
    sidebarRowBase,
    collapsed ? "justify-center px-2" : "px-2.5",
    isActive
      ? "bg-gray-100 font-medium text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-100"
      : childActive
        ? "text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
  );
  const indentStyle = collapsed ? undefined : { paddingLeft: depth * 16 + 10 };

  const iconEl = (
    <Icon className="size-[18px] shrink-0 transition-transform duration-200 ease-out group-hover/row:scale-110" />
  );

  const labelEl = (
    <span
      className={cn(
        // min-w-0 lets the label shrink to max-w-0 when collapsing.
        "min-w-0 overflow-hidden whitespace-nowrap transition-all duration-200 ease-out",
        collapsed ? "ml-0 max-w-0 opacity-0" : "ml-2.5 max-w-[170px] opacity-100"
      )}
    >
      {item.name}
    </span>
  );

  const leadingClass = cn(
    "flex min-w-0 items-center text-inherit",
    !collapsed && "flex-1"
  );
  const leading = item.href
    ? renderLink({ href: item.href, className: leadingClass, children: (
        <>
          {iconEl}
          {labelEl}
        </>
      ) })
    : (
      <span className={leadingClass}>
        {iconEl}
        {labelEl}
      </span>
    );

  const row = (
    <div
      className={rowClass}
      style={indentStyle}
      onClick={hasChildren ? toggle : undefined}
      role={hasChildren ? "button" : undefined}
      aria-expanded={hasChildren ? open : undefined}
      tabIndex={hasChildren && !item.href ? 0 : undefined}
      onKeyDown={(e) => {
        if (hasChildren && !item.href && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          toggle();
        }
      }}
    >
      {leading}

      {!collapsed && item.badge !== undefined && (
        <span
          className={cn(
            "ml-auto pl-1 text-xs tabular-nums transition-colors",
            item.badge === "!"
              ? "text-amber-500"
              : "text-gray-400 group-hover/row:text-gray-900 dark:group-hover/row:text-gray-100"
          )}
        >
          {item.badge}
        </span>
      )}

      {!collapsed && hasChildren && (
        <ChevronRight
          className={cn(
            "size-4 shrink-0 text-gray-400 transition-transform duration-300 ease-out",
            item.badge === undefined && "ml-auto",
            open && "rotate-90"
          )}
        />
      )}
    </div>
  );

  return (
    <li>
      {collapsed ? (
        <div className="group/tip relative">
          {row}
          <span className={sidebarTooltip}>{item.name}</span>
        </div>
      ) : (
        row
      )}

      {/* Smooth expand/collapse via animated grid rows + opacity. */}
      {hasChildren && !collapsed && (
        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <ul className="mt-0.5 space-y-0.5">
              {item.children!.map((child) => (
                <SidebarNavItem key={child.name} item={child} depth={depth + 1} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}

interface ThemeToggleProps {
  darkMode: boolean;
  onDarkModeChange?: (next: boolean) => void;
}

function ThemeToggle({ darkMode, onDarkModeChange }: ThemeToggleProps) {
  const { collapsed } = useSidebar();
  const Icon = darkMode ? Sun : Moon;
  const label = darkMode ? "Light mode" : "Dark mode";
  const toggle = () => onDarkModeChange?.(!darkMode);

  const baseClass =
    "flex w-full cursor-pointer items-center rounded-lg border border-gray-200 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 active:scale-[0.97] dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100";

  if (collapsed) {
    return (
      <div className="group/tip relative">
        <button
          type="button"
          aria-label={label}
          onClick={toggle}
          className={cn(baseClass, "justify-center py-2")}
        >
          <Icon className="size-[18px]" />
        </button>
        <span className={sidebarTooltip}>{label}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={toggle}
      className={cn(baseClass, "gap-2.5 px-3 py-2 text-sm")}
    >
      <Icon className="size-[18px] shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items,
      footerItems = [],
      activePath = "",
      title = "Workspace",
      defaultCollapsed = false,
      showSearch = true,
      darkMode,
      onDarkModeChange,
      renderLink = defaultRenderLink,
      className,
    },
    ref
  ) => {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);

    return (
      <SidebarContext.Provider value={{ collapsed, activePath, renderLink }}>
        <aside
          ref={ref}
          data-collapsed={collapsed}
          className={cn(sidebarAside, collapsed ? "w-[68px]" : "w-64", className)}
        >
          {/* Header */}
          <div
            className={cn(
              "flex h-14 items-center px-3",
              collapsed ? "justify-center" : "justify-between"
            )}
          >
            {!collapsed && (
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-sm font-semibold transition-colors duration-200 hover:bg-gray-100 active:scale-[0.97] dark:hover:bg-gray-800"
              >
                {title}
                <ChevronsUpDown className="size-3.5 text-gray-400" />
              </button>
            )}
            <button
              type="button"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed((prev) => !prev)}
              className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 active:scale-90 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              {collapsed ? (
                <PanelLeft className="size-[18px]" />
              ) : (
                <PanelLeftClose className="size-[18px]" />
              )}
            </button>
          </div>

          {/* Search */}
          {showSearch && (
            <div className="px-3 pb-2">
              {collapsed ? (
                <button
                  type="button"
                  aria-label="Search"
                  className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-gray-200 py-2 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 active:scale-95 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                >
                  <Search className="size-[18px]" />
                </button>
              ) : (
                <div className={sidebarSearch}>
                  <Search className="size-4 shrink-0 text-gray-400" />
                  <input
                    placeholder="Search"
                    className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
                  />
                  <kbd className="flex shrink-0 items-center gap-0.5 rounded border border-gray-200 bg-gray-50 px-1 text-[10px] text-gray-400 dark:border-gray-800 dark:bg-gray-900">
                    <Command className="size-2.5" />K
                  </kbd>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden px-1 py-2">
            <ul className="space-y-0.5">
              {items.map((item) => (
                <SidebarNavItem key={item.name} item={item} />
              ))}
            </ul>
          </nav>

          {/* Footer */}
          {footerItems.length > 0 && (
            <div className="border-t border-gray-200 px-1 py-3 dark:border-gray-800">
              <ul className="space-y-0.5">
                {footerItems.map((item) => (
                  <SidebarNavItem key={item.name} item={item} />
                ))}
              </ul>
            </div>
          )}

          {/* Theme toggle — pinned to the bottom, only when darkMode is provided */}
          {darkMode !== undefined && (
            <div className="mt-auto border-t border-gray-200 px-3 py-3 dark:border-gray-800">
              <ThemeToggle
                darkMode={darkMode}
                onDarkModeChange={onDarkModeChange}
              />
            </div>
          )}
        </aside>
      </SidebarContext.Provider>
    );
  }
);

Sidebar.displayName = "Sidebar";

export { Sidebar, useSidebar };
