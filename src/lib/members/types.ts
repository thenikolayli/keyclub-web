import type { Database } from "$lib/db/schema";

export type Member = Database["public"]["Tables"]["members"]["Row"];
export type MemberToken = Database["public"]["Tables"]["member_tokens"]["Row"];
