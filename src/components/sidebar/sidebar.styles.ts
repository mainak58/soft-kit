/**
 * Sidebar style fragments — plain Tailwind utilities with dark: variants.
 * No variants() needed here: the sidebar's states are simple booleans
 * (collapsed / active / open) handled inline with cn() in the component.
 */

export const sidebarAside = [
  "flex h-screen shrink-0 flex-col font-sans",
  "border-r border-gray-200 bg-white text-gray-900",
  "dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100",
  "transition-[width] duration-300 ease-in-out",
].join(" ");

export const sidebarSearch = [
  "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm",
  "border border-gray-200 dark:border-gray-800",
  "transition-colors duration-200",
  "focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30",
].join(" ");

export const sidebarTooltip = [
  "pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2",
  "whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium shadow-md",
  "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900",
  "opacity-0 transition-opacity duration-150 group-hover/tip:opacity-100",
].join(" ");

export const sidebarRowBase = [
  "group/row relative mx-1 flex cursor-pointer items-center rounded-lg py-2 text-sm",
  "transition-all duration-200 ease-out active:scale-[0.97]",
].join(" ");
