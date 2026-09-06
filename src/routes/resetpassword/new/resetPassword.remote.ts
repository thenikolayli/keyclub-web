import { form } from "$app/server";
import * as v from "valibot";
import { isValidPassword } from "$lib/auth/validatePassword";
import { getRequestEvent } from "$app/server";
import { ok, fail } from "$lib/responses";

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
      type: "recovery",
    })
    if (verifyError) {
      return fail(verifyError.message);
    }
    if (!verifyData.user) {
      return fail("Invalid token");
    }

    const { data: updateData, error: updateError } = await event.locals.supabase.auth.updateUser({ password });
    if (updateError) {
      return fail(updateError.message);
    }

    return ok(null);
  }
)
