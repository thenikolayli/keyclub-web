import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getProfile } from "$lib/auth/getProfile";

export const prerender = false;

export const load: PageServerLoad = async ({ cookies, locals }) => {
  let result = await getProfile(locals.supabase);
  if (result.ok) {
    throw redirect(307, "/admin");
  }
};
