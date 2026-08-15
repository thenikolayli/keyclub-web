import type { Profile } from "$lib/types/profiles";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "$lib/db/schema";

declare global {
  namespace App {
    interface Locals {
      profile?: Profile;
      supabase: SupabaseClient<Database>;
    }
  }
}

export {};
