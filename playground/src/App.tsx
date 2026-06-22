import { useEffect, useState } from "react";
import { demos } from "./demos";

export default function App() {
  const [dark, setDark] = useState(false);
  // Selected component — initialised from the URL hash so reloads keep your spot.
  const [selected, setSelected] = useState(
    () => window.location.hash.slice(1) || demos[0].name
  );

  // Apply dark mode globally by toggling the `dark` class on <html>.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Keep the URL hash in sync so refresh/links land on the same component.
  useEffect(() => {
    window.location.hash = selected;
  }, [selected]);

  const active = demos.find((d) => d.name === selected) ?? demos[0];
  const { Demo } = active;

  return (
    <div className="flex h-screen bg-gray-50 font-sans dark:bg-gray-900">
      {/* Gallery list — pick a component */}
      <nav className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="flex h-14 items-center px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
          soft-kit
        </div>
        <ul className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {demos.map((d) => {
            const isActive = d.name === active.name;
            return (
              <li key={d.name}>
                <button
                  type="button"
                  onClick={() => setSelected(d.name)}
                  className={
                    "w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-colors " +
                    (isActive
                      ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100")
                  }
                >
                  {d.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Preview area — one component at a time */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
          <h1 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {active.label}
          </h1>
          <button
            type="button"
            onClick={() => setDark((v) => !v)}
            className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {dark ? "Light mode" : "Dark mode"}
          </button>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <Demo dark={dark} setDark={setDark} />
        </main>
      </div>
    </div>
  );
}
