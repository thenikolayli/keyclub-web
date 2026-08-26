import type { Role, Tool } from "$lib/auth/types";

export const Tools: Tool[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/admin",
    icon: "lucide:layout-dashboard",
    roles: ["leader", "officer"],
  },
  {
    id: "invites",
    label: "Invites",
    href: "/admin/invites",
    icon: "lucide:user-plus",
    roles: ["officer"],
  },
  {
    id: "calendar",
    label: "Calendar",
    href: "/admin/calendar",
    icon: "lucide:calendar",
    roles: ["leader", "officer"]
  },
  {
    id: "events",
    label: "Log Event",
    href: "/admin/events",
    icon: "lucide:clipboard-check",
    roles: ["officer"],
  }
];

export function getToolsForRole(role: Role | undefined): Tool[] {
  if (!role) return [];
  return Tools.filter((tool) => tool.roles.includes(role));
}
