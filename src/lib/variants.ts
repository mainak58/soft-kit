/**
 * Lightweight variant helper — our own mini "cva".
 * Zero external dependencies. If we ever drop Tailwind,
 * this still works because it's just string concatenation.
 */

type VariantValue = string;
type VariantMap = Record<string, Record<string, VariantValue>>;
type DefaultVariants<V extends VariantMap> = {
  [K in keyof V]?: keyof V[K];
};

interface VariantConfig<V extends VariantMap> {
  base: string;
  variants: V;
  defaultVariants?: DefaultVariants<V>;
  compoundVariants?: Array<
    Partial<{ [K in keyof V]: keyof V[K] }> & { className: string }
  >;
}

type VariantProps<V extends VariantMap> = {
  [K in keyof V]?: keyof V[K];
};

/**
 * Creates a variant resolver function.
 *
 * @example
 * const button = variants({
 *   base: "inline-flex items-center",
 *   variants: {
 *     variant: { primary: "bg-primary", secondary: "bg-secondary" },
 *     size: { sm: "h-8 px-3", md: "h-10 px-4" },
 *   },
 *   defaultVariants: { variant: "primary", size: "md" },
 * });
 *
 * button({ variant: "secondary", size: "sm" })
 * // => "inline-flex items-center bg-secondary h-8 px-3"
 */
export function variants<V extends VariantMap>(config: VariantConfig<V>) {
  const { base, variants: variantDefs, defaultVariants, compoundVariants } = config;

  return function resolve(props?: VariantProps<V>): string {
    const resolved = { ...defaultVariants, ...props } as Record<string, string>;
    const classes: string[] = [base];

    // Apply individual variants
    for (const [key, value] of Object.entries(resolved)) {
      if (value != null && variantDefs[key]?.[value]) {
        classes.push(variantDefs[key][value]);
      }
    }

    // Apply compound variants
    if (compoundVariants) {
      for (const compound of compoundVariants) {
        const { className, ...conditions } = compound;
        const matches = Object.entries(conditions).every(
          ([key, val]) => resolved[key] === val
        );
        if (matches && className) {
          classes.push(className);
        }
      }
    }

    return classes.filter(Boolean).join(" ");
  };
}

export type { VariantProps, VariantMap };
