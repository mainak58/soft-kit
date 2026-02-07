import { variants } from "../../lib/variants";

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
