import { syncMembers } from "./syncMembers.server";
import { syncMemberTokens } from "./syncMemberTokens.server";

import type { RequestHandler } from "./$types";
import { toResponse } from "$lib/types/responses";

export const GET: RequestHandler = async () => {
  const memberResult = await syncMembers();
  if (!memberResult.ok) {
    return toResponse(memberResult, 500);
  }
  const tokenResult = await syncMemberTokens();
  if (!tokenResult.ok) {
    return toResponse(tokenResult, 500);
  }
  return toResponse({ ok: true, data: { synced: memberResult.data } }, 200);
};
