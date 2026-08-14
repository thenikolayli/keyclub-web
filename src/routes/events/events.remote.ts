import { query } from "$app/server";
import * as v from "valibot";
import { supabase } from "$lib/db/postgres";
import type { Result } from "$lib/types/responses";
import type { CalendarEvent } from "$lib/types/events";

const EventSearchSchema = v.object({
  times: v.tuple([v.string(), v.string()]),
  lengths: v.tuple([v.number(), v.number()]),
  dates: v.tuple([v.string(), v.string()]), // 2026-08-09
  spots: v.tuple([v.number(), v.number()]),
})

export const searchEvents = query(EventSearchSchema, async (data): Promise<Result<CalendarEvent[]>> => {
  const rows = await supabase<CalendarEvent[]>`
    SELECT * FROM calendar_events
    WHERE start_time BETWEEN ${data.times[0]} AND ${data.times[1]}
    AND end_time BETWEEN ${data.times[0]} AND ${data.times[1]}
    AND date BETWEEN ${data.dates[0]} AND ${data.dates[1]}
    AND n_of_slots - n_of_volunteers BETWEEN ${data.spots[0]} AND ${data.spots[1]}
  `;

  return { ok: true, data: rows };
})
