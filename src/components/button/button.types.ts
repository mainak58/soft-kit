import type { ComponentPropsWithRef } from "react";

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
