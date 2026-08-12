import type { RequestHandler } from "./$types";
import type { InviteRequest } from "$lib/types/invites";
import { inviteMember } from "$lib/server/inviteMember";
import { toResponse } from "$lib/types/responses";

export const POST: RequestHandler = async ({ request }) => {
  const inviteRequest: InviteRequest = await request.json();

  const result = await inviteMember(inviteRequest);
  if (!result.ok) {
    return toResponse(result, 500);
  }

  return toResponse(result, 201);
};
