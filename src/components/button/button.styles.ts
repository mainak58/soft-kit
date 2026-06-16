import { variants } from "../../lib/variants";

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
