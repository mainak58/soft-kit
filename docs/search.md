# Search

A generic, async search box. You supply the API call via `fetcher`; the component
debounces typing, cancels superseded requests, and renders the results in a dropdown.
It is generic over the result type `T`.

## Install

```bash
npx soft-kit add search
```

Installs `lucide-react` (used for the search / spinner / clear icons). No CSS is appended.

## Import

```tsx
import { Search } from "@/components/ui/search";
import type { SearchFetcher } from "@/components/ui/search";
```

## Usage

```tsx
type Customer = { id: string; name: string };

const searchCustomers: SearchFetcher<Customer> = async (query, signal) => {
  const res = await fetch(`/api/customers?q=${encodeURIComponent(query)}`, { signal });
  return res.json();
};

// Uncontrolled
<Search<Customer>
  fetcher={searchCustomers}
  debounce={400}
  cancelPrevious
  placeholder="Search customers…"
  renderItem={(c) => c.name}
  getKey={(c) => c.id}
  onSelect={(c) => console.log("picked", c)}
/>

// Controlled query
const [q, setQ] = useState("");
<Search<Customer>
  value={q}
  onQueryChange={setQ}
  fetcher={searchCustomers}
  renderItem={(c) => c.name}
/>
```

> **Forward the `signal`.** Pass the second `fetcher` argument into `fetch({ signal })`
> or axios (`{ signal }`) so superseded requests are actually aborted — otherwise
> `cancelPrevious` only discards the stale response, it can't cancel the network call.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fetcher` | `SearchFetcher<T>` | — | **Required.** `(query, signal) => Promise<T[]>` — where the API call happens. |
| `debounce` | `number` | `300` | Delay (ms) after typing stops before the fetcher fires. |
| `cancelPrevious` | `boolean` | `true` | Abort the previous in-flight request when a newer query starts. |
| `minChars` | `number` | `1` | Minimum characters before the fetcher runs. |
| `initialQuery` | `string` | `""` | Seed the input (uncontrolled). |
| `value` | `string` | — | Controlled query value (pair with `onQueryChange`). |
| `onQueryChange` | `(value: string) => void` | — | Notified on every query change. |
| `onSuccess` | `(results: T[], query: string) => void` | — | Fired after a successful fetch. |
| `onError` | `(error: unknown) => void` | — | Fired on a real (non-abort) error. |
| `onSelect` | `(item: T) => void` | — | Fired when a result row is clicked. |
| `getKey` | `(item: T, index: number) => string \| number` | index | Stable React key for a row. |
| `renderItem` | `(item: T) => ReactNode` | `String(item)` | Render one result row. |
| `renderEmpty` | `(query: string) => ReactNode` | built-in | Custom "no results" node. |
| `renderLoading` | `() => ReactNode` | built-in | Custom loading node. |
| `renderError` | `(error: string) => ReactNode` | built-in | Custom error node. |
| `placeholder` | `string` | `"Search…"` | Input placeholder. |
| `autoFocus` | `boolean` | — | Focus the input on mount. |
| `disabled` | `boolean` | — | Disable the input. |
| `className` | `string` | — | Extra classes for the root wrapper. |
| `inputClassName` | `string` | — | Extra classes for the `<input>`. |
| `panelClassName` | `string` | — | Extra classes for the results panel. |

### `SearchFetcher<T>`

```ts
type SearchFetcher<T> = (query: string, signal: AbortSignal) => Promise<T[]>;
```

`query` is already trimmed and debounced; `signal` fires when a newer request supersedes
this one.

## Notes

- Plain Tailwind + `dark:` variants. Depends on `lucide-react`.
- A monotonic run id discards a stale response that resolves *after* a newer one, even
  when `cancelPrevious` is off.
- Accessible by default: the panel is a `listbox` with `option` rows, and the spinners
  honour `prefers-reduced-motion` (`motion-reduce:animate-none`).
