import type { Tool } from "$lib/types/tools";
import type { Role } from "$lib/types/profiles";

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
  }
];

export function getToolsForRole(role: Role | undefined): Tool[] {
  if (!role) return [];
  return Tools.filter((tool) => tool.roles.includes(role));
}
