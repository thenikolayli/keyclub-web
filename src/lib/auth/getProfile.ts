import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "$lib/db/schema";
import type { Result } from "$lib/responses";
import { ok, fail } from "$lib/responses";
import type { Profile } from "$lib/auth/types";
import { supabaseAdmin as supabaseAdmin } from "$lib/db/admin";

export async function getProfile(supabase: SupabaseClient<Database>): Promise<Result<Profile>> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return fail(userError.message, userError);
  }

  if (userData.user) {
    const { data: profileData } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();
    if (profileData) {
      return ok(profileData);
    }
  }

  return fail("Profile not found");
}
