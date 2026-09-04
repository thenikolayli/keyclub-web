import { supabaseAdmin } from "$lib/db/admin";
import { getDocsService, getSheetsService } from "$lib/google";
import { SPREADSHEET_ID } from "$env/static/private";
import { docsUrlToId, parseBaseEvent } from "$lib/events/events";
import type { BaseEvent } from "$lib/events/types";
import type { Result } from "$lib/responses";
import { eventsSheet } from "$lib/sheetsConfig";

// The Events sheet has a simple 3-column schema (name, total hours, link).
// Only column C (the attendance doc link) is read here; the full event info is
// pulled from each attendance doc and upserted to supabase.

export async function syncSpreadsheet(): Promise<Result<number>> {
  const sheets = getSheetsService();
  const docs = getDocsService();

  let response;
  try {
    response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: eventsSheet.links,
    });
  } catch {
    return { ok: false, error: "Failed to fetch attendance doc links from spreadsheet." };
  }

  const links = (response.data.values ?? [])
    .map((row) => String(row[0] ?? "").trim())
    .filter(Boolean);
  if (links.length === 0) {
    return { ok: false, error: "No attendance doc links found in spreadsheet." };
  }

  // concurrently parse every attendance doc into full event info
  const results = await Promise.all(
    links.map(async (link): Promise<Result<BaseEvent>> => {
      const idResult = docsUrlToId(link);
      if (!idResult.ok) return { ok: false, error: idResult.error };

      const info = await parseBaseEvent(idResult.data, docs);
      if (!info.ok) return { ok: false, error: info.error };
      return { ok: true, data: info.data.event };
    }),
  );

  let synced = 0;
  for (const result of results) {
    if (!result.ok) {
      console.error("syncSpreadsheet: failed to parse event", result.error);
      continue;
    }
    const event = result.data;

    const { id: _id, created_at: _c, description: _d, ...row } = event;
    const { error: upsertError } = await supabaseAdmin
      .from("spreadsheet_events")
      .upsert(row, { onConflict: "name" });
    if (upsertError) {
      console.error("syncSpreadsheet: upsert failed for", event.name, upsertError);
      continue;
    }
    synced++;
  }

  return { ok: true, data: synced };
}
