import type { EventSearchRequest, Event } from "$lib/types/events";
import { postgresClient } from "$lib/db/supabase";
import type { RequestHandler } from "./$types";
import { jsonResponse } from "$lib/server/response";

export const POST: RequestHandler = async ({ request }) => {
  const searchRequest: EventSearchRequest = await request.json();
  const toTimeStr = (hours: number) =>
    `${hours.toString().padStart(2, "0")}:00:00`;
  const min_time = toTimeStr(searchRequest.times[0]);
  const max_time = toTimeStr(searchRequest.times[1]);

  const rows = await postgresClient<Event[]>`
    SELECT * FROM calendar_events
    WHERE start_time BETWEEN ${min_time} AND ${max_time}
    AND end_time BETWEEN ${min_time} AND ${max_time}
    AND date BETWEEN ${searchRequest.dates[0]} AND ${searchRequest.dates[1]}
    AND n_of_slots - n_of_volunteers BETWEEN ${searchRequest.spots[0]} AND ${searchRequest.spots[1]}
  `;
  return jsonResponse({ success: true, data: rows });
};
