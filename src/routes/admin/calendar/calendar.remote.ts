import { form } from "$app/server";
import * as v from "valibot";
import type { Result } from "$lib/types/responses";
import { docsUrlToId, parseAttendanceDoc } from "$lib/events";
import { getDocsService, getCalendarService } from "$lib/google";
import { CALENDAR_ID } from "$env/static/private";
import type { CalendarEvent } from "$lib/types/events";

const noDate = /\(.*?\)/;

export const calendar = form(
  v.object({
    url: v.pipe(v.string(), v.nonEmpty(), v.trim(), v.url()),
  }),
  async ({ url }): Promise<Result<{link: string, name: string}>> => {
    const id = docsUrlToId(url);
    if (!id) {
      return { ok: false, error: "Failed to extract ID from URL." };
    }

    const calendarService = getCalendarService();
    const eventInfo = await parseAttendanceDoc(id, getDocsService());
    if (!eventInfo.ok) {
      return {
        ok: false,
        error: "Failed to extract event info from attendance document.",
      };
    }
    if (!eventInfo.data.date || !eventInfo.data.start_time || !eventInfo.data.end_time) {
      return { ok: false, error: "Event is missing date or time information." };
    }

    const calendarEvent = {
      summary: eventInfo.data.name.replace(noDate, ""),
      location: eventInfo.data.address ?? undefined,
      description: eventInfo.data.description ?? undefined,
      start: {
        dateTime: `${eventInfo.data.date}T${eventInfo.data.start_time}`,
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: `${eventInfo.data.date}T${eventInfo.data.end_time}`,
        timeZone: "America/Los_Angeles",
      },
      attachments: [
        {
          fileUrl: eventInfo.data.attendance_url,
          title: "Attendance Document",
        },
      ],
    };

    console.log(calendarEvent)

    if (await alreadyExists(calendarService, CALENDAR_ID, calendarEvent)) {
      return { ok: false, error: "Event already exists in calendar." };
    }

    const result = await calendarService.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: calendarEvent,
      supportsAttachments: true,
    });

    return { ok: true, data: { link: result.data.htmlLink ?? "", name: eventInfo.data.name } };
  },
);

// Converts a naive "YYYY-MM-DDTHH:MM:SS" datetime (interpreted as America/Los_Angeles local time)
// into an RFC3339 UTC timestamp for calendar range queries
// Doesn't return Result since it doesn't error
function toLAIso(dateTime: string): string {
  const [date, time] = dateTime.split("T");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm, ss] = time.split(":").map(Number);

  const asUTC = new Date(Date.UTC(y, m - 1, d, hh, mm, ss));
  const offsetPart = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    timeZoneName: "shortOffset",
  })
    .formatToParts(asUTC)
    .find((p) => p.type === "timeZoneName")?.value;

  const sign = offsetPart?.startsWith("GMT-") ? -1 : 1;
  const hours = parseInt(
    (offsetPart ?? "GMT+0").replace("GMT+", "").replace("GMT-", ""),
    10,
  );
  const offsetMinutes = sign * hours * 60;

  return new Date(asUTC.getTime() - offsetMinutes * 60 * 1000).toISOString();
}

async function alreadyExists(
  calendarService: ReturnType<typeof getCalendarService>,
  calendarId: string,
  event: {
    summary: string;
    start: { dateTime: string };
    end: { dateTime: string };
  },
): Promise<boolean> {
  const response = await calendarService.events.list({
    calendarId,
    timeMin: toLAIso(event.start.dateTime),
    timeMax: toLAIso(event.end.dateTime),
  });

  return (response.data.items ?? []).some(
    (item) => item.summary === event.summary,
  );
}
