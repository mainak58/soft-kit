import type { ComponentPropsWithRef, ReactNode } from "react";

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
