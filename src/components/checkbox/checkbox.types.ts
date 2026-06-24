import type { ComponentPropsWithRef, ReactNode } from "react";

export interface CheckboxProps
  extends Omit<ComponentPropsWithRef<"input">, "size" | "type"> {
  /** Optional label rendered next to the checkbox */
  label?: ReactNode;
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Show error styling */
  error?: boolean;
}
