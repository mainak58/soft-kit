import { variants } from "../../lib/variants";

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
