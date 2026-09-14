import type { LayoutServerLoad } from "./$types";
import { getToolsForRole } from "$lib/auth/tools";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ locals, url }) => {
  if (!locals.profile) {
    // error getting profile OR user is not authenticated
    throw redirect(307, "/signin");
  }

  const tools = getToolsForRole(locals.profile.role);
  for (const tool of tools) {
    if (
      tool.href == url.pathname &&
      !tool.roles.includes(locals.profile.role)
    ) {
      throw redirect(307, "/admin");
    }
  }
};
