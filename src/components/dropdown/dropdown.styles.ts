/**
 * Dropdown style fragments — plain Tailwind utilities with dark: variants.
 * Like the sidebar, the dropdown's states (open / selected / checked) are
 * simple booleans handled inline with cn() in the component, so there's no
 * variant/size table to model with variants() here.
 */

export const dropdownRoot = [
  "relative inline-block m-2 min-w-[12rem] text-left align-top font-sans",
].join(" ");

export const dropdownTrigger = [
  "flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm",
  "border-gray-300 bg-white text-gray-900",
  "dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100",
  "cursor-pointer select-none transition-colors duration-200",
  "hover:bg-gray-50 dark:hover:bg-gray-900",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400",
  "data-[state=open]:border-blue-500 dark:data-[state=open]:border-blue-400",
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-gray-950",
].join(" ");

export const dropdownPanel = [
  "absolute left-0 z-50 mt-1.5 w-full overflow-hidden rounded-md border shadow-lg",
  "border-gray-200 bg-white text-gray-900",
  "dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100",
].join(" ");

export const dropdownSearch = [
  "flex items-center gap-2 border-b px-3 py-2",
  "border-gray-200 dark:border-gray-800",
].join(" ");

export const dropdownList = "max-h-60 overflow-y-auto p-1";

export const dropdownOptionBase = [
  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm",
  "cursor-pointer select-none text-gray-700 dark:text-gray-200",
  "transition-colors duration-150",
  "hover:bg-gray-100 dark:hover:bg-gray-800",
  "focus-visible:outline-none focus-visible:bg-gray-100 dark:focus-visible:bg-gray-800",
].join(" ");

export const dropdownCheckbox = [
  "flex size-4 shrink-0 items-center justify-center rounded border transition-colors duration-150",
].join(" ");

export const dropdownEmpty = [
  "px-3 py-6 text-center text-sm text-gray-400 dark:text-gray-500",
].join(" ");

export const dropdownFooter = [
  "flex items-center justify-end gap-2 border-t px-2 py-2",
  "border-gray-200 dark:border-gray-800",
].join(" ");

const actionBase = [
  "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium",
  "cursor-pointer select-none transition-colors duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400",
].join(" ");

export const dropdownCancelBtn = [
  actionBase,
  "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
].join(" ");

export const dropdownApplyBtn = [
  actionBase,
  "bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800",
  "dark:bg-blue-500 dark:hover:bg-blue-400 dark:active:bg-blue-600",
].join(" ");
