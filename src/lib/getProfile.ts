import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "$lib/db/schema";
import type { Result } from "$lib/types/responses";
import type { Profile } from "$lib/types/profiles";
import { supabase as supabaseAdmin } from "$lib/db/admin";

export async function getProfile(supabase: SupabaseClient<Database>): Promise<Result<Profile>> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return { ok: false, error: userError.message };
  }

  if (userData.user) {
    const { data: profileData } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();
    if (profileData) {
      return { ok: true, data: profileData };
    }
  }

  return { ok: false, error: "Profile not found" };
}
