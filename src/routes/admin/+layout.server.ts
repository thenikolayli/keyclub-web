import type { LayoutServerLoad } from "./$types";
import { getToolsForRole } from "$lib/auth/tools";
import { redirect } from "@sveltejs/kit";
import { getProfile } from "$lib/auth/getProfile";

export const load: LayoutServerLoad = async ({ cookies, locals, url }) => {
  let result = await getProfile(locals.supabase);
  if (!result.ok) { // error getting profile OR user is not authenticated
    throw redirect(307, "/signin");
  }

  const tools = getToolsForRole(result.data.role);
  for (const tool of tools) {
    if (tool.href == url.pathname && !tool.roles.includes(result.data.role)) {
      throw redirect(307, "/admin");
    }
  }

  return {
    cookies: cookies.getAll(),
    profile: result.data,
  };
};
