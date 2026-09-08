import { form } from "$app/server";
import * as v from "valibot";
import { supabaseAdmin } from "$lib/db/admin";
import { ok, fail } from "$lib/responses";
import type { Result } from "$lib/responses";
import type { Member } from "$lib/members/types";
import { OFFICERS } from "$env/static/private";
import { tokenizeName, matchesAllTokens } from "$lib/members/tokenizeName";

const officerTokens = OFFICERS.split(", ").map(tokenizeName);

export const ranks = form(
  v.object({
    gradYear: v.pipe(v.number(), v.integer()),
    limit: v.pipe(v.number(), v.integer()),
  }),
  async ({ gradYear, limit }): Promise<Result<Member[]>> => {
    const { data, error } = await supabaseAdmin
      .from("members")
      .select("*")
      .eq("grad_year", gradYear)
      .order("all_hours", { ascending: false });
    if (error) {
      return fail(error.message, error);
    }
    const members = (data as Member[]).filter(
      (member) =>
        !officerTokens.some((tokens) =>
          matchesAllTokens(tokens, tokenizeName(member.name ?? "")),
        ),
    );
    return ok(members.slice(0, 5));
  },
);
