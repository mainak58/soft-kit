/** A selectable value — strings or numbers both work as unique keys. */
export type OptionValue = string | number;

export interface DropdownOption {
  /** Text shown in the list and (when selected) on the trigger. */
  label: string;
  /** Unique identifier passed back through onChange / onApply. */
  value: OptionValue;
  /** Render this single option as unselectable. */
  disabled?: boolean;
}

export interface DropdownProps {
  /** List of selectable items. */
  options: DropdownOption[];
  /**
   * Controlled selection. Pass a single value for single-select, an array for
   * multi-select. Omit to let the dropdown manage its own state.
   */
  value?: OptionValue | OptionValue[];
  /**
   * Fires on every change (immediate mode). Receives a single value in
   * single-select and an array in multi-select. Ignored while `onApply` is set.
   */
  onChange?: (value: OptionValue | OptionValue[]) => void;
  /** Text shown when nothing is selected. */
  placeholder?: string;
  /** Render the search field inside the panel. When false it is not in the DOM. */
  showSearch?: boolean;
  /** Enable multi-select with checkboxes; the panel stays open while picking. */
  multiSelect?: boolean;
  /**
   * When provided, the panel shows Apply / Cancel and defers committing the
   * selection until Apply is clicked. Cancel (and dismissing the panel) reverts
   * to the last applied selection.
   */
  onApply?: (value: OptionValue | OptionValue[]) => void;
  /** Disable the whole control. */
  disabled?: boolean;
  /**
   * Extra classes for the root element. Merged with tailwind-merge so a passed
   * utility overrides the internal one (e.g. `m-4` replaces the default `m-2`).
   */
  className?: string;
}
