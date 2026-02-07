/**
 * ============================================
 * Input Component
 * ============================================
 * Zero Tailwind knowledge — all styling comes from
 * input.styles.ts (the adapter). All design values
 * come from tokens.css (CSS variables).
 * ============================================
 */

import { forwardRef } from "react";
import { cn } from "../../lib/cn";
import {
  inputWrapperVariants,
  inputFieldStyles,
  adornmentStyles,
} from "./input.styles";
import type { InputProps } from "./input.types";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size,
      error = false,
      startAdornment,
      endAdornment,
      type,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          inputWrapperVariants({ size, error: error ? "true" : "false" }),
          className
        )}
      >
        {startAdornment && (
          <span className={adornmentStyles}>{startAdornment}</span>
        )}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          aria-invalid={error || undefined}
          className={inputFieldStyles}
          {...props}
        />
        {endAdornment && (
          <span className={adornmentStyles}>{endAdornment}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputWrapperVariants };
