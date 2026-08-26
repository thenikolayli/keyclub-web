import type { Database } from "$lib/db/schema";

export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Role = Database["public"]["Tables"]["profiles"]["Row"]["role"];
export type PendingInviteInsert = Database["public"]["Tables"]["pending_invites"]["Insert"];

export type Tool = {
  id: string;
  label: string;
  href: string;
  icon: string;
  roles: Role[];
};
