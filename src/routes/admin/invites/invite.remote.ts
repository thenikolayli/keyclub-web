import { form } from "$app/server";
import * as v from "valibot";
import { supabase as supabaseAdmin } from "$lib/db/admin";
import type { Result } from "$lib/types/responses";
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
      return { ok: false, error: profileError.message };
    }
    if (profileData) {
      return { ok: false, error: "User already exists" };
    }

    const event = getRequestEvent();
    const { data: userData, error: userError } =
      await event.locals.supabase.auth.getUser();
    if (userError) {
      return { ok: false, error: userError.message };
    }

    const { error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email);
    if (inviteError) {
      return { ok: false, error: inviteError.message };
    }

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from("pending_invites")
      .upsert({ email, role, invited_by: userData.user.id });
    if (insertError) {
      return { ok: false, error: insertError.message };
    }

    return { ok: true, data: null };
  },
);
