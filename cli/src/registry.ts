/**
 * AUTO-GENERATED — do not edit manually.
 * Run: node scripts/generate-registry.js
 */

export interface RegistryFile {
  path: string;
  content: string;
}

export interface RegistryComponent {
  name: string;
  description: string;
  files: RegistryFile[];
  registryDependencies: string[];
  npmDependencies: string[];
  /** CSS appended to the project's global stylesheet, or null if none. */
  css: string | null;
}

// ─── Shared utilities ───────────────────────────────────

export const LIB_FILES: Record<string, RegistryFile> = {
  cn: {
    path: "lib/cn.ts",
    content: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with Tailwind conflict resolution.
 * Falls back to plain clsx if tailwind-merge is ever removed.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
`,
  },
  variants: {
    path: "lib/variants.ts",
    content: `/**
 * Lightweight variant helper — our own mini "cva".
 * Zero external dependencies. If we ever drop Tailwind,
 * this still works because it's just string concatenation.
 */

type VariantValue = string;
type VariantMap = Record<string, Record<string, VariantValue>>;
type DefaultVariants<V extends VariantMap> = {
  [K in keyof V]?: keyof V[K];
};

interface VariantConfig<V extends VariantMap> {
  base: string;
  variants: V;
  defaultVariants?: DefaultVariants<V>;
  compoundVariants?: Array<
    Partial<{ [K in keyof V]: keyof V[K] }> & { className: string }
  >;
}

type VariantProps<V extends VariantMap> = {
  [K in keyof V]?: keyof V[K];
};

/**
 * Creates a variant resolver function.
 *
 * @example
 * const button = variants({
 *   base: "inline-flex items-center",
 *   variants: {
 *     variant: { primary: "bg-primary", secondary: "bg-secondary" },
 *     size: { sm: "h-8 px-3", md: "h-10 px-4" },
 *   },
 *   defaultVariants: { variant: "primary", size: "md" },
 * });
 *
 * button({ variant: "secondary", size: "sm" })
 * // => "inline-flex items-center bg-secondary h-8 px-3"
 */
export function variants<V extends VariantMap>(config: VariantConfig<V>) {
  const { base, variants: variantDefs, defaultVariants, compoundVariants } = config;

  return function resolve(props?: VariantProps<V>): string {
    const resolved = { ...defaultVariants, ...props } as Record<string, string>;
    const classes: string[] = [base];

    // Apply individual variants
    for (const [key, value] of Object.entries(resolved)) {
      if (value != null && variantDefs[key]?.[value]) {
        classes.push(variantDefs[key][value]);
      }
    }

    // Apply compound variants
    if (compoundVariants) {
      for (const compound of compoundVariants) {
        const { className, ...conditions } = compound;
        const matches = Object.entries(conditions).every(
          ([key, val]) => resolved[key] === val
        );
        if (matches && className) {
          classes.push(className);
        }
      }
    }

    return classes.filter(Boolean).join(" ");
  };
}

export type { VariantProps, VariantMap };
`,
  },
};

// ─── Component Registry ─────────────────────────────────

export const REGISTRY: Record<string, RegistryComponent> = {
  button: {
    name: "button",
    description: "A versatile button with variants, sizes, and loading state",
    files: [
      {
        path: "ui/button.tsx",
        content: `import { type ComponentPropsWithRef, forwardRef } from "react";
import { variants } from "{{ALIAS}}/lib/variants";
import { cn } from "{{ALIAS}}/lib/cn";

export interface ButtonProps extends ComponentPropsWithRef<"button"> {  /** Visual style variant */  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link";  /** Size preset */  size?: "sm" | "md" | "lg" | "icon";  /** Show loading spinner and disable interaction */  loading?: boolean;  /** Render as a child component (slot pattern) */  asChild?: boolean;}

/**
 * ============================================
 * Button Style Adapter
 * ============================================
 * The ONLY file that knows about Tailwind classes.
 * Colors are plain Tailwind utilities (with dark: variants
 * for dark mode) — no external CSS or design-token file needed.
 * ============================================
 */
export const buttonVariants = variants({
  base: [
    /* Layout */
    "inline-flex items-center justify-center gap-2",
    /* Typography */
    "font-medium whitespace-nowrap",
    /* Interaction */
    "cursor-pointer select-none",
    /* Transitions */
    "transition-colors duration-200 ease-in-out",
    /* Focus ring */
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400",
    /* Disabled */
    "disabled:pointer-events-none disabled:opacity-50",
    /* SVG icon sizing */
    "[&>svg]:pointer-events-none [&>svg]:shrink-0",
  ].join(" "),
  variants: {
    variant: {
      primary: [
        "bg-blue-600 text-white shadow-sm",
        "hover:bg-blue-700 active:bg-blue-800",
        "dark:bg-blue-500 dark:hover:bg-blue-400 dark:active:bg-blue-600",
      ].join(" "),
      secondary: [
        "bg-gray-100 text-gray-900",
        "hover:bg-gray-200 active:bg-gray-300",
        "dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600",
      ].join(" "),
      destructive: [
        "bg-red-600 text-white shadow-sm",
        "hover:bg-red-700 active:bg-red-800",
        "dark:bg-red-500 dark:hover:bg-red-400 dark:active:bg-red-600",
      ].join(" "),
      outline: [
        "border border-gray-300 bg-transparent text-gray-900",
        "hover:bg-gray-100",
        "dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800",
      ].join(" "),
      ghost: [
        "bg-transparent text-gray-900 hover:bg-gray-100",
        "dark:text-gray-100 dark:hover:bg-gray-800",
      ].join(" "),
      link: [
        "bg-transparent text-blue-600 underline-offset-4 hover:underline",
        "dark:text-blue-400",
      ].join(" "),
    },
    size: {
      sm: "h-8 px-3 text-xs rounded-md [&>svg]:size-3.5",
      md: "h-10 px-4 py-2 text-sm rounded-md [&>svg]:size-4",
      lg: "h-11 px-6 text-base rounded-lg [&>svg]:size-5",
      icon: "size-9 rounded-md [&>svg]:size-4",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

/** * ============================================ * Button Component * ============================================ * This file contains ZERO Tailwind knowledge. * All styling comes from button.styles.ts (the adapter). * * Button needs no external CSS — it's pure Tailwind utilities. * ============================================ */const Spinner = () => (  <svg    className="animate-spin"    xmlns="http://www.w3.org/2000/svg"    fill="none"    viewBox="0 0 24 24"    aria-hidden="true"  >    <circle      className="opacity-25"      cx="12"      cy="12"      r="10"      stroke="currentColor"      strokeWidth="4"    />    <path      className="opacity-75"      fill="currentColor"      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"    />  </svg>);const Button = forwardRef<HTMLButtonElement, ButtonProps>(  ({ className, variant, size, loading = false, disabled, children, ...props }, ref) => {    return (      <button        ref={ref}        className={cn(buttonVariants({ variant, size }), className)}        disabled={disabled || loading}        aria-busy={loading || undefined}        {...props}      >        {loading && <Spinner />}        {children}      </button>    );  });Button.displayName = "Button";export { Button, buttonVariants };
`,
      },
    ],
    registryDependencies: [],
    npmDependencies: ["clsx","tailwind-merge"],
    css: null,
  },
  input: {
    name: "input",
    description: "An input with sizes, error state, and start/end adornments",
    files: [
      {
        path: "ui/input.tsx",
        content: `import { type ComponentPropsWithRef, type ReactNode, forwardRef } from "react";
import { variants } from "{{ALIAS}}/lib/variants";
import { cn } from "{{ALIAS}}/lib/cn";

export interface InputProps  extends Omit<ComponentPropsWithRef<"input">, "size"> {  /** Size preset */  size?: "sm" | "md" | "lg";  /** Show error styling */  error?: boolean;  /** Start adornment (icon, prefix text, etc.) */  startAdornment?: ReactNode;  /** End adornment (icon, clear button, etc.) */  endAdornment?: ReactNode;}

/**
 * ============================================
 * Input Style Adapter
 * ============================================
 * The ONLY file that knows about Tailwind classes.
 * Colors are plain Tailwind utilities (with dark: variants).
 *
 * Unlike Button, Input also ships a small \`input.css\` for the
 * things Tailwind can't do cleanly (autofill + number spinners).
 * The CLI appends that CSS to your project's global stylesheet.
 * The field carries the \`sk-input\` hook class those rules target.
 * ============================================
 */
export const inputWrapperVariants = variants({
  base: [
    "flex items-center w-full",
    "border border-gray-300 bg-white text-gray-900",
    "transition-colors duration-200 ease-in-out",
    /* Focus-within so adornments sit inside the ring */
    "focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
    "hover:border-gray-400",
    /* Disabled */
    "has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-gray-50",
    /* Dark mode */
    "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100",
    "dark:hover:border-gray-500 dark:has-[:disabled]:bg-gray-800",
  ].join(" "),
  variants: {
    size: {
      sm: "h-8 px-2.5 rounded-md text-xs gap-1.5",
      md: "h-10 px-3 rounded-md text-sm gap-2",
      lg: "h-11 px-4 rounded-lg text-base gap-2.5",
    },
    error: {
      true: [
        "border-red-500",
        "focus-within:border-red-500 focus-within:ring-red-500",
        "dark:border-red-500",
      ].join(" "),
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    error: "false",
  },
});
export const inputFieldStyles = [
  /* sk-input is the hook class for rules in input.css */
  "sk-input",
  "flex-1 bg-transparent outline-none",
  "placeholder:text-gray-400 dark:placeholder:text-gray-500",
  "disabled:cursor-not-allowed",
  /* Reset file input styling */
  "file:border-0 file:bg-transparent file:font-medium file:text-inherit",
].join(" ");
export const adornmentStyles = [
  "flex shrink-0 items-center",
  "text-gray-400 dark:text-gray-500",
  "[&>svg]:size-4",
].join(" ");

/** * ============================================ * Input Component * ============================================ * Zero Tailwind knowledge — all styling comes from * input.styles.ts (the adapter). The custom rules in * input.css (appended to your global stylesheet by the CLI) * target the \`sk-input\` class on the field. * ============================================ */const Input = forwardRef<HTMLInputElement, InputProps>(  (    {      className,      size,      error = false,      startAdornment,      endAdornment,      type,      disabled,      ...props    },    ref  ) => {    return (      <div        className={cn(          inputWrapperVariants({ size, error: error ? "true" : "false" }),          className        )}      >        {startAdornment && (          <span className={adornmentStyles}>{startAdornment}</span>        )}        <input          ref={ref}          type={type}          disabled={disabled}          aria-invalid={error || undefined}          className={inputFieldStyles}          {...props}        />        {endAdornment && (          <span className={adornmentStyles}>{endAdornment}</span>        )}      </div>    );  });Input.displayName = "Input";export { Input, inputWrapperVariants };
`,
      },
    ],
    registryDependencies: [],
    npmDependencies: ["clsx","tailwind-merge"],
    css: `/* Input — rules that Tailwind utilities can't express cleanly.
   Targets the \`sk-input\` class on the <input> element. */

/* Remove the up/down spinners on number inputs */
.sk-input::-webkit-outer-spin-button,
.sk-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.sk-input[type="number"] {
  -moz-appearance: textfield;
}

/* Stop the browser's yellow autofill background from overriding the theme */
.sk-input:-webkit-autofill,
.sk-input:-webkit-autofill:hover,
.sk-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px transparent inset;
  -webkit-text-fill-color: currentColor;
  transition: background-color 9999s ease-in-out 0s;
}
`,
  },
  sidebar: {
    name: "sidebar",
    description: "A collapsible navigation sidebar with nested groups, badges, and tooltips",
    files: [
      {
        path: "ui/sidebar.tsx",
        content: `"use client";

import { type ComponentType, type ReactNode, createContext, forwardRef, useContext, useState } from "react";
import { ChevronRight, ChevronsUpDown, Command, PanelLeft, PanelLeftClose, Search } from "lucide-react";
import { cn } from "{{ALIAS}}/lib/cn";

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

/**
 * Sidebar style fragments — plain Tailwind utilities with dark: variants.
 * No variants() needed here: the sidebar's states are simple booleans
 * (collapsed / active / open) handled inline with cn() in the component.
 */
export const sidebarAside = [
  "flex h-screen shrink-0 flex-col font-sans",
  "border-r border-gray-200 bg-white text-gray-900",
  "dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100",
  "transition-[width] duration-300 ease-in-out",
].join(" ");
export const sidebarSearch = [
  "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm",
  "border border-gray-200 dark:border-gray-800",
  "transition-colors duration-200",
  "focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30",
].join(" ");
export const sidebarTooltip = [
  "pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2",
  "whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium shadow-md",
  "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900",
  "opacity-0 transition-opacity duration-150 group-hover/tip:opacity-100",
].join(" ");
export const sidebarRowBase = [
  "group/row relative mx-1 flex cursor-pointer items-center rounded-lg py-2 text-sm",
  "transition-all duration-200 ease-out active:scale-[0.97]",
].join(" ");

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
    (activePath === item.href || activePath.startsWith(\`\${item.href}/\`))
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
    (activePath === item.href || activePath.startsWith(\`\${item.href}/\`));
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
const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items,
      footerItems = [],
      activePath = "",
      title = "Workspace",
      defaultCollapsed = false,
      showSearch = true,
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
        </aside>
      </SidebarContext.Provider>
    );
  }
);
Sidebar.displayName = "Sidebar";
export { Sidebar, useSidebar };
`,
      },
    ],
    registryDependencies: [],
    npmDependencies: ["clsx","tailwind-merge","lucide-react"],
    css: null,
  },
};
