import { form } from "$app/server";
import * as v from "valibot"
import { getRequestEvent } from "$app/server";
import { supabase as supabaseAdmin } from "$lib/db/admin";
import type { Result } from "$lib/types/responses";

export const accept = form(
  v.object({
    token_hash: v.string(),
    first_name: v.pipe(v.string(), v.nonEmpty(), v.trim()),
    last_name: v.pipe(v.string(), v.nonEmpty(), v.trim()),
    password: v.string(),
  }),
  async ({token_hash, first_name, last_name, password}): Promise<Result<null>> => {
    const event = getRequestEvent();

    const { data: verifyData, error: verifyError } = await event.locals.supabase.auth.verifyOtp({
      token_hash: token_hash,
      type: "invite",
    })
    if (verifyError) {
      return { ok: false, error: verifyError.message };
    }
    if (!verifyData.user) {
      return { ok: false, error: "Invalid token" };
    }

    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("pending_invites")
      .select("role, id")
      .eq("email", verifyData.user.email)
      .single()
    if (roleError) {
      return { ok: false, error: roleError.message };
    }

    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: verifyData.user.id,
        email: verifyData.user.email,
        first_name,
        last_name,
        role: roleData.role,
      })
    if (profileError) {
      return { ok: false, error: profileError.message };
    }

    const { data: roleDeleteData, error: roleDeleteError } = await supabaseAdmin
      .from("pending_invites")
      .delete()
      .eq("id", roleData.id)
    if (roleDeleteError) {
      return { ok: false, error: roleDeleteError.message };
    }

    const { data: updateData, error: updateError } = await event.locals.supabase.auth.updateUser({ password });
    if (updateError) {
      return { ok: false, error: updateError.message };
    }

    return { ok: true, data: null };
  }
)
