/**
 * Search style fragments — plain Tailwind utilities with dark: variants.
 * Like the sidebar and dropdown, the search box has no variant/size table:
 * its states (loading / empty / error / success) are simple and handled
 * inline with cn() in the component, so there's nothing to model with
 * variants() here — just composable class-name constants.
 */

export const searchRoot = "relative w-full font-sans";

export const searchField = [
  "h-10 w-full rounded-lg border pr-8 pl-8 text-sm",
  "border-gray-300 bg-white text-gray-900",
  "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100",
  "outline-none transition-colors duration-200",
  "placeholder:text-gray-400 dark:placeholder:text-gray-500",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

export const searchLeadingIcon = [
  "pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2",
  "text-gray-400 dark:text-gray-500",
].join(" ");

export const searchSpinner = [
  "absolute top-1/2 right-2.5 size-4 -translate-y-1/2 animate-spin motion-reduce:animate-none",
  "text-gray-400 dark:text-gray-500",
].join(" ");

export const searchClearBtn = [
  "absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-0.5",
  "text-gray-400 transition-colors dark:text-gray-500",
  "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100",
].join(" ");

export const searchPanel = [
  "absolute z-50 mt-1.5 max-h-72 w-full overflow-y-auto rounded-lg border p-1 shadow-lg",
  "border-gray-200 bg-white text-gray-900",
  "dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100",
].join(" ");

export const searchLoadingRow = [
  "flex items-center justify-center gap-2 px-3 py-6 text-sm",
  "text-gray-400 dark:text-gray-500",
].join(" ");

export const searchEmptyRow = [
  "px-3 py-6 text-center text-sm text-gray-400 dark:text-gray-500",
].join(" ");

export const searchErrorRow = [
  "px-3 py-6 text-center text-sm text-red-600 dark:text-red-400",
].join(" ");

export const searchOption = [
  "flex w-full items-center rounded-md px-2.5 py-2 text-left text-sm",
  "text-gray-700 transition-colors dark:text-gray-200",
  "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100",
  "focus-visible:bg-gray-100 focus-visible:outline-none dark:focus-visible:bg-gray-800",
].join(" ");
