import { useState } from "react";
import { Dropdown } from "../../../src/components/dropdown";
import type { OptionValue } from "../../../src/components/dropdown";
// Per-component CSS (normally appended to the user's global stylesheet by the
// CLI). Imported here so the panel's entrance animation plays in the preview.
import "../../../src/components/dropdown/dropdown.css";

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Dragonfruit", value: "dragonfruit" },
  { label: "Elderberry", value: "elderberry" },
  { label: "Fig", value: "fig" },
  { label: "Grapefruit with a very long label to truncate", value: "grapefruit" },
  { label: "Honeydew", value: "honeydew", disabled: true },
];

export default function DropdownDemo() {
  const [single, setSingle] = useState<OptionValue | OptionValue[]>("banana");
  const [multi, setMulti] = useState<OptionValue | OptionValue[]>([
    "apple",
    "cherry",
  ]);
  const [applied, setApplied] = useState<OptionValue | OptionValue[]>([]);

  return (
    <div className="max-w-sm space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Single select (search enabled)
        </h2>
        <Dropdown options={fruits} value={single} onChange={setSingle} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Multi-select, search hidden
        </h2>
        <Dropdown
          options={fruits}
          multiSelect
          showSearch={false}
          value={multi}
          onChange={setMulti}
        />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Deferred apply / cancel
        </h2>
        <Dropdown
          options={fruits}
          multiSelect
          value={applied}
          onApply={setApplied}
        />
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Applied: {Array.isArray(applied) && applied.length
            ? applied.join(", ")
            : "nothing yet"}
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Disabled
        </h2>
        <Dropdown options={fruits} disabled placeholder="Can't open me" />
      </section>
    </div>
  );
}
