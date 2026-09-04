import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getProfile } from "$lib/auth/getProfile";

export const prerender = false;

export const load: LayoutServerLoad = async ({ cookies, locals, url }) => {
  let result = await getProfile(locals.supabase);
  if (result.ok) {
    throw redirect(307, "/admin");
  }
};
