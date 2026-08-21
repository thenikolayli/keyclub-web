import { syncCalendar } from "./syncCalendar.server";
import { syncSpreadsheet } from "./syncSpreadsheet.server";
import { toResponse } from "$lib/types/responses";
import { SYNC_SECRET } from "$env/static/private";

export async function GET({ url }) {
  const token = url.searchParams.get("secret");
  if (token !== SYNC_SECRET) {
    return toResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  const calendarResult = await syncCalendar();
  if (!calendarResult.ok) {
    return toResponse(calendarResult, 500);
  }
  const spreadsheetResult = await syncSpreadsheet();
  if (!spreadsheetResult.ok) {
    return toResponse(spreadsheetResult, 500);
  }
  return toResponse({ ok: true, data: { synced: calendarResult.data + spreadsheetResult.data } }, 200);
}
