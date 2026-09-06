import { syncMembers } from "./syncMembers.server";
import { syncMemberTokens } from "./syncMemberTokens.server";
import { toResponse, ok, fail } from "$lib/responses";
import { SYNC_SECRET } from "$env/static/private";

export async function GET({ url }) {
  const token = url.searchParams.get("secret");
  if (token !== SYNC_SECRET) {
    return toResponse(fail("Unauthorized"), 401);
  }

  const memberResult = await syncMembers();
  if (!memberResult.ok) {
    return toResponse(memberResult, 500);
  }
  const tokenResult = await syncMemberTokens();
  if (!tokenResult.ok) {
    return toResponse(tokenResult, 500);
  }
  return toResponse(ok({ synced: memberResult.data }), 200);
}
