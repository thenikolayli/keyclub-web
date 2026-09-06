import { supabaseAdmin } from "$lib/db/admin";
import { ok, fail } from "$lib/responses";
import type { Result } from "$lib/responses";
import type { MemberToken, Member } from "$lib/members/types";
import {tokenizeName} from "$lib/members/tokenizeName";


export async function syncMemberTokens(): Promise<Result<null>> {
  const { data: deleteResult, error: deleteError } = await supabaseAdmin
    .from("member_tokens")
    .delete()
    .not("id", "is", null);
  if (deleteError) {
    return fail(deleteError?.message);
  }

  const { data: readResult, error: readError } = await supabaseAdmin
    .from("members")
    .select("*");
  if (readError) {
    return fail(readError?.message);
  }

  let memberTokens = [];
  for (const member of readResult as Member[]) {
    const tokens = tokenizeName(member.name);
    for (const token of tokens) {
      memberTokens.push({ member_id: member.id, token } as MemberToken);
    }
  }

  const { error: insertError } = await supabaseAdmin
    .from("member_tokens")
    .upsert(memberTokens);
  if (insertError) {
    return fail(insertError?.message);
  }

  return ok(null);
}
