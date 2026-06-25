import type { ReactNode } from "react";

export interface TabItem {
  /** Unique, stable identifier for the tab. */
  id: string;
  /** Visible label (text or a node, e.g. icon + text). */
  label: ReactNode;
  /** Panel content rendered when this tab is active. Optional — omit if you
   *  render content yourself in controlled mode. */
  content?: ReactNode;
  /** Disable selection of this tab. */
  disabled?: boolean;
}

export interface TabSwitcherProps {
  /** The tabs to render. */
  tabs: TabItem[];
  /** Controlled active tab id. Provide together with `onChange`. */
  value?: string;
  /** Initial active tab id for uncontrolled use. Defaults to the first enabled tab. */
  defaultValue?: string;
  /** Called with the new tab id whenever the active tab changes. */
  onChange?: (id: string) => void;
  /** Visual style. `underline` (default) slides a bar; `pill` slides a chip. */
  variant?: "underline" | "pill";
  /** Stretch tabs to fill the available width, splitting it evenly. */
  fitted?: boolean;
  /** Accessible label for the tab list (recommended for screen readers). */
  "aria-label"?: string;
  /** Extra classes for the root wrapper. */
  className?: string;
}
