import type { Role } from "$lib/types/profiles";

export type Tool = {
  id: string;
  label: string;
  href: string;
  icon: string;
  roles: Role[];
};
