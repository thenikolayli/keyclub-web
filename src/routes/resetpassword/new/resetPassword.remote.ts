import { form } from "$app/server";
import * as v from "valibot";
import { isValidPassword } from "$lib/auth/validatePassword";
import { getRequestEvent } from "$app/server";

export const resetPassword = form(
  v.object({
    token_hash: v.string(),
    password: v.string(),
  }),
  async ({ token_hash, password }) => {
    const validPassword = isValidPassword(password);
    if (!validPassword.ok) {
      return validPassword;
    }

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

    const { data: updateData, error: updateError } = await event.locals.supabase.auth.updateUser({ password });
    if (updateError) {
      return { ok: false, error: updateError.message };
    }

    return { ok: true, data: null };
  }
)
