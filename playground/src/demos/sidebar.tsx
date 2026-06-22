import {
  BarChart3,
  FileText,
  Folder,
  Home,
  LifeBuoy,
  Settings,
  Users,
} from "lucide-react";
import { Sidebar } from "../../../src/components/sidebar";
import type { SidebarItem } from "../../../src/components/sidebar";
import type { DemoProps } from "./types";

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

export default function SidebarDemo({ dark, setDark }: DemoProps) {
  return (
    <div className="flex h-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      <Sidebar
        items={items}
        footerItems={footerItems}
        activePath="/analytics"
        title="soft-kit"
        // h-full overrides the component's default h-screen so it fits the
        // preview area (no clipping / no scroll) inside the gallery.
        className="h-full"
        // Pass darkMode → the toggle button appears at the bottom.
        // Remove these two props to confirm the button disappears.
        darkMode={dark}
        onDarkModeChange={setDark}
      />
      <div className="flex-1 p-8 text-sm text-gray-500 dark:text-gray-400">
        Sidebar preview — click the toggle at the bottom of the sidebar to flip
        the theme.
      </div>
    </div>
  );
}
