import ButtonDemo from "./button";
import InputDemo from "./input";
import SidebarDemo from "./sidebar";
import type { DemoEntry } from "./types";

// Register a component here to add it to the gallery list — one line each.
export const demos: DemoEntry[] = [
  { name: "sidebar", label: "Sidebar", Demo: SidebarDemo },
  { name: "button", label: "Button", Demo: ButtonDemo },
  { name: "input", label: "Input", Demo: InputDemo },
];

export type { DemoEntry, DemoProps } from "./types";
