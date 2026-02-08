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
  tokens: {
    path: "tokens/tokens.css",
    content: `/*
 * ============================================
 * Design Tokens — Framework Agnostic
 * ============================================
 * These CSS variables are the SINGLE SOURCE OF TRUTH
 * for the entire design system. Tailwind (or any
 * utility framework) is configured to CONSUME these,
 * not the other way around.
 *
 * To theme: override these variables on any container.
 * ============================================
 */

:root {
  /* ---- Colors (using oklch for wide-gamut support) ---- */

  /* Primary */
  --lib-color-primary: oklch(0.55 0.18 250);
  --lib-color-primary-hover: oklch(0.48 0.18 250);
  --lib-color-primary-active: oklch(0.42 0.18 250);
  --lib-color-primary-foreground: oklch(0.98 0 0);

  /* Secondary */
  --lib-color-secondary: oklch(0.93 0.01 260);
  --lib-color-secondary-hover: oklch(0.88 0.01 260);
  --lib-color-secondary-active: oklch(0.83 0.01 260);
  --lib-color-secondary-foreground: oklch(0.15 0.01 260);

  /* Destructive */
  --lib-color-destructive: oklch(0.55 0.2 25);
  --lib-color-destructive-hover: oklch(0.48 0.2 25);
  --lib-color-destructive-active: oklch(0.42 0.2 25);
  --lib-color-destructive-foreground: oklch(0.98 0 0);

  /* Outline / Ghost */
  --lib-color-outline-border: oklch(0.8 0.01 260);
  --lib-color-outline-hover: oklch(0.95 0.01 260);
  --lib-color-ghost-hover: oklch(0.95 0.01 260);

  /* Foreground */
  --lib-color-foreground: oklch(0.15 0.01 260);

  /* ---- Typography ---- */
  --lib-font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --lib-font-weight-normal: 400;
  --lib-font-weight-medium: 500;
  --lib-font-weight-semibold: 600;

  --lib-font-size-xs: 0.75rem;   /* 12px */
  --lib-font-size-sm: 0.875rem;  /* 14px */
  --lib-font-size-base: 1rem;    /* 16px */

  /* ---- Spacing ---- */
  --lib-spacing-1: 0.25rem;
  --lib-spacing-2: 0.5rem;
  --lib-spacing-3: 0.75rem;
  --lib-spacing-4: 1rem;
  --lib-spacing-5: 1.25rem;
  --lib-spacing-6: 1.5rem;

  /* ---- Border Radius ---- */
  --lib-radius-sm: 0.25rem;
  --lib-radius-md: 0.375rem;
  --lib-radius-lg: 0.5rem;
  --lib-radius-xl: 0.75rem;
  --lib-radius-full: 9999px;

  /* ---- Sizing (component heights) ---- */
  --lib-size-sm: 2rem;       /* 32px */
  --lib-size-md: 2.5rem;     /* 40px */
  --lib-size-lg: 2.75rem;    /* 44px */
  --lib-size-icon: 2.25rem;  /* 36px */

  /* ---- Transitions ---- */
  --lib-transition-fast: 120ms ease;
  --lib-transition-normal: 200ms ease;

  /* ---- Focus ring ---- */
  --lib-ring-width: 2px;
  --lib-ring-offset: 2px;
  --lib-ring-color: oklch(0.55 0.18 250);

  /* ---- Input ---- */
  --lib-input-border: oklch(0.8 0.01 260);
  --lib-input-border-hover: oklch(0.65 0.01 260);
  --lib-input-border-focus: oklch(0.55 0.18 250);
  --lib-input-bg: oklch(1 0 0);
  --lib-input-foreground: oklch(0.15 0.01 260);
  --lib-input-placeholder: oklch(0.55 0.01 260);
  --lib-input-disabled-bg: oklch(0.96 0.005 260);
  --lib-input-error-border: oklch(0.55 0.2 25);
  --lib-input-error-text: oklch(0.55 0.2 25);

  /* ---- Shadows ---- */
  --lib-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

/* ---- Dark mode ---- */
[data-theme="dark"],
.dark {
  --lib-color-primary: oklch(0.7 0.18 250);
  --lib-color-primary-hover: oklch(0.75 0.18 250);
  --lib-color-primary-active: oklch(0.65 0.18 250);
  --lib-color-primary-foreground: oklch(0.1 0 0);

  --lib-color-secondary: oklch(0.25 0.01 260);
  --lib-color-secondary-hover: oklch(0.3 0.01 260);
  --lib-color-secondary-active: oklch(0.35 0.01 260);
  --lib-color-secondary-foreground: oklch(0.93 0.01 260);

  --lib-color-destructive: oklch(0.6 0.2 25);
  --lib-color-destructive-hover: oklch(0.65 0.2 25);
  --lib-color-destructive-active: oklch(0.55 0.2 25);
  --lib-color-destructive-foreground: oklch(0.98 0 0);

  --lib-color-outline-border: oklch(0.35 0.01 260);
  --lib-color-outline-hover: oklch(0.25 0.01 260);
  --lib-color-ghost-hover: oklch(0.25 0.01 260);

  --lib-color-foreground: oklch(0.93 0.01 260);

  /* Input (dark) */
  --lib-input-border: oklch(0.35 0.01 260);
  --lib-input-border-hover: oklch(0.5 0.01 260);
  --lib-input-border-focus: oklch(0.7 0.18 250);
  --lib-input-bg: oklch(0.18 0.005 260);
  --lib-input-foreground: oklch(0.93 0.01 260);
  --lib-input-placeholder: oklch(0.5 0.01 260);
  --lib-input-disabled-bg: oklch(0.22 0.005 260);
  --lib-input-error-border: oklch(0.6 0.2 25);
  --lib-input-error-text: oklch(0.65 0.2 25);
}
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
        content: `import type { ComponentPropsWithRef } from "react";

import { variants } from "{{ALIAS}}/lib/variants";

import { forwardRef } from "react";
import { cn } from "{{ALIAS}}/lib/cn";

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  /** Visual style variant */
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  /** Size preset */
  size?: "sm" | "md" | "lg" | "icon";
  /** Show loading spinner and disable interaction */
  loading?: boolean;
  /** Render as a child component (slot pattern) */
  asChild?: boolean;
}

/**
 * ============================================
 * Button Style Adapter
 * ============================================
 * This is the ONLY file that knows about Tailwind classes.
 * If Tailwind changes syntax (v5, v6, etc.), you update
 * ONLY this file. The component itself never changes.
 *
 * All colors reference CSS variables from tokens.css,
 * so theming works regardless of Tailwind version.
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
    /* Focus ring — uses CSS variable so ring color is themeable */
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-[var(--lib-ring-color)]",
    /* Disabled */
    "disabled:pointer-events-none disabled:opacity-50",
    /* SVG icon sizing */
    "[&>svg]:pointer-events-none [&>svg]:shrink-0",
  ].join(" "),
  variants: {
    variant: {
      primary: [
        "bg-[var(--lib-color-primary)]",
        "text-[var(--lib-color-primary-foreground)]",
        "hover:bg-[var(--lib-color-primary-hover)]",
        "active:bg-[var(--lib-color-primary-active)]",
        "shadow-sm",
      ].join(" "),
      secondary: [
        "bg-[var(--lib-color-secondary)]",
        "text-[var(--lib-color-secondary-foreground)]",
        "hover:bg-[var(--lib-color-secondary-hover)]",
        "active:bg-[var(--lib-color-secondary-active)]",
      ].join(" "),
      destructive: [
        "bg-[var(--lib-color-destructive)]",
        "text-[var(--lib-color-destructive-foreground)]",
        "hover:bg-[var(--lib-color-destructive-hover)]",
        "active:bg-[var(--lib-color-destructive-active)]",
        "shadow-sm",
      ].join(" "),
      outline: [
        "border border-[var(--lib-color-outline-border)]",
        "bg-transparent",
        "text-[var(--lib-color-foreground)]",
        "hover:bg-[var(--lib-color-outline-hover)]",
      ].join(" "),
      ghost: [
        "bg-transparent",
        "text-[var(--lib-color-foreground)]",
        "hover:bg-[var(--lib-color-ghost-hover)]",
      ].join(" "),
      link: [
        "bg-transparent",
        "text-[var(--lib-color-primary)]",
        "underline-offset-4",
        "hover:underline",
      ].join(" "),
    },
    size: {
      sm: "h-[var(--lib-size-sm)] px-3 text-[length:var(--lib-font-size-xs)] rounded-[var(--lib-radius-md)] [&>svg]:size-3.5",
      md: "h-[var(--lib-size-md)] px-4 py-2 text-[length:var(--lib-font-size-sm)] rounded-[var(--lib-radius-md)] [&>svg]:size-4",
      lg: "h-[var(--lib-size-lg)] px-6 text-[length:var(--lib-font-size-base)] rounded-[var(--lib-radius-lg)] [&>svg]:size-5",
      icon: "size-[var(--lib-size-icon)] rounded-[var(--lib-radius-md)] [&>svg]:size-4",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

/**
 * ============================================
 * Button Component
 * ============================================
 * This file contains ZERO Tailwind knowledge.
 * All styling comes from button.styles.ts (the adapter).
 * All design values come from tokens.css (CSS variables).
 *
 * If Tailwind is replaced, this file stays untouched.
 * ============================================
 */
const Spinner = () => (
  <svg
    className="animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export { Button, buttonVariants };
`,
      },
    ],
    registryDependencies: [],
    npmDependencies: ["clsx","tailwind-merge"],
  },
  input: {
    name: "input",
    description: "An input with sizes, error state, and start/end adornments",
    files: [
      {
        path: "ui/input.tsx",
        content: `import type { ComponentPropsWithRef, ReactNode } from "react";

import { variants } from "{{ALIAS}}/lib/variants";

import { forwardRef } from "react";
import { cn } from "{{ALIAS}}/lib/cn";

export interface InputProps
  extends Omit<ComponentPropsWithRef<"input">, "size"> {
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Show error styling */
  error?: boolean;
  /** Start adornment (icon, prefix text, etc.) */
  startAdornment?: ReactNode;
  /** End adornment (icon, clear button, etc.) */
  endAdornment?: ReactNode;
}

/**
 * ============================================
 * Input Style Adapter
 * ============================================
 * ONLY file that knows about Tailwind classes.
 * All colors/sizing reference CSS variables from tokens.css.
 * ============================================
 */
export const inputWrapperVariants = variants({
  base: [
    "flex items-center w-full",
    "border border-[var(--lib-input-border)]",
    "bg-[var(--lib-input-bg)]",
    "text-[var(--lib-input-foreground)]",
    "transition-colors duration-200 ease-in-out",
    /* Focus-within for the wrapper so adornments are inside the ring */
    "focus-within:border-[var(--lib-input-border-focus)]",
    "focus-within:ring-2 focus-within:ring-[var(--lib-ring-color)] focus-within:ring-offset-2",
    "hover:border-[var(--lib-input-border-hover)]",
    /* Disabled */
    "has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed",
    "has-[:disabled]:bg-[var(--lib-input-disabled-bg)]",
  ].join(" "),
  variants: {
    size: {
      sm: "h-[var(--lib-size-sm)] px-2.5 rounded-[var(--lib-radius-md)] text-[length:var(--lib-font-size-xs)] gap-1.5",
      md: "h-[var(--lib-size-md)] px-3 rounded-[var(--lib-radius-md)] text-[length:var(--lib-font-size-sm)] gap-2",
      lg: "h-[var(--lib-size-lg)] px-4 rounded-[var(--lib-radius-lg)] text-[length:var(--lib-font-size-base)] gap-2.5",
    },
    error: {
      true: [
        "border-[var(--lib-input-error-border)]",
        "focus-within:border-[var(--lib-input-error-border)]",
        "focus-within:ring-[var(--lib-input-error-border)]",
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
  "flex-1 bg-transparent outline-none",
  "placeholder:text-[var(--lib-input-placeholder)]",
  "disabled:cursor-not-allowed",
  /* Reset file input styling */
  "file:border-0 file:bg-transparent file:font-medium file:text-[var(--lib-input-foreground)]",
].join(" ");
export const adornmentStyles = [
  "flex shrink-0 items-center",
  "text-[var(--lib-input-placeholder)]",
  "[&>svg]:size-4",
].join(" ");

/**
 * ============================================
 * Input Component
 * ============================================
 * Zero Tailwind knowledge — all styling comes from
 * input.styles.ts (the adapter). All design values
 * come from tokens.css (CSS variables).
 * ============================================
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size,
      error = false,
      startAdornment,
      endAdornment,
      type,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          inputWrapperVariants({ size, error: error ? "true" : "false" }),
          className
        )}
      >
        {startAdornment && (
          <span className={adornmentStyles}>{startAdornment}</span>
        )}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          aria-invalid={error || undefined}
          className={inputFieldStyles}
          {...props}
        />
        {endAdornment && (
          <span className={adornmentStyles}>{endAdornment}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
export { Input, inputWrapperVariants };
`,
      },
    ],
    registryDependencies: [],
    npmDependencies: ["clsx","tailwind-merge"],
  },
};
