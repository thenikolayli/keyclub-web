import moment from "moment-timezone";
import { ok } from "$lib/responses";
import type { Result } from "$lib/responses";
import { CALENDAR_ID } from "$env/static/private";
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
    calendarId: CALENDAR_ID,
    timeMin: now.toISOString(),
    timeMax: timeMax.toISOString(),
  });

  for (const calEvent of response.data.items || []) {
    if (!calEvent.summary || !calEvent.description) {
      continue;
    }
    const lowercaseName = calEvent.summary.toLowerCase();
    if (!lowercaseName.includes("meeting")) {
      continue;
    }
    let committee: Committee;
    if (lowercaseName.includes("general")) {
      committee = "general";
    } else if (lowercaseName.includes("leadership")) {
      committee = "leadership";
    } else if (lowercaseName.includes("spirit")) {
      committee = "spirit";
    } else if (lowercaseName.includes("service")) {
      committee = "service";
    } else if (lowercaseName.includes("deco")) {
      committee = "decoration";
    } else {
      continue;
    }

    const date = moment.tz(calEvent.start!.date, "America/Los_Angeles");
    const description = calEvent.description ?? "";
    const locationMatch = description.match(/location:\s*(.+?)\n/i);
    const descMatch = description.match(/description:\s*(.+)/i);
    // Description doesn't have a newline terminator since it's meant to be multiline.
    // Meetings are always "all day" on the calendar for priority,
    // so I'm hardcoding the start and end times
    const meeting: Meeting = {
      name: calEvent.summary!,
      description: descMatch ? descMatch[1].trim() : null,
      committee,
      location: locationMatch ? locationMatch[1].trim() : null,
      date: calEvent.start!.date!,
      start:
        date.set({ hour: 14, minute: 15, second: 0 }).toISOString() ?? null,
      end: date.set({ hour: 15, minute: 15, second: 0 }).toISOString() ?? null,
    };
    meetings.push(meeting);
  }

  return ok(meetings);
}
