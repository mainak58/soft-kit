import type { ComponentPropsWithRef, ReactNode } from "react";

export interface FieldProps extends ComponentPropsWithRef<"div"> {
  /** The field label */
  label?: ReactNode;
  /** id of the control this label points to (renders <label for=…>) */
  htmlFor?: string;
  /** Marks the field as required (renders a red asterisk after the label) */
  required?: boolean;
  /** Helper text shown beneath the control */
  hint?: ReactNode;
  /** Error message shown beneath the control (takes the place of hint) */
  error?: ReactNode;
  /** Size preset controlling label + helper text sizing */
  size?: "sm" | "md" | "lg";
}
