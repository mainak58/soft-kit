import { useState } from "react";
import {
  BarChart3,
  FileText,
  Folder,
  Home,
  LifeBuoy,
  Settings,
  Users,
} from "lucide-react";
// Import the component SOURCE directly — edits to src/components/sidebar
// hot-reload here instantly, no CLI/registry round-trip needed.
import { Sidebar } from "../../src/components/sidebar";
import type { SidebarItem } from "../../src/components/sidebar";

const items: SidebarItem[] = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Analytics", icon: BarChart3, href: "/analytics", badge: 3 },
  {
    name: "Projects",
    icon: Folder,
    children: [
      { name: "Active", icon: FileText, href: "/projects/active" },
      { name: "Archived", icon: FileText, href: "/projects/archived" },
    ],
  },
  { name: "Team", icon: Users, href: "/team", badge: "!" },
];

const footerItems: SidebarItem[] = [
  { name: "Support", icon: LifeBuoy, href: "/support" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function App() {
  const [dark, setDark] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        items={items}
        footerItems={footerItems}
        activePath="/analytics"
        title="Acme Inc"
        // Pass darkMode → the toggle button appears at the bottom.
        // Delete these two lines to confirm the button disappears.
        darkMode={dark}
        onDarkModeChange={(next) => {
          setDark(next);
          document.documentElement.classList.toggle("dark", next);
        }}
      />

      <main className="flex-1 p-10">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Playground
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Theme is currently <strong>{dark ? "dark" : "light"}</strong>. Edit{" "}
          <code>src/components/sidebar/*</code> and watch it update live.
        </p>
      </main>
    </div>
  );
}
