"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { cn } from "../../lib/cn";
import {
  tabIndicatorVariants,
  tabListVariants,
  tabTriggerVariants,
} from "./tab-switcher.styles";
import type { TabSwitcherProps } from "./tab-switcher.types";

// Run layout measurements before paint on the client; fall back to useEffect
// during SSR so Next.js App Router doesn't warn.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const Tab = forwardRef<HTMLDivElement, TabSwitcherProps>(function TabSwitcher(
  {
    tabs,
    value,
    defaultValue,
    onChange,
    variant = "underline",
    fitted = false,
    className,
    "aria-label": ariaLabel,
  },
  ref
) {
  const uid = useId();
  const isControlled = value !== undefined;

  const firstEnabled = tabs.find((t) => !t.disabled)?.id ?? tabs[0]?.id ?? "";
  const [internal, setInternal] = useState(defaultValue ?? firstEnabled);
  const activeId = isControlled ? (value as string) : internal;

  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  // Skip the slide transition on the very first measurement (no jump from 0).
  const [ready, setReady] = useState(false);

  const measure = useCallback(() => {
    const el = tabRefs.current[activeId];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeId]);

  useIsoLayoutEffect(() => {
    measure();
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [measure, tabs, variant, fitted]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const selectTab = useCallback(
    (id: string) => {
      if (!isControlled) setInternal(id);
      onChange?.(id);
    },
    [isControlled, onChange]
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabled = tabs.filter((t) => !t.disabled);
    if (enabled.length === 0) return;
    const current = enabled.findIndex((t) => t.id === activeId);

    let nextIndex: number | null = null;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (current + 1) % enabled.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (current - 1 + enabled.length) % enabled.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = enabled.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const next = enabled[nextIndex];
    selectTab(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const activeTab = tabs.find((t) => t.id === activeId);
  const hasPanels = tabs.some((t) => t.content !== undefined);

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className={tabListVariants({ variant, fitted: fitted ? "true" : "false" })}
      >
        {/* Sliding active indicator */}
        {indicator.width > 0 && (
          <span
            aria-hidden="true"
            className={cn(
              tabIndicatorVariants({ variant }),
              !ready && "!transition-none"
            )}
            style={{
              transform: `translateX(${indicator.left}px)`,
              width: indicator.width,
            }}
          />
        )}

        {tabs.map((tab) => {
          const active = tab.id === activeId;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${tab.id}`}
              aria-selected={active}
              aria-controls={
                tab.content !== undefined ? `${uid}-panel-${tab.id}` : undefined
              }
              tabIndex={active ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => selectTab(tab.id)}
              className={tabTriggerVariants({
                variant,
                active: active ? "true" : "false",
                fitted: fitted ? "true" : "false",
              })}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {hasPanels && (
        <div className="pt-4">
          {activeTab?.content !== undefined && (
            <div
              key={activeId}
              role="tabpanel"
              id={`${uid}-panel-${activeId}`}
              aria-labelledby={`${uid}-tab-${activeId}`}
              tabIndex={0}
              className="sk-tab-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
            >
              {activeTab.content}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

const TabSwitcher = Tab;
TabSwitcher.displayName = "TabSwitcher";

export { TabSwitcher };
