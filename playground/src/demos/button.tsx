import { Button } from "../../../src/components/button";

const variants = [
  "primary",
  "secondary",
  "destructive",
  "outline",
  "ghost",
  "link",
] as const;

export default function ButtonDemo() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Variants
        </h2>
        <div className="flex flex-wrap gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v}>
              {v}
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Sizes
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          States
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>
    </div>
  );
}
