/**
 * ============================================
 * Field Component
 * ============================================
 * A framework-agnostic form-field wrapper: an optional label
 * (with a required marker), the control you pass as children,
 * and an optional hint / error line beneath it.
 *
 * Zero Tailwind knowledge — all styling comes from
 * field.styles.ts (the adapter).
 * ============================================
 */

import { forwardRef } from "react";
import { cn } from "../../lib/cn";
import {
  fieldVariants,
  fieldLabelVariants,
  fieldHintVariants,
  fieldErrorVariants,
  fieldRequiredStyles,
} from "./field.styles";
import type { FieldProps } from "./field.types";

const Field = forwardRef<HTMLDivElement, FieldProps>(
  (
    { className, label, htmlFor, required, hint, error, size, children, ...props },
    ref
  ) => {
    return (
      <div ref={ref} className={cn(fieldVariants({ size }), className)} {...props}>
        {label && (
          <label htmlFor={htmlFor} className={fieldLabelVariants({ size })}>
            {label}
            {required && (
              <span className={fieldRequiredStyles} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        {children}
        {error ? (
          <span role="alert" className={fieldErrorVariants({ size })}>
            {error}
          </span>
        ) : hint ? (
          <span className={fieldHintVariants({ size })}>{hint}</span>
        ) : null}
      </div>
    );
  }
);

Field.displayName = "Field";

export { Field, fieldVariants };
