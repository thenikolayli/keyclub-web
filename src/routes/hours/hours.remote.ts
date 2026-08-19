import { form } from "$app/server";
import * as v from "valibot";
import { supabase } from "$lib/db/admin";
import type { MemberToken } from "$lib/types/members";
import tokenizeName from "$lib/tokenizeName";
import type { Result } from "$lib/types/responses";


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

    const { data, error } = await supabase
      .from("members")
      .select("name, class, grad_year, all_hours, term_hours")
      .eq("id", result.data.member_id)
      .single();
    if (error) {
      return { ok: false, error: "No member found." };
    }
    return { ok: true, data: data };
  },
);

async function intersectTokens(tokens: string[]): Promise<Result<MemberToken>> {
  const {data, error} = await supabase.rpc("match_all_tokens", {tokens})
  if (error || data.length === 0) {
    return { ok: false, error: "No member found." };
  }
  return { ok: true, data: data[0] };
}
