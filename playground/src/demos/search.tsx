import { useState } from "react";
import { Search } from "../../../src/components/search";

/** A demo dataset. In a real app this lives behind your API. */
const FRUITS = [
  "Apple",
  "Apricot",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cherry",
  "Cranberry",
  "Dragonfruit",
  "Elderberry",
  "Fig",
  "Grape",
  "Grapefruit",
  "Kiwi",
  "Lemon",
  "Lime",
  "Mango",
  "Nectarine",
  "Orange",
  "Papaya",
  "Peach",
  "Pear",
  "Pineapple",
  "Raspberry",
  "Strawberry",
  "Watermelon",
];

/**
 * A fake API: filters the list, waits ~500ms to show the loading state, and
 * honours the AbortSignal so superseded requests are actually cancelled.
 * Type "fail" to see the error state.
 */
const searchFruits = (query: string, signal: AbortSignal): Promise<string[]> =>
  new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      if (query.toLowerCase().includes("fail")) {
        reject(new Error("Simulated request failure."));
        return;
      }
      const q = query.toLowerCase();
      resolve(FRUITS.filter((f) => f.toLowerCase().includes(q)));
    }, 500);

    signal.addEventListener("abort", () => {
      clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

export default function SearchDemo() {
  const [picked, setPicked] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  return (
    <div className="max-w-sm space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Async search (debounced, cancels superseded requests)
        </h2>
        <Search<string>
          fetcher={searchFruits}
          placeholder="Search fruits… (try “berry” or “fail”)"
          onSelect={setPicked}
        />
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Picked: {picked ?? "nothing yet"}
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Controlled query · custom row · min=2
        </h2>
        <Search<string>
          value={query}
          onQueryChange={setQuery}
          min={2}
          debounce={400}
          fetcher={searchFruits}
          renderItem={(f) => (
            <span className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-blue-500" />
              {f}
            </span>
          )}
          onSelect={setPicked}
        />
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Query: {query || "(empty)"}
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Length bounds · min=3, max=10
        </h2>
        <Search<string>
          min={3}
          max={10}
          fetcher={searchFruits}
          placeholder="3–10 characters"
          onSelect={setPicked}
        />
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Type 1–2 chars for the min hint; hit 10 chars for the max warning.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          No upper bound · max="infinite"
        </h2>
        <Search<string>
          max="infinite"
          fetcher={searchFruits}
          placeholder="Type as much as you like"
          onSelect={setPicked}
        />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Disabled
        </h2>
        <Search<string>
          disabled
          fetcher={searchFruits}
          placeholder="Can't type here"
        />
      </section>
    </div>
  );
}
