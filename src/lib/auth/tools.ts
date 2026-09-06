import type { Role, Tool } from "$lib/auth/types";

export const Tools: Tool[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/admin",
    icon: "solar:sofa-2-linear",
    roles: ["leader", "officer"],
  },
  {
    id: "invites",
    label: "Invites",
    href: "/admin/invites",
    icon: "solar:user-plus-outline",
    roles: ["officer"],
  },
  {
    id: "calendar",
    label: "Calendar",
    href: "/admin/calendar",
    icon: "solar:calendar-add-outline",
    roles: ["leader", "officer"]
  },
  {
    id: "events",
    label: "Log Event",
    href: "/admin/events",
    icon: "solar:clipboard-check-outline",
    roles: ["officer"],
  }
];

export function getToolsForRole(role: Role | undefined): Tool[] {
  if (!role) return [];
  return Tools.filter((tool) => tool.roles.includes(role));
}
