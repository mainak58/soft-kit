/**
 * ============================================
 * Checkbox Component
 * ============================================
 * A framework-agnostic checkbox. With a `label` it renders an
 * inline <label> wrapper so the text is clickable; without one
 * it renders the bare <input> (drop it inside a <Field>, etc.).
 *
 * Zero Tailwind knowledge — all styling comes from
 * checkbox.styles.ts (the adapter).
 * ============================================
 */

import { forwardRef } from "react";
import { cn } from "../../lib/cn";
import { checkboxVariants, checkboxLabelVariants } from "./checkbox.styles";
import type { CheckboxProps } from "./checkbox.types";

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, size, error = false, disabled, ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        aria-invalid={error || undefined}
        className={cn(
          checkboxVariants({ size, error: error ? "true" : "false" }),
          className
        )}
        {...props}
      />
    );

    if (!label) return input;

    return (
      <label className="inline-flex items-center gap-2">
        {input}
        <span
          className={checkboxLabelVariants({
            size,
            disabled: disabled ? "true" : "false",
          })}
        >
          {label}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
