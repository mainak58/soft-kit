"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search as SearchIcon, X } from "lucide-react";
import { cn } from "../../lib/cn";
import {
  searchClearBtn,
  searchEmptyRow,
  searchErrorRow,
  searchField,
  searchLeadingIcon,
  searchLoadingRow,
  searchOption,
  searchPanel,
  searchRoot,
  searchSpinner,
} from "./search.styles";
import type { SearchProps, SearchStatus } from "./search.types";

/**
 * A generic, reusable search box. You supply the API call via `fetcher`; the
 * component debounces input, cancels superseded requests, and renders the
 * results in a dropdown. It is generic over the result type `T`, so pass
 * `renderItem` / `onSelect` typed to your own shape.
 *
 *   <Search<Customer>
 *     debounce={400}
 *     cancelPrevious
 *     fetcher={searchCustomers}
 *     renderItem={(c) => c.name}
 *     onSelect={setCustomer}
 *   />
 */
function Search<T>({
  fetcher,
  debounce = 300,
  cancelPrevious = true,
  minChars = 1,
  initialQuery = "",
  onSuccess,
  onError,
  placeholder = "Search…",
  getKey,
  renderItem,
  onSelect,
  renderEmpty,
  renderLoading,
  renderError,
  value,
  onQueryChange,
  autoFocus,
  disabled,
  className,
  inputClassName,
  panelClassName,
}: SearchProps<T>) {
  const [internalQuery, setInternalQuery] = useState(value ?? initialQuery);
  const [results, setResults] = useState<T[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  // `value` (if provided) makes the input controlled; otherwise state owns it.
  const query = value ?? internalQuery;

  // Hold the latest fetcher/callbacks in refs so run()'s identity is stable and
  // the debounce effect doesn't re-fire just because a parent re-rendered.
  const fetcherRef = useRef(fetcher);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    fetcherRef.current = fetcher;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  });

  // The controller for the request in flight, so a newer query can abort it.
  // A monotonic run id additionally discards an older request that resolves
  // *after* a newer one (even when cancelPrevious is off).
  const controllerRef = useRef<AbortController | null>(null);
  const runIdRef = useRef(0);

  const run = useCallback(
    (raw: string) => {
      const q = raw.trim();
      const runId = ++runIdRef.current;

      // Abort whatever was in flight before starting the next request.
      if (cancelPrevious) {
        controllerRef.current?.abort();
      }

      if (q.length < minChars) {
        controllerRef.current = null;
        setResults([]);
        setError(null);
        setStatus("idle");
        return;
      }

      const controller = new AbortController();
      controllerRef.current = controller;
      setStatus("loading");
      setError(null);

      fetcherRef
        .current(q, controller.signal)
        .then((data) => {
          if (runId !== runIdRef.current) return; // superseded by a newer query
          const list = data ?? [];
          setResults(list);
          setStatus(list.length ? "success" : "empty");
          onSuccessRef.current?.(list, q);
        })
        .catch((err) => {
          // Aborts are intentional — never surface them as errors.
          if (controller.signal.aborted) return;
          if (runId !== runIdRef.current) return;
          const message =
            err instanceof Error
              ? err.message
              : "Couldn't load results. Check your connection and try again.";
          setResults([]);
          setError(message);
          setStatus("error");
          onErrorRef.current?.(err);
        });
    },
    [cancelPrevious, minChars]
  );

  // Debounce: fire the search `debounce` ms after the query last changed.
  useEffect(() => {
    const id = setTimeout(() => run(query), debounce);
    return () => clearTimeout(id);
  }, [query, debounce, run]);

  // Abort any straggler request on unmount.
  useEffect(() => () => controllerRef.current?.abort(), []);

  const handleChange = (next: string) => {
    if (value === undefined) setInternalQuery(next);
    onQueryChange?.(next);
  };
  const handleClear = () => {
    controllerRef.current?.abort();
    runIdRef.current += 1;
    if (value === undefined) setInternalQuery("");
    setResults([]);
    setError(null);
    setStatus("idle");
    onQueryChange?.("");
  };

  const showPanel = query.trim().length >= minChars && status !== "idle";

  return (
    <div className={cn(searchRoot, className)}>
      <div className="relative">
        <SearchIcon className={searchLeadingIcon} />
        <input
          type="text"
          role="searchbox"
          value={query}
          autoFocus={autoFocus}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => handleChange(e.target.value)}
          className={cn(searchField, inputClassName)}
        />
        {/* Trailing affordance: spinner while loading, clear button otherwise. */}
        {status === "loading" ? (
          <Loader2 className={searchSpinner} />
        ) : (
          query.length > 0 && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={handleClear}
              className={searchClearBtn}
            >
              <X className="size-4" />
            </button>
          )
        )}
      </div>

      {showPanel && (
        <div role="listbox" className={cn(searchPanel, panelClassName)}>
          {status === "loading" &&
            (renderLoading?.() ?? (
              <div className={searchLoadingRow}>
                <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
                Searching…
              </div>
            ))}

          {status === "error" &&
            (renderError?.(error ?? "Couldn't load results. Try again.") ?? (
              <p className={searchErrorRow}>
                {error ?? "Couldn't load results. Try again."}
              </p>
            ))}

          {status === "empty" &&
            (renderEmpty?.(query) ?? (
              <p className={searchEmptyRow}>No results for “{query.trim()}”</p>
            ))}

          {status === "success" &&
            results.map((item, index) => (
              <button
                key={getKey?.(item, index) ?? index}
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => onSelect?.(item)}
                className={searchOption}
              >
                {renderItem?.(item) ?? String(item)}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

Search.displayName = "Search";

export { Search };
