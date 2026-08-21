import { syncEventsFromCalendar } from "./syncEvents.server";
import { toResponse } from "$lib/types/responses";
import { SYNC_SECRET } from "$env/static/private";

export async function GET({ url }) {
  const token = url.searchParams.get("secret");
  if (token !== SYNC_SECRET) {
    return toResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  const result = await syncEventsFromCalendar();
  if (!result.ok) {
    return toResponse(result, 500);
  }
  return toResponse({ ok: true, data: { synced: result.data } }, 200);
}
