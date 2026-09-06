import { form } from "$app/server";
import * as v from "valibot";
import { supabaseAdmin } from "$lib/db/admin";
import { ok, fail } from "$lib/responses";

export const requestReset = form(
  v.object({
    email: v.pipe(v.string(), v.trim(), v.email(), v.toLowerCase()),
  }),
  async ({ email }) => {
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email);
    if (error) {
      return fail(error.message);
    }

    return ok(null);
  }
)
