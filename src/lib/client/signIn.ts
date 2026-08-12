import type { Result } from "$lib/types/responses";
import type { SignInRequest } from "$lib/types/signIn";
import type { SupabaseClient } from "@supabase/supabase-js";

// since this is not an api endpoint, but a client-side function, it simply returns a Result type.
export const signInEmailPassword = async (
  signInRequest: SignInRequest,
  supabase: SupabaseClient,
): Promise<Result<null>> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: signInRequest.email,
    password: signInRequest.password,
  });

  if (error) {
    return { ok: false, error };
  }

  return { ok: true, data: null };
};
