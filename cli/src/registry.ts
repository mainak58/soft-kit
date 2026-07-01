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
  "button": {
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

/** * ============================================ * Button Component * ============================================ * This file contains ZERO Tailwind knowledge. * All styling comes from button.styles.ts (the adapter). * * Button needs no external CSS — it's pure Tailwind utilities. * ============================================ */const Spinner = () => (  <svg    className="animate-spin"    xmlns="http://www.w3.org/2000/svg"    fill="none"    viewBox="0 0 24 24"    aria-hidden="true"  >    <circle      className="opacity-25"      cx="12"      cy="12"      r="10"      stroke="currentColor"      strokeWidth="4"    />    <path      className="opacity-75"      fill="currentColor"      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"    />  </svg>);const Button = forwardRef<HTMLButtonElement, ButtonProps>(  ({ className, variant, size, loading = false, disabled, children, ...props }, ref) => {    return (      <button        ref={ref}        className={cn(buttonVariants({ variant, size }), className)}        disabled={disabled || loading}        aria-busy={loading || undefined}        {...props}      >        {loading && <Spinner />}        {children}      </button>    );  });Button.displayName = "Button";export { Button };
`,
      },
    ],
    registryDependencies: [],
    npmDependencies: ["clsx","tailwind-merge"],
    css: null,
  },
  "checkbox": {
    name: "checkbox",
    description: "A checkbox with optional label, sizes, and error state",
    files: [
      {
        path: "ui/checkbox.tsx",
        content: `import { type ComponentPropsWithRef, type ReactNode, forwardRef } from "react";
import { variants } from "{{ALIAS}}/lib/variants";
import { cn } from "{{ALIAS}}/lib/cn";

export interface CheckboxProps
  extends Omit<ComponentPropsWithRef<"input">, "size" | "type"> {
  /** Optional label rendered next to the checkbox */
  label?: ReactNode;
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Show error styling */
  error?: boolean;
}

/**
 * ============================================
 * Checkbox Style Adapter
 * ============================================
 * The ONLY file that knows about Tailwind classes.
 * Colors are plain Tailwind utilities (with dark: variants
 * for dark mode) — no external CSS or design-token file needed.
 *
 * The checked fill uses \`accent-color\`, so the box renders
 * natively and stays consistent across browsers.
 * ============================================
 */
export const checkboxVariants = variants({
  base: [
    "shrink-0 cursor-pointer rounded border bg-white",
    "border-gray-300 accent-blue-600",
    "transition-colors duration-200 ease-in-out",
    /* Focus ring */
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400",
    /* Disabled */
    "disabled:cursor-not-allowed disabled:opacity-50",
    /* Dark mode */
    "dark:border-gray-700 dark:bg-gray-900 dark:accent-blue-500",
  ].join(" "),
  variants: {
    size: {
      sm: "h-3.5 w-3.5",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    },
    error: {
      true: "border-red-500 dark:border-red-500",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    error: "false",
  },
});
export const checkboxLabelVariants = variants({
  base: "select-none text-gray-900 dark:text-gray-100",
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
    disabled: {
      true: "cursor-not-allowed opacity-50",
      false: "cursor-pointer",
    },
  },
  defaultVariants: {
    size: "md",
    disabled: "false",
  },
});

/**
 * ============================================
 * Checkbox Component
 * ============================================
 * A framework-agnostic checkbox. With a \`label\` it renders an
 * inline <label> wrapper so the text is clickable; without one
 * it renders the bare <input> (drop it inside a <Field>, etc.).
 *
 * Zero Tailwind knowledge — all styling comes from
 * checkbox.styles.ts (the adapter).
 * ============================================
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, size, error = false, disabled, ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        aria-invalid={error || undefined}
        className={cn(
          checkboxVariants({ size, error: error ? "true" : "false" }),
          className
        )}
        {...props}
      />
    );
    if (!label) return input;
    return (
      <label className="inline-flex items-center gap-2">
        {input}
        <span
          className={checkboxLabelVariants({
            size,
            disabled: disabled ? "true" : "false",
          })}
        >
          {label}
        </span>
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
export { Checkbox };
`,
      },
    ],
    registryDependencies: [],
    npmDependencies: ["clsx","tailwind-merge"],
    css: null,
  },
  "dropdown": {
    name: "dropdown",
    description: "An accessible select with search, multi-select, and deferred apply/cancel",
    files: [
      {
        path: "ui/dropdown.tsx",
        content: `"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "{{ALIAS}}/lib/cn";

/** A selectable value — strings or numbers both work as unique keys. */
export type OptionValue = string | number;
export interface DropdownOption {
  /** Text shown in the list and (when selected) on the trigger. */
  label: string;
  /** Unique identifier passed back through onChange / onApply. */
  value: OptionValue;
  /** Render this single option as unselectable. */
  disabled?: boolean;
}
export interface DropdownProps {
  /** List of selectable items. */
  options: DropdownOption[];
  /**
   * Controlled selection. Pass a single value for single-select, an array for
   * multi-select. Omit to let the dropdown manage its own state.
   */
  value?: OptionValue | OptionValue[];
  /**
   * Fires on every change (immediate mode). Receives a single value in
   * single-select and an array in multi-select. Ignored while \`onApply\` is set.
   */
  onChange?: (value: OptionValue | OptionValue[]) => void;
  /** Text shown when nothing is selected. */
  placeholder?: string;
  /** Render the search field inside the panel. When false it is not in the DOM. */
  showSearch?: boolean;
  /** Enable multi-select with checkboxes; the panel stays open while picking. */
  multiSelect?: boolean;
  /**
   * When provided, the panel shows Apply / Cancel and defers committing the
   * selection until Apply is clicked. Cancel (and dismissing the panel) reverts
   * to the last applied selection.
   */
  onApply?: (value: OptionValue | OptionValue[]) => void;
  /** Disable the whole control. */
  disabled?: boolean;
  /**
   * Extra classes for the root element. Merged with tailwind-merge so a passed
   * utility overrides the internal one (e.g. \`m-4\` replaces the default \`m-2\`).
   */
  className?: string;
}

/**
 * Dropdown style fragments — plain Tailwind utilities with dark: variants.
 * Like the sidebar, the dropdown's states (open / selected / checked) are
 * simple booleans handled inline with cn() in the component, so there's no
 * variant/size table to model with variants() here.
 */
export const dropdownRoot = [
  "relative inline-block m-2 min-w-[12rem] text-left align-top font-sans",
].join(" ");
export const dropdownTrigger = [
  "flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm",
  "border-gray-300 bg-white text-gray-900",
  "dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100",
  "cursor-pointer select-none transition-colors duration-200",
  "hover:bg-gray-50 dark:hover:bg-gray-900",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400",
  "data-[state=open]:border-blue-500 dark:data-[state=open]:border-blue-400",
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-gray-950",
].join(" ");
export const dropdownPanel = [
  "absolute left-0 z-50 mt-1.5 w-full overflow-hidden rounded-md border shadow-lg",
  "border-gray-200 bg-white text-gray-900",
  "dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100",
].join(" ");
export const dropdownSearch = [
  "flex items-center gap-2 border-b px-3 py-2",
  "border-gray-200 dark:border-gray-800",
].join(" ");
export const dropdownList = "max-h-60 overflow-y-auto p-1";
export const dropdownOptionBase = [
  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm",
  "cursor-pointer select-none text-gray-700 dark:text-gray-200",
  "transition-colors duration-150",
  "hover:bg-gray-100 dark:hover:bg-gray-800",
  "focus-visible:outline-none focus-visible:bg-gray-100 dark:focus-visible:bg-gray-800",
].join(" ");
export const dropdownCheckbox = [
  "flex size-4 shrink-0 items-center justify-center rounded border transition-colors duration-150",
].join(" ");
export const dropdownEmpty = [
  "px-3 py-6 text-center text-sm text-gray-400 dark:text-gray-500",
].join(" ");
export const dropdownFooter = [
  "flex items-center justify-end gap-2 border-t px-2 py-2",
  "border-gray-200 dark:border-gray-800",
].join(" ");
const actionBase = [
  "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium",
  "cursor-pointer select-none transition-colors duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400",
].join(" ");
export const dropdownCancelBtn = [
  actionBase,
  "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
].join(" ");
export const dropdownApplyBtn = [
  actionBase,
  "bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800",
  "dark:bg-blue-500 dark:hover:bg-blue-400 dark:active:bg-blue-600",
].join(" ");

/** Normalize a controlled value (single | array | undefined) to an array. */
const toArray = (v?: OptionValue | OptionValue[]): OptionValue[] =>
  v == null ? [] : Array.isArray(v) ? v : [v];
const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select...",
      showSearch = true,
      multiSelect = false,
      onApply,
      disabled = false,
      className,
    },
    ref
  ) => {
    const deferred = typeof onApply === "function";
    const isControlled = value !== undefined;
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [internal, setInternal] = useState<OptionValue[]>(() => toArray(value));
    const [draft, setDraft] = useState<OptionValue[]>(() => toArray(value));
    // The last-committed selection, and the one the panel currently reflects.
    const committed = isControlled ? toArray(value) : internal;
    const selected = deferred ? draft : committed;
    const rootRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    // Latest values for the document listeners, which only bind on open.
    const stateRef = useRef({ deferred, committed });
    stateRef.current = { deferred, committed };
    const setRootRef = (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };
    // Dismiss on outside mousedown or Escape — staged changes are discarded.
    useEffect(() => {
      if (!open) return;
      const dismiss = () => {
        const s = stateRef.current;
        if (s.deferred) setDraft(s.committed);
        setOpen(false);
      };
      const onPointer = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          dismiss();
        }
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") dismiss();
      };
      document.addEventListener("mousedown", onPointer);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("mousedown", onPointer);
        document.removeEventListener("keydown", onKey);
      };
    }, [open]);
    // Auto-focus the search field when the panel opens.
    useEffect(() => {
      if (open && showSearch) searchRef.current?.focus();
    }, [open, showSearch]);
    const labelFor = (v: OptionValue) =>
      options.find((o) => o.value === v)?.label ?? String(v);
    const query = search.trim().toLowerCase();
    const filtered = query
      ? options.filter((o) => o.label.toLowerCase().includes(query))
      : options;
    const openPanel = () => {
      setSearch("");
      setDraft(committed);
      setOpen(true);
    };
    const closePanel = () => {
      if (deferred) setDraft(committed);
      setOpen(false);
    };
    const commit = (next: OptionValue[]) => {
      if (!isControlled) setInternal(next);
      onChange?.(multiSelect ? next : next[0]);
    };
    const handleSelect = (opt: DropdownOption) => {
      if (opt.disabled) return;
      if (multiSelect) {
        const exists = selected.some((s) => s === opt.value);
        const next = exists
          ? selected.filter((s) => s !== opt.value)
          : [...selected, opt.value];
        if (deferred) setDraft(next);
        else commit(next);
        // Multi-select keeps the panel open so the user can keep picking.
      } else {
        const next = [opt.value];
        if (deferred) {
          setDraft(next);
        } else {
          commit(next);
          setOpen(false); // single-select commits and closes immediately
        }
      }
    };
    const handleApply = () => {
      if (!isControlled) setInternal(draft);
      onApply?.(multiSelect ? draft : draft[0]);
      setOpen(false);
    };
    const handleCancel = () => {
      setDraft(committed);
      setOpen(false);
    };
    // The trigger shows the committed (last-applied) selection.
    let triggerLabel: string;
    let isPlaceholder = false;
    if (committed.length === 0) {
      triggerLabel = placeholder;
      isPlaceholder = true;
    } else if (!multiSelect || committed.length === 1) {
      triggerLabel = labelFor(committed[0]);
    } else {
      triggerLabel = \`\${committed.length} selected\`;
    }
    return (
      <div ref={setRootRef} className={cn(dropdownRoot, className)}>
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          data-state={open ? "open" : "closed"}
          onClick={() => (open ? closePanel() : openPanel())}
          className={dropdownTrigger}
        >
          <span
            className={cn(
              "truncate",
              isPlaceholder && "text-gray-400 dark:text-gray-500"
            )}
            title={isPlaceholder ? undefined : triggerLabel}
          >
            {triggerLabel}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-gray-400 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
        {open && (
          <div
            role="listbox"
            aria-multiselectable={multiSelect}
            className={cn(dropdownPanel, "sk-dropdown")}
          >
            {showSearch && (
              <div className={dropdownSearch}>
                <Search className="size-4 shrink-0 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  aria-label="Search options"
                  className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
                />
              </div>
            )}
            <div className={dropdownList}>
              {options.length === 0 ? (
                <p className={dropdownEmpty}>No options</p>
              ) : filtered.length === 0 ? (
                <p className={dropdownEmpty}>No results found</p>
              ) : (
                filtered.map((opt) => {
                  const isChecked = selected.some((s) => s === opt.value);
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      role="option"
                      aria-selected={isChecked}
                      disabled={opt.disabled}
                      title={opt.label}
                      onClick={() => handleSelect(opt)}
                      className={cn(
                        dropdownOptionBase,
                        isChecked &&
                          !multiSelect &&
                          "bg-blue-50 font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
                        opt.disabled && "pointer-events-none opacity-40"
                      )}
                    >
                      {multiSelect && (
                        <span
                          className={cn(
                            dropdownCheckbox,
                            isChecked
                              ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500"
                              : "border-gray-300 dark:border-gray-600"
                          )}
                        >
                          {isChecked && (
                            <Check className="size-3" strokeWidth={3} />
                          )}
                        </span>
                      )}
                      <span className="truncate">{opt.label}</span>
                      {!multiSelect && isChecked && (
                        <Check className="ml-auto size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
            {deferred && (
              <div className={dropdownFooter}>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={dropdownCancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className={dropdownApplyBtn}
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);
Dropdown.displayName = "Dropdown";
export { Dropdown };
`,
      },
    ],
    registryDependencies: [],
    npmDependencies: ["clsx","tailwind-merge","lucide-react"],
    css: `/**
 * Dropdown panel entrance. Tailwind can't express a keyframe animation without
 * a plugin, so the panel carries the \`sk-dropdown\` hook class and this rule
 * animates it in. Reduced-motion users get an instant, static panel.
 */
@keyframes sk-dropdown-in {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.sk-dropdown {
  transform-origin: top;
  animation: sk-dropdown-in 140ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .sk-dropdown {
    animation: none;
  }
}
`,
  },
  "field": {
    name: "field",
    description: "Form field wrapper with label, required marker, hint and error text",
    files: [
      {
        path: "ui/field.tsx",
        content: `import { type ComponentPropsWithRef, type ReactNode, forwardRef } from "react";
import { variants } from "{{ALIAS}}/lib/variants";
import { cn } from "{{ALIAS}}/lib/cn";

export interface FieldProps extends ComponentPropsWithRef<"div"> {
  /** The field label */
  label?: ReactNode;
  /** id of the control this label points to (renders <label for=…>) */
  htmlFor?: string;
  /** Marks the field as required (renders a red asterisk after the label) */
  required?: boolean;
  /** Helper text shown beneath the control */
  hint?: ReactNode;
  /** Error message shown beneath the control (takes the place of hint) */
  error?: ReactNode;
  /** Size preset controlling label + helper text sizing */
  size?: "sm" | "md" | "lg";
}

/**
 * ============================================
 * Field Style Adapter
 * ============================================
 * The ONLY file that knows about Tailwind classes.
 * Colors are plain Tailwind utilities (with dark: variants
 * for dark mode) — no external CSS or design-token file needed.
 * ============================================
 */
export const fieldVariants = variants({
  base: "flex w-full flex-col gap-1.5",
  variants: {
    size: {
      sm: "gap-1",
      md: "gap-1.5",
      lg: "gap-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
export const fieldLabelVariants = variants({
  base: "font-medium text-gray-900 dark:text-gray-100",
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
export const fieldHintVariants = variants({
  base: "text-gray-500 dark:text-gray-400",
  variants: {
    size: {
      sm: "text-[0.6875rem]",
      md: "text-xs",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
export const fieldErrorVariants = variants({
  base: "font-medium text-red-600 dark:text-red-400",
  variants: {
    size: {
      sm: "text-[0.6875rem]",
      md: "text-xs",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
export const fieldRequiredStyles = "ml-0.5 text-red-600 dark:text-red-400";

/**
 * ============================================
 * Field Component
 * ============================================
 * A framework-agnostic form-field wrapper: an optional label
 * (with a required marker), the control you pass as children,
 * and an optional hint / error line beneath it.
 *
 * Zero Tailwind knowledge — all styling comes from
 * field.styles.ts (the adapter).
 * ============================================
 */
const Field = forwardRef<HTMLDivElement, FieldProps>(
  (
    { className, label, htmlFor, required, hint, error, size, children, ...props },
    ref
  ) => {
    return (
      <div ref={ref} className={cn(fieldVariants({ size }), className)} {...props}>
        {label && (
          <label htmlFor={htmlFor} className={fieldLabelVariants({ size })}>
            {label}
            {required && (
              <span className={fieldRequiredStyles} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        {children}
        {error ? (
          <span role="alert" className={fieldErrorVariants({ size })}>
            {error}
          </span>
        ) : hint ? (
          <span className={fieldHintVariants({ size })}>{hint}</span>
        ) : null}
      </div>
    );
  }
);
Field.displayName = "Field";
export { Field };
`,
      },
    ],
    registryDependencies: [],
    npmDependencies: ["clsx","tailwind-merge"],
    css: null,
  },
  "input": {
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

/** * ============================================ * Input Component * ============================================ * Zero Tailwind knowledge — all styling comes from * input.styles.ts (the adapter). The custom rules in * input.css (appended to your global stylesheet by the CLI) * target the \`sk-input\` class on the field. * ============================================ */const Input = forwardRef<HTMLInputElement, InputProps>(  (    {      className,      size,      error = false,      startAdornment,      endAdornment,      type,      disabled,      ...props    },    ref  ) => {    return (      <div        className={cn(          inputWrapperVariants({ size, error: error ? "true" : "false" }),          className        )}      >        {startAdornment && (          <span className={adornmentStyles}>{startAdornment}</span>        )}        <input          ref={ref}          type={type}          disabled={disabled}          aria-invalid={error || undefined}          className={inputFieldStyles}          {...props}        />        {endAdornment && (          <span className={adornmentStyles}>{endAdornment}</span>        )}      </div>    );  });Input.displayName = "Input";export { Input };
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
  "search": {
    name: "search",
    description: "Generic async search box with debounce and request cancellation",
    files: [
      {
        path: "ui/search.tsx",
        content: `"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search as SearchIcon, X } from "lucide-react";
import { cn } from "{{ALIAS}}/lib/cn";

/* -------------------------------------------------------------------------- */
/* Types — exported so you can reuse them anywhere:                            */
/*   import { Search } from "@/components/ui/search";                          */
/*   import type { SearchFetcher, SearchProps } from "@/components/ui/search"; */
/* -------------------------------------------------------------------------- */
/** Lifecycle of an async search request. */
export type SearchStatus = "idle" | "loading" | "success" | "empty" | "error";
/**
 * The async data source a consumer plugs in — this is where you call your API.
 *
 * - \`query\`  : the already-trimmed, debounced search term.
 * - \`signal\` : an AbortSignal that fires when a newer request supersedes this
 *              one (see \`cancelPrevious\`). Forward it into axios (\`{ signal }\`)
 *              or fetch so the in-flight request is actually cancelled.
 */
export type SearchFetcher<T> = (
  query: string,
  signal: AbortSignal
) => Promise<T[]>;
export interface SearchProps<T> {
  /** Where the API call happens. Receives (query, abortSignal). */
  fetcher: SearchFetcher<T>;
  /**
   * PROP 1 — debounce delay in ms. The fetcher only fires once typing has
   * paused for this long. Default: 300.
   */
  debounce?: number;
  /**
   * PROP 2 — when true, typing a new query aborts the previous in-flight
   * request (e.g. "se" -> "sea" cancels the "se" request). Default: true.
   */
  cancelPrevious?: boolean;
  /** Minimum characters before the fetcher runs. Default: 1. */
  minChars?: number;
  /** Seed the input with an initial query. */
  initialQuery?: string;
  /** Called after a successful fetch, with the results and the query used. */
  onSuccess?: (results: T[], query: string) => void;
  /** Called on a real (non-abort) error. */
  onError?: (error: unknown) => void;
  /** Placeholder for the input. */
  placeholder?: string;
  /** Stable React key for a result row. Defaults to the array index. */
  getKey?: (item: T, index: number) => string | number;
  /** Render one result row. Defaults to String(item). */
  renderItem?: (item: T) => ReactNode;
  /** Fires when a result row is chosen (click). */
  onSelect?: (item: T) => void;
  /** Custom node when there are no matches. */
  renderEmpty?: (query: string) => ReactNode;
  /** Custom loading node. */
  renderLoading?: () => ReactNode;
  /** Custom error node. */
  renderError?: (error: string) => ReactNode;
  /** Controlled query value. Omit for uncontrolled use. */
  value?: string;
  /** Notified on every query change (pairs with \`value\` for controlled use). */
  onQueryChange?: (value: string) => void;
  /** Focus the input on mount. */
  autoFocus?: boolean;
  /** Disable the input. */
  disabled?: boolean;
  /** Extra classes for the root wrapper. */
  className?: string;
  /** Extra classes for the <input>. */
  inputClassName?: string;
  /** Extra classes for the results panel. */
  panelClassName?: string;
}

/**
 * Search style fragments — plain Tailwind utilities with dark: variants.
 * Like the sidebar and dropdown, the search box has no variant/size table:
 * its states (loading / empty / error / success) are simple and handled
 * inline with cn() in the component, so there's nothing to model with
 * variants() here — just composable class-name constants.
 */
export const searchRoot = "relative w-full font-sans";
export const searchField = [
  "h-10 w-full rounded-lg border pr-8 pl-8 text-sm",
  "border-gray-300 bg-white text-gray-900",
  "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100",
  "outline-none transition-colors duration-200",
  "placeholder:text-gray-400 dark:placeholder:text-gray-500",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");
export const searchLeadingIcon = [
  "pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2",
  "text-gray-400 dark:text-gray-500",
].join(" ");
export const searchSpinner = [
  "absolute top-1/2 right-2.5 size-4 -translate-y-1/2 animate-spin motion-reduce:animate-none",
  "text-gray-400 dark:text-gray-500",
].join(" ");
export const searchClearBtn = [
  "absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-0.5",
  "text-gray-400 transition-colors dark:text-gray-500",
  "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100",
].join(" ");
export const searchPanel = [
  "absolute z-50 mt-1.5 max-h-72 w-full overflow-y-auto rounded-lg border p-1 shadow-lg",
  "border-gray-200 bg-white text-gray-900",
  "dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100",
].join(" ");
export const searchLoadingRow = [
  "flex items-center justify-center gap-2 px-3 py-6 text-sm",
  "text-gray-400 dark:text-gray-500",
].join(" ");
export const searchEmptyRow = [
  "px-3 py-6 text-center text-sm text-gray-400 dark:text-gray-500",
].join(" ");
export const searchErrorRow = [
  "px-3 py-6 text-center text-sm text-red-600 dark:text-red-400",
].join(" ");
export const searchOption = [
  "flex w-full items-center rounded-md px-2.5 py-2 text-left text-sm",
  "text-gray-700 transition-colors dark:text-gray-200",
  "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100",
  "focus-visible:bg-gray-100 focus-visible:outline-none dark:focus-visible:bg-gray-800",
].join(" ");

/**
 * A generic, reusable search box. You supply the API call via \`fetcher\`; the
 * component debounces input, cancels superseded requests, and renders the
 * results in a dropdown. It is generic over the result type \`T\`, so pass
 * \`renderItem\` / \`onSelect\` typed to your own shape.
 *
 *   <Search<Customer>
 *     debounce={400}
 *     cancelPrevious
 *     fetcher={searchCustomers}
 *     renderItem={(c) => c.name}
 *     onSelect={setCustomer}
 *   />
 */
function Search<T>({
  fetcher,
  debounce = 300,
  cancelPrevious = true,
  minChars = 1,
  initialQuery = "",
  onSuccess,
  onError,
  placeholder = "Search…",
  getKey,
  renderItem,
  onSelect,
  renderEmpty,
  renderLoading,
  renderError,
  value,
  onQueryChange,
  autoFocus,
  disabled,
  className,
  inputClassName,
  panelClassName,
}: SearchProps<T>) {
  const [internalQuery, setInternalQuery] = useState(value ?? initialQuery);
  const [results, setResults] = useState<T[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  // \`value\` (if provided) makes the input controlled; otherwise state owns it.
  const query = value ?? internalQuery;
  // Hold the latest fetcher/callbacks in refs so run()'s identity is stable and
  // the debounce effect doesn't re-fire just because a parent re-rendered.
  const fetcherRef = useRef(fetcher);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    fetcherRef.current = fetcher;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  });
  // The controller for the request in flight, so a newer query can abort it.
  // A monotonic run id additionally discards an older request that resolves
  // *after* a newer one (even when cancelPrevious is off).
  const controllerRef = useRef<AbortController | null>(null);
  const runIdRef = useRef(0);
  const run = useCallback(
    (raw: string) => {
      const q = raw.trim();
      const runId = ++runIdRef.current;
      // Abort whatever was in flight before starting the next request.
      if (cancelPrevious) {
        controllerRef.current?.abort();
      }
      if (q.length < minChars) {
        controllerRef.current = null;
        setResults([]);
        setError(null);
        setStatus("idle");
        return;
      }
      const controller = new AbortController();
      controllerRef.current = controller;
      setStatus("loading");
      setError(null);
      fetcherRef
        .current(q, controller.signal)
        .then((data) => {
          if (runId !== runIdRef.current) return; // superseded by a newer query
          const list = data ?? [];
          setResults(list);
          setStatus(list.length ? "success" : "empty");
          onSuccessRef.current?.(list, q);
        })
        .catch((err) => {
          // Aborts are intentional — never surface them as errors.
          if (controller.signal.aborted) return;
          if (runId !== runIdRef.current) return;
          const message =
            err instanceof Error
              ? err.message
              : "Couldn't load results. Check your connection and try again.";
          setResults([]);
          setError(message);
          setStatus("error");
          onErrorRef.current?.(err);
        });
    },
    [cancelPrevious, minChars]
  );
  // Debounce: fire the search \`debounce\` ms after the query last changed.
  useEffect(() => {
    const id = setTimeout(() => run(query), debounce);
    return () => clearTimeout(id);
  }, [query, debounce, run]);
  // Abort any straggler request on unmount.
  useEffect(() => () => controllerRef.current?.abort(), []);
  const handleChange = (next: string) => {
    if (value === undefined) setInternalQuery(next);
    onQueryChange?.(next);
  };
  const handleClear = () => {
    controllerRef.current?.abort();
    runIdRef.current += 1;
    if (value === undefined) setInternalQuery("");
    setResults([]);
    setError(null);
    setStatus("idle");
    onQueryChange?.("");
  };
  const showPanel = query.trim().length >= minChars && status !== "idle";
  return (
    <div className={cn(searchRoot, className)}>
      <div className="relative">
        <SearchIcon className={searchLeadingIcon} />
        <input
          type="text"
          role="searchbox"
          value={query}
          autoFocus={autoFocus}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => handleChange(e.target.value)}
          className={cn(searchField, inputClassName)}
        />
        {/* Trailing affordance: spinner while loading, clear button otherwise. */}
        {status === "loading" ? (
          <Loader2 className={searchSpinner} />
        ) : (
          query.length > 0 && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={handleClear}
              className={searchClearBtn}
            >
              <X className="size-4" />
            </button>
          )
        )}
      </div>
      {showPanel && (
        <div role="listbox" className={cn(searchPanel, panelClassName)}>
          {status === "loading" &&
            (renderLoading?.() ?? (
              <div className={searchLoadingRow}>
                <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
                Searching…
              </div>
            ))}
          {status === "error" &&
            (renderError?.(error ?? "Couldn't load results. Try again.") ?? (
              <p className={searchErrorRow}>
                {error ?? "Couldn't load results. Try again."}
              </p>
            ))}
          {status === "empty" &&
            (renderEmpty?.(query) ?? (
              <p className={searchEmptyRow}>No results for “{query.trim()}”</p>
            ))}
          {status === "success" &&
            results.map((item, index) => (
              <button
                key={getKey?.(item, index) ?? index}
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => onSelect?.(item)}
                className={searchOption}
              >
                {renderItem?.(item) ?? String(item)}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
Search.displayName = "Search";
export { Search };
`,
      },
    ],
    registryDependencies: [],
    npmDependencies: ["clsx","tailwind-merge","lucide-react"],
    css: null,
  },
  "sidebar": {
    name: "sidebar",
    description: "A collapsible navigation sidebar with nested groups, badges, and tooltips",
    files: [
      {
        path: "ui/sidebar.tsx",
        content: `"use client";

import { type ComponentType, type ReactNode, createContext, forwardRef, useContext, useState } from "react";
import { ChevronRight, ChevronsUpDown, Command, Moon, PanelLeft, PanelLeftClose, Search, Sun } from "lucide-react";
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
   * Current dark-mode state. When provided (even \`false\`), a light/dark toggle
   * button renders pinned to the bottom of the sidebar. Omit the prop entirely
   * to hide the button.
   */
  darkMode?: boolean;
  /**
   * Called with the next dark-mode state when the toggle is pressed.
   * Wire this to your theme state (e.g. toggle the \`dark\` class on <html>).
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
`,
      },
    ],
    registryDependencies: [],
    npmDependencies: ["clsx","tailwind-merge","lucide-react"],
    css: null,
  },
  "tab-switcher": {
    name: "tab-switcher",
    description: "Accessible tabs with controlled/uncontrolled modes, keyboard nav, and an animated indicator",
    files: [
      {
        path: "ui/tab-switcher.tsx",
        content: `"use client";

import { type ReactNode, forwardRef, useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { variants } from "{{ALIAS}}/lib/variants";
import { cn } from "{{ALIAS}}/lib/cn";

export interface TabItem {
  /** Unique, stable identifier for the tab. */
  id: string;
  /** Visible label (text or a node, e.g. icon + text). */
  label: ReactNode;
  /** Panel content rendered when this tab is active. Optional — omit if you
   *  render content yourself in controlled mode. */
  content?: ReactNode;
  /** Disable selection of this tab. */
  disabled?: boolean;
}
export interface TabSwitcherProps {
  /** The tabs to render. */
  tabs: TabItem[];
  /** Controlled active tab id. Provide together with \`onChange\`. */
  value?: string;
  /** Initial active tab id for uncontrolled use. Defaults to the first enabled tab. */
  defaultValue?: string;
  /** Called with the new tab id whenever the active tab changes. */
  onChange?: (id: string) => void;
  /** Visual style. \`underline\` (default) slides a bar; \`pill\` slides a chip. */
  variant?: "underline" | "pill";
  /** Stretch tabs to fill the available width, splitting it evenly. */
  fitted?: boolean;
  /** Accessible label for the tab list (recommended for screen readers). */
  "aria-label"?: string;
  /** Extra classes for the root wrapper. */
  className?: string;
}

/**
 * ============================================
 * TabSwitcher Style Adapter
 * ============================================
 * Plain Tailwind utilities with dark: variants. The sliding indicator's
 * position is set inline (measured at runtime); the panel's enter animation
 * lives in tab-switcher.css (appended to your global stylesheet).
 * ============================================
 */
export const tabListVariants = variants({
  base: "relative flex items-center",
  variants: {
    variant: {
      underline: "gap-1 border-b border-gray-200 dark:border-gray-800",
      pill: "gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800/60",
    },
    fitted: {
      true: "w-full",
      false: "w-max max-w-full",
    },
  },
  defaultVariants: { variant: "underline", fitted: "false" },
});
export const tabTriggerVariants = variants({
  base: [
    "relative z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "cursor-pointer select-none text-sm font-medium",
    "transition-colors duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  variants: {
    variant: {
      underline: "rounded-t-md px-3 py-2",
      pill: "rounded-md px-3 py-1.5",
    },
    active: {
      true: "",
      false:
        "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
    },
    fitted: { true: "flex-1", false: "" },
  },
  compoundVariants: [
    {
      variant: "underline",
      active: "true",
      className: "text-blue-600 dark:text-blue-400",
    },
    {
      variant: "pill",
      active: "true",
      className: "text-gray-900 dark:text-gray-100",
    },
  ],
  defaultVariants: { variant: "underline", active: "false", fitted: "false" },
});
export const tabIndicatorVariants = variants({
  base: "pointer-events-none absolute z-0 transition-all duration-300 ease-out motion-reduce:transition-none",
  variants: {
    variant: {
      underline: "bottom-0 left-0 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400",
      pill: "left-0 top-1 bottom-1 rounded-md bg-white shadow-sm dark:bg-gray-950",
    },
  },
  defaultVariants: { variant: "underline" },
});

// Run layout measurements before paint on the client; fall back to useEffect
// during SSR so Next.js App Router doesn't warn.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
const Tab = forwardRef<HTMLDivElement, TabSwitcherProps>(function TabSwitcher(
  {
    tabs,
    value,
    defaultValue,
    onChange,
    variant = "underline",
    fitted = false,
    className,
    "aria-label": ariaLabel,
  },
  ref
) {
  const uid = useId();
  const isControlled = value !== undefined;
  const firstEnabled = tabs.find((t) => !t.disabled)?.id ?? tabs[0]?.id ?? "";
  const [internal, setInternal] = useState(defaultValue ?? firstEnabled);
  const activeId = isControlled ? (value as string) : internal;
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  // Skip the slide transition on the very first measurement (no jump from 0).
  const [ready, setReady] = useState(false);
  const measure = useCallback(() => {
    const el = tabRefs.current[activeId];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeId]);
  useIsoLayoutEffect(() => {
    measure();
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [measure, tabs, variant, fitted]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);
  const selectTab = useCallback(
    (id: string) => {
      if (!isControlled) setInternal(id);
      onChange?.(id);
    },
    [isControlled, onChange]
  );
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabled = tabs.filter((t) => !t.disabled);
    if (enabled.length === 0) return;
    const current = enabled.findIndex((t) => t.id === activeId);
    let nextIndex: number | null = null;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (current + 1) % enabled.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (current - 1 + enabled.length) % enabled.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = enabled.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    const next = enabled[nextIndex];
    selectTab(next.id);
    tabRefs.current[next.id]?.focus();
  };
  const activeTab = tabs.find((t) => t.id === activeId);
  const hasPanels = tabs.some((t) => t.content !== undefined);
  return (
    <div ref={ref} className={cn("w-full", className)}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className={tabListVariants({ variant, fitted: fitted ? "true" : "false" })}
      >
        {/* Sliding active indicator */}
        {indicator.width > 0 && (
          <span
            aria-hidden="true"
            className={cn(
              tabIndicatorVariants({ variant }),
              !ready && "!transition-none"
            )}
            style={{
              transform: \`translateX(\${indicator.left}px)\`,
              width: indicator.width,
            }}
          />
        )}
        {tabs.map((tab) => {
          const active = tab.id === activeId;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={\`\${uid}-tab-\${tab.id}\`}
              aria-selected={active}
              aria-controls={
                tab.content !== undefined ? \`\${uid}-panel-\${tab.id}\` : undefined
              }
              tabIndex={active ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => selectTab(tab.id)}
              className={tabTriggerVariants({
                variant,
                active: active ? "true" : "false",
                fitted: fitted ? "true" : "false",
              })}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {hasPanels && (
        <div className="pt-4">
          {activeTab?.content !== undefined && (
            <div
              key={activeId}
              role="tabpanel"
              id={\`\${uid}-panel-\${activeId}\`}
              aria-labelledby={\`\${uid}-tab-\${activeId}\`}
              tabIndex={0}
              className="sk-tab-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
            >
              {activeTab.content}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
const TabSwitcher = Tab;
TabSwitcher.displayName = "TabSwitcher";
export { TabSwitcher };
`,
      },
    ],
    registryDependencies: [],
    npmDependencies: ["clsx","tailwind-merge"],
    css: `/* TabSwitcher — panel enter animation.
   Tailwind can't key off React's remount, so the active panel carries the
   \`sk-tab-panel\` class and this keyframe plays each time the tab changes. */

@keyframes sk-tab-fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sk-tab-panel {
  animation: sk-tab-fade-in 200ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .sk-tab-panel {
    animation: none;
  }
}
`,
  },
};
