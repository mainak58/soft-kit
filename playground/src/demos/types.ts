import type { ComponentType } from "react";

/** Shared dark-mode state passed to every demo so previews can react to it. */
export interface DemoProps {
  dark: boolean;
  setDark: (next: boolean) => void;
}

/** One entry in the gallery's component list. */
export interface DemoEntry {
  /** Stable id used in the URL hash + as the React key. */
  name: string;
  /** Label shown in the gallery list. */
  label: string;
  /** The preview to render when this entry is selected. */
  Demo: ComponentType<DemoProps>;
}
