/**
 * ============================================
 * Button Component
 * ============================================
 * This file contains ZERO Tailwind knowledge.
 * All styling comes from button.styles.ts (the adapter).
 * All design values come from tokens.css (CSS variables).
 *
 * If Tailwind is replaced, this file stays untouched.
 * ============================================
 */

import { forwardRef } from "react";
import { cn } from "../../lib/cn";
import { buttonVariants } from "./button.styles";
import type { ButtonProps } from "./button.types";

const Spinner = () => (
  <svg
    className="animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
