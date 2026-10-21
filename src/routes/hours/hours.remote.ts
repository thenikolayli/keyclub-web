import { form } from "$app/server";
import * as v from "valibot";
import { supabaseAdmin } from "$lib/db/admin";
import { tokenizeName } from "$lib/members/tokenizeName";
import { ok, fail } from "$lib/responses";
import type { Result } from "$lib/responses";

// get percentile for grade and percentile for chapter

export const getHours = form(
  v.object({
    name: v.pipe(v.string(), v.trim(), v.nonEmpty()),
  }),
  async ({
    name,
  }): Promise<
    Result<{
      name: string;
      class: string;
      grad_year: number;
      all_hours: number;
      term_hours: number;
      all_time_percentile: number;
      all_time_ranking: number;
      term_percentile: number;
      term_ranking: number;
    }>
  > => {
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

    const all_time = await getRankings(
      "all_hours",
      data.all_hours,
      data.grad_year,
    );
    if (!all_time.ok) {
      return fail("Could not compute hours ranking.");
    }

    const term = await getRankings(
      "term_hours",
      data.term_hours,
      data.grad_year,
    );
    if (!term.ok) {
      return fail("Could not compute hours ranking.");
    }

    return ok({
      ...data,
      all_time_percentile: all_time.data.percentile,
      all_time_ranking: all_time.data.ranking,
      term_percentile: term.data.percentile,
      term_ranking: term.data.ranking,
    });
  },
);

async function getRankings(
  column: "all_hours" | "term_hours",
  value: number,
  gradYear: number,
): Promise<Result<{ percentile: number; ranking: number }>> {
  // rows with positive hours but below this member's hours (same graduating class)
  const less = await supabaseAdmin
    .from("members")
    .select("id", { count: "exact", head: true })
    .gt(column, 0)
    .lt(column, value)
    .eq("grad_year", gradYear);

  // total rows with positive hours (same graduating class)
  const total = await supabaseAdmin
    .from("members")
    .select("id", { count: "exact", head: true })
    .gt(column, 0)
    .eq("grad_year", gradYear);

  if (less.error || total.error) {
    return fail("Supabase select error");
  }

  const totalRows = total.count ?? 0;
  const percentile =
    totalRows === 0 ? 0 : Math.round(((less.count ?? 0) / totalRows) * 100);
  const ranking = totalRows - (less.count ?? 0);

  return ok({ percentile, ranking });
}

async function intersectTokens(tokens: string[]): Promise<Result<string>> {
  const { data, error } = await supabaseAdmin.rpc("match_all_tokens", {
    tokens,
  });
  if (error || data.length === 0) {
    return fail("No member found.");
  }
  return ok(data[0].member_id);
}
