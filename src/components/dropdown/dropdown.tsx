"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "../../lib/cn";
import {
  dropdownApplyBtn,
  dropdownCancelBtn,
  dropdownCheckbox,
  dropdownEmpty,
  dropdownFooter,
  dropdownList,
  dropdownOptionBase,
  dropdownPanel,
  dropdownRoot,
  dropdownSearch,
  dropdownTrigger,
} from "./dropdown.styles";
import type { DropdownOption, DropdownProps, OptionValue } from "./dropdown.types";

/** Normalize a controlled value (single | array | undefined) to an array. */
const toArray = (v?: OptionValue | OptionValue[]): OptionValue[] =>
  v == null ? [] : Array.isArray(v) ? v : [v];

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select...",
      showSearch = true,
      multiSelect = false,
      onApply,
      disabled = false,
      className,
    },
    ref
  ) => {
    const deferred = typeof onApply === "function";
    const isControlled = value !== undefined;

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [internal, setInternal] = useState<OptionValue[]>(() => toArray(value));
    const [draft, setDraft] = useState<OptionValue[]>(() => toArray(value));

    // The last-committed selection, and the one the panel currently reflects.
    const committed = isControlled ? toArray(value) : internal;
    const selected = deferred ? draft : committed;

    const rootRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Latest values for the document listeners, which only bind on open.
    const stateRef = useRef({ deferred, committed });
    stateRef.current = { deferred, committed };

    const setRootRef = (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    // Dismiss on outside mousedown or Escape — staged changes are discarded.
    useEffect(() => {
      if (!open) return;
      const dismiss = () => {
        const s = stateRef.current;
        if (s.deferred) setDraft(s.committed);
        setOpen(false);
      };
      const onPointer = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          dismiss();
        }
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") dismiss();
      };
      document.addEventListener("mousedown", onPointer);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("mousedown", onPointer);
        document.removeEventListener("keydown", onKey);
      };
    }, [open]);

    // Auto-focus the search field when the panel opens.
    useEffect(() => {
      if (open && showSearch) searchRef.current?.focus();
    }, [open, showSearch]);

    const labelFor = (v: OptionValue) =>
      options.find((o) => o.value === v)?.label ?? String(v);

    const query = search.trim().toLowerCase();
    const filtered = query
      ? options.filter((o) => o.label.toLowerCase().includes(query))
      : options;

    const openPanel = () => {
      setSearch("");
      setDraft(committed);
      setOpen(true);
    };
    const closePanel = () => {
      if (deferred) setDraft(committed);
      setOpen(false);
    };

    const commit = (next: OptionValue[]) => {
      if (!isControlled) setInternal(next);
      onChange?.(multiSelect ? next : next[0]);
    };

    const handleSelect = (opt: DropdownOption) => {
      if (opt.disabled) return;
      if (multiSelect) {
        const exists = selected.some((s) => s === opt.value);
        const next = exists
          ? selected.filter((s) => s !== opt.value)
          : [...selected, opt.value];
        if (deferred) setDraft(next);
        else commit(next);
        // Multi-select keeps the panel open so the user can keep picking.
      } else {
        const next = [opt.value];
        if (deferred) {
          setDraft(next);
        } else {
          commit(next);
          setOpen(false); // single-select commits and closes immediately
        }
      }
    };

    const handleApply = () => {
      if (!isControlled) setInternal(draft);
      onApply?.(multiSelect ? draft : draft[0]);
      setOpen(false);
    };

    const handleCancel = () => {
      setDraft(committed);
      setOpen(false);
    };

    // The trigger shows the committed (last-applied) selection.
    let triggerLabel: string;
    let isPlaceholder = false;
    if (committed.length === 0) {
      triggerLabel = placeholder;
      isPlaceholder = true;
    } else if (!multiSelect || committed.length === 1) {
      triggerLabel = labelFor(committed[0]);
    } else {
      triggerLabel = `${committed.length} selected`;
    }

    return (
      <div ref={setRootRef} className={cn(dropdownRoot, className)}>
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          data-state={open ? "open" : "closed"}
          onClick={() => (open ? closePanel() : openPanel())}
          className={dropdownTrigger}
        >
          <span
            className={cn(
              "truncate",
              isPlaceholder && "text-gray-400 dark:text-gray-500"
            )}
            title={isPlaceholder ? undefined : triggerLabel}
          >
            {triggerLabel}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-gray-400 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>

        {open && (
          <div
            role="listbox"
            aria-multiselectable={multiSelect}
            className={cn(dropdownPanel, "sk-dropdown")}
          >
            {showSearch && (
              <div className={dropdownSearch}>
                <Search className="size-4 shrink-0 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  aria-label="Search options"
                  className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
                />
              </div>
            )}

            <div className={dropdownList}>
              {options.length === 0 ? (
                <p className={dropdownEmpty}>No options</p>
              ) : filtered.length === 0 ? (
                <p className={dropdownEmpty}>No results found</p>
              ) : (
                filtered.map((opt) => {
                  const isChecked = selected.some((s) => s === opt.value);
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      role="option"
                      aria-selected={isChecked}
                      disabled={opt.disabled}
                      title={opt.label}
                      onClick={() => handleSelect(opt)}
                      className={cn(
                        dropdownOptionBase,
                        isChecked &&
                          !multiSelect &&
                          "bg-blue-50 font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
                        opt.disabled && "pointer-events-none opacity-40"
                      )}
                    >
                      {multiSelect && (
                        <span
                          className={cn(
                            dropdownCheckbox,
                            isChecked
                              ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500"
                              : "border-gray-300 dark:border-gray-600"
                          )}
                        >
                          {isChecked && (
                            <Check className="size-3" strokeWidth={3} />
                          )}
                        </span>
                      )}
                      <span className="truncate">{opt.label}</span>
                      {!multiSelect && isChecked && (
                        <Check className="ml-auto size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {deferred && (
              <div className={dropdownFooter}>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={dropdownCancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className={dropdownApplyBtn}
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

export { Dropdown };
