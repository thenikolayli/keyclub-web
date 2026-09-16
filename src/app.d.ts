import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "$lib/db/schema";
import type { Profile } from "$lib/auth/types";

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      profile: Profile | undefined;
    }
  }
}

export {};
