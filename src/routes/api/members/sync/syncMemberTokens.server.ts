import { supabase } from "$lib/db/admin";
import type { Result } from "$lib/responses";
import type { MemberToken, Member } from "$lib/members/types";
import {tokenizeName} from "$lib/members/tokenizeName";


export async function syncMemberTokens(): Promise<Result<null>> {
  const { data: deleteResult, error: deleteError } = await supabase
    .from("member_tokens")
    .delete()
    .not("id", "is", null);
  if (deleteError) {
    return { ok: false, error: deleteError?.message };
  }

  const { data: readResult, error: readError } = await supabase
    .from("members")
    .select("*");
  if (readError) {
    return { ok: false, error: readError?.message };
  }

  let memberTokens = [];
  for (const member of readResult as Member[]) {
    const tokens = tokenizeName(member.name);
    for (const token of tokens) {
      memberTokens.push({ member_id: member.id, token } as MemberToken);
    }
  }

  const { error: insertError } = await supabase
    .from("member_tokens")
    .upsert(memberTokens);
  if (insertError) {
    return { ok: false, error: insertError?.message };
  }

  return { ok: true, data: null };
}
