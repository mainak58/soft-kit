import { variants } from "../../lib/variants";

/**
 * ============================================
 * Checkbox Style Adapter
 * ============================================
 * The ONLY file that knows about Tailwind classes.
 * Colors are plain Tailwind utilities (with dark: variants
 * for dark mode) — no external CSS or design-token file needed.
 *
 * The checked fill uses `accent-color`, so the box renders
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
