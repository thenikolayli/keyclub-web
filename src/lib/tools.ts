import LayoutDashboardIcon from "@lucide/svelte/icons/layout-dashboard";
import UserPlusIcon from "@lucide/svelte/icons/user-plus";
import type { Tool } from "$lib/types/tools";
import type { Role } from "$lib/types/profiles";

export const Tools: Tool[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Overview of the club",
    href: "/admin",
    icon: LayoutDashboardIcon,
    roles: ["leader", "officer"],
  },
  {
    id: "invites",
    label: "Invites",
    description: "Send invites",
    href: "/admin/invites",
    icon: UserPlusIcon,
    roles: ["officer"],
  },
];

export function getToolsForRole(role: Role | undefined): Tool[] {
  if (!role) return [];
  return Tools.filter((tool) => tool.roles.includes(role));
}
