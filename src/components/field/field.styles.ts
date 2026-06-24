import { variants } from "../../lib/variants";

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
