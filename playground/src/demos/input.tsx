import { Mail, Search } from "lucide-react";
import { Input } from "../../../src/components/input";

export default function InputDemo() {
  return (
    <div className="max-w-sm space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Sizes
        </h2>
        <div className="space-y-3">
          <Input size="sm" placeholder="Small" />
          <Input size="md" placeholder="Medium" />
          <Input size="lg" placeholder="Large" />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Adornments
        </h2>
        <div className="space-y-3">
          <Input
            placeholder="Search"
            startAdornment={<Search className="size-4" />}
          />
          <Input
            placeholder="you@example.com"
            startAdornment={<Mail className="size-4" />}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Error
        </h2>
        <Input error placeholder="Something's wrong" defaultValue="bad value" />
      </section>
    </div>
  );
}
