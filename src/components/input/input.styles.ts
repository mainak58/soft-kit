import { variants } from "../../lib/variants";

/**
 * ============================================
 * Input Style Adapter
 * ============================================
 * The ONLY file that knows about Tailwind classes.
 * Colors are plain Tailwind utilities (with dark: variants).
 *
 * Unlike Button, Input also ships a small `input.css` for the
 * things Tailwind can't do cleanly (autofill + number spinners).
 * The CLI appends that CSS to your project's global stylesheet.
 * The field carries the `sk-input` hook class those rules target.
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
