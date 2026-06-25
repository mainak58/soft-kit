import { variants } from "../../lib/variants";

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
