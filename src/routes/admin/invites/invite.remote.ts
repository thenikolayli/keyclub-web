import { form } from "$app/server";
import * as v from "valibot";
import { supabaseAdmin } from "$lib/db/admin";
import { ok, fail } from "$lib/responses";
import type { Result } from "$lib/responses";
import { getRequestEvent } from "$app/server";

export const invite = form(
  v.object({
    email: v.pipe(v.string(), v.trim(), v.email(), v.toLowerCase()),
    role: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.toLowerCase()),
  }),
  async ({ email, role }): Promise<Result<null>> => {
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (profileError) {
      return fail(profileError.message);
    }
    if (profileData) {
      return fail("User already exists");
    }

    const event = getRequestEvent();
    const { data: userData, error: userError } =
      await event.locals.supabase.auth.getUser();
    if (userError) {
      return fail(userError.message);
    }

    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);
    if (inviteError) {
      return fail(inviteError.message);
    }

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from("pending_invites")
      .upsert({ email, role, invited_by: userData.user.id });
    if (insertError) {
      return fail(insertError.message);
    }

    return ok(null);
  },
);
