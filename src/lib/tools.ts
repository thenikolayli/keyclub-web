import LayoutDashboardIcon from "@lucide/svelte/icons/layout-dashboard";
import MegaphoneIcon from "@lucide/svelte/icons/megaphone";
import UsersIcon from "@lucide/svelte/icons/users";
import CalendarDaysIcon from "@lucide/svelte/icons/calendar-days";
import MailIcon from "@lucide/svelte/icons/mail";
import RefreshCwIcon from "@lucide/svelte/icons/refresh-cw";
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
    group: "Overview",
  },
  {
    id: "announcements",
    label: "Announcements",
    description: "Post club announcements",
    href: "/admin/announcements",
    icon: MegaphoneIcon,
    roles: ["officer"],
    group: "Communication",
  },
  {
    id: "members",
    label: "Members",
    description: "Manage members",
    href: "/admin/members",
    icon: UsersIcon,
    roles: ["leader", "officer"],
    group: "Management",
  },
  {
    id: "events",
    label: "Events",
    description: "Manage events",
    href: "/admin/events",
    icon: CalendarDaysIcon,
    roles: ["leader", "officer"],
    group: "Management",
  },
  {
    id: "invites",
    label: "Invites",
    description: "Send invites",
    href: "/admin/invites",
    icon: MailIcon,
    roles: ["officer"],
    group: "Management",
  },
  {
    id: "sync",
    label: "Sync",
    description: "Sync data",
    href: "/admin/sync",
    icon: RefreshCwIcon,
    roles: ["officer", "leader"],
    group: "Management",
  },
];

export function getToolsForRole(role: Role | undefined): Tool[] {
  if (!role) return [];
  return Tools.filter((tool) => tool.roles.includes(role));
}
