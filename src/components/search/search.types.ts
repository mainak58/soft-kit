import type { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/* Types — exported so you can reuse them anywhere:                            */
/*   import { Search } from "@/components/ui/search";                          */
/*   import type { SearchFetcher, SearchProps } from "@/components/ui/search"; */
/* -------------------------------------------------------------------------- */

/** Lifecycle of an async search request. */
export type SearchStatus = "idle" | "loading" | "success" | "empty" | "error";

/**
 * The async data source a consumer plugs in — this is where you call your API.
 *
 * - `query`  : the already-trimmed, debounced search term.
 * - `signal` : an AbortSignal that fires when a newer request supersedes this
 *              one (see `cancelPrevious`). Forward it into axios (`{ signal }`)
 *              or fetch so the in-flight request is actually cancelled.
 */
export type SearchFetcher<T> = (
  query: string,
  signal: AbortSignal
) => Promise<T[]>;

export interface SearchProps<T> {
  /** Where the API call happens. Receives (query, abortSignal). */
  fetcher: SearchFetcher<T>;
  /**
   * PROP 1 — debounce delay in ms. The fetcher only fires once typing has
   * paused for this long. Default: 300.
   */
  debounce?: number;
  /**
   * PROP 2 — when true, typing a new query aborts the previous in-flight
   * request (e.g. "se" -> "sea" cancels the "se" request). Default: true.
   */
  cancelPrevious?: boolean;
  /** Minimum characters before the fetcher runs. Default: 1. */
  minChars?: number;
  /** Seed the input with an initial query. */
  initialQuery?: string;
  /** Called after a successful fetch, with the results and the query used. */
  onSuccess?: (results: T[], query: string) => void;
  /** Called on a real (non-abort) error. */
  onError?: (error: unknown) => void;
  /** Placeholder for the input. */
  placeholder?: string;
  /** Stable React key for a result row. Defaults to the array index. */
  getKey?: (item: T, index: number) => string | number;
  /** Render one result row. Defaults to String(item). */
  renderItem?: (item: T) => ReactNode;
  /** Fires when a result row is chosen (click). */
  onSelect?: (item: T) => void;
  /** Custom node when there are no matches. */
  renderEmpty?: (query: string) => ReactNode;
  /** Custom loading node. */
  renderLoading?: () => ReactNode;
  /** Custom error node. */
  renderError?: (error: string) => ReactNode;
  /** Controlled query value. Omit for uncontrolled use. */
  value?: string;
  /** Notified on every query change (pairs with `value` for controlled use). */
  onQueryChange?: (value: string) => void;
  /** Focus the input on mount. */
  autoFocus?: boolean;
  /** Disable the input. */
  disabled?: boolean;
  /** Extra classes for the root wrapper. */
  className?: string;
  /** Extra classes for the <input>. */
  inputClassName?: string;
  /** Extra classes for the results panel. */
  panelClassName?: string;
}
