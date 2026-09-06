import { ok } from "$lib/responses";
import type { Result } from "$lib/responses";
import { MEETING_CALENDAR_ID } from "$env/static/private";
import { getCalendarService } from "$lib/google";
import type { Meeting, Committee } from "./types";


// Fetches all meetings for the next year.
export async function getMeetings(): Promise<Result<Meeting[]>> {
  const calendar = getCalendarService();

  const now = new Date();
  const timeMax = new Date();
  timeMax.setFullYear(timeMax.getFullYear() + 1);
  const meetings: Meeting[] = [];
  const response = await calendar.events.list({
    calendarId: MEETING_CALENDAR_ID,
    timeMin: now.toISOString(),
    timeMax: timeMax.toISOString(),
  });

  for (const calEvent of response.data.items || []) {
    const description = calEvent.description ?? "";
    const committeeMatch = description.match(/committee:\s*(.+?)\n/i);
    const locationMatch = description.match(/location:\s*(.+?)\n/i);
    const descMatch = description.match(/description:\s*(.+)/i);
    // Description doesn't have a newline terminator since it's meant to be multiline.

    const meeting: Meeting = {
      name: calEvent.summary ?? "",
      description: descMatch ? descMatch[1].trim() : "",
      date: calEvent.start!.dateTime ?? calEvent.start!.date ?? "",
      start: calEvent.start!.dateTime ?? "",
      end: calEvent.end!.dateTime ?? "",
      committee: (committeeMatch?.[1].trim().toLowerCase() as Committee) ?? "general",
      location: locationMatch ? locationMatch[1].trim() : "",
    };
    meetings.push(meeting);
  }

  return ok(meetings);
};
