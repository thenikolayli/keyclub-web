import { syncEventsFromCalendar } from "$lib/server/syncEvents";
import type { RequestHandler } from "./$types";
import { toResponse } from "$lib/types/responses";

export const GET: RequestHandler = async () => {
  const result = await syncEventsFromCalendar();
  if (!result.ok) {
    return toResponse(result, 500);
  }
  return toResponse({ ok: true, data: { synced: result.data } }, 200);
};
