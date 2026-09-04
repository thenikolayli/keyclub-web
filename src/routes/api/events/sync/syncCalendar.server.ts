import { supabaseAdmin } from "$lib/db/admin";
import { getCalendarService, getDocsService } from "$lib/google";
import { CALENDAR_ID } from "$env/static/private";
import type { BaseEvent } from "$lib/events/types";
import type { Result } from "$lib/responses";
import { parseBaseEvent, docsUrlToId } from "$lib/events/events";

// syncs events from the key club google calendar (Key Club Member Calendar) and returns number of events synced/updated
export async function syncCalendar(): Promise<Result<number>> {
  const calendar = getCalendarService();
  const docs = getDocsService();

  const now = new Date();
  const timeMax = new Date();
  timeMax.setFullYear(timeMax.getFullYear() + 1);

  const response = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: now.toISOString(),
    timeMax: timeMax.toISOString(),
  });

  const unparsedEvents = response.data.items || [];
  const parsedEvents: BaseEvent[] = [];

  for (const calEvent of unparsedEvents) {
    if (!calEvent.attachments || calEvent.attachments.length === 0) continue;

    const fileUrl = calEvent.attachments[0].fileUrl;
    if (!fileUrl) continue;

    const docIdResult = docsUrlToId(fileUrl);
    if (!docIdResult.ok) continue;
    const docId = docIdResult.data;

    try {
      const parsed = await parseBaseEvent(docId, docs);
      if (parsed.ok) parsedEvents.push(parsed.data.event);
    } catch (err) {
      console.warn("sync: failed to parse doc for", calEvent.summary, err);
    }
  }

  let updates = 0;

  for (const event of parsedEvents) {
    const { error: upsertError } = await supabaseAdmin
      .from("calendar_events")
      .upsert(
        {
          name: event.name!,
          date: event.date,
          start_time: event.start_time,
          end_time: event.end_time,
          address: event.address,
          n_slots: event.n_slots,
          n_volunteers: event.n_volunteers,
          description: event.description,
          attendance_url: event.attendance_url!,
        },
        { onConflict: "attendance_url", ignoreDuplicates: false },
      );
    if (upsertError) {
      console.error("sync: upsert failed for", event.name, upsertError);
      continue;
    }
    updates++;
  }

  return { ok: true, data: updates };
};
