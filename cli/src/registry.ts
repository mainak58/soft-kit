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
        content: `import type { ComponentPropsWithRef } from "react";

import { variants } from "{{ALIAS}}/lib/variants";

import { forwardRef } from "react";
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
        content: `import type { ComponentPropsWithRef, ReactNode } from "react";

import { variants } from "{{ALIAS}}/lib/variants";

import { forwardRef } from "react";
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
};
