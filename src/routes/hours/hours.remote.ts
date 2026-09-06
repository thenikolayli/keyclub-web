import { form } from "$app/server";
import * as v from "valibot";
import { supabaseAdmin } from "$lib/db/admin";
import {tokenizeName} from "$lib/members/tokenizeName";
import { ok, fail } from "$lib/responses";
import type { Result } from "$lib/responses";


export const getHours = form(
  v.object({
    name: v.pipe(v.string(), v.trim(), v.nonEmpty()),
  }),
  async ({ name }): Promise<Result<{name: string, class: string, grad_year: number, all_hours: number, term_hours: number}>> => {
    const tokens = tokenizeName(name);
    const result = await intersectTokens(tokens);
    if (!result.ok) {
      return result;
    }

    const { data, error } = await supabaseAdmin
      .from("members")
      .select("name, class, grad_year, all_hours, term_hours")
      .eq("id", result.data)
      .single();
    if (error) {
      return fail("No member found.");
    }
    return ok(data);
  },
);

async function intersectTokens(tokens: string[]): Promise<Result<string>> {
  const {data, error} = await supabaseAdmin.rpc("match_all_tokens", {tokens})
  if (error || data.length === 0) {
    return fail("No member found.");
  }
  return ok(data[0].member_id);
}
