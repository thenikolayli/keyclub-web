import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { supabase as supabaseAdmin } from "$lib/db/admin";

export const prerender = false;

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const {
    data: { user },
    error: userError,
  } = await locals.supabase.auth.getUser();

  if (!user) {
    // Only enforce auth on protected admin routes, not on the sign-in page itself.
    if (url.pathname !== "/admin/signin") {
      throw redirect(307, "/admin/signin");
    }

    return { profile: null };
  }

  // Uses admin client to bypass RLS on the `profiles` table.
  // It's more secure that way
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  locals.profile = profile ?? undefined;
  return { profile: profile ?? null };
};
