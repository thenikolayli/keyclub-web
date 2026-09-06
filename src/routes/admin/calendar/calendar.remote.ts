import { form } from "$app/server";
import * as v from "valibot";
import { ok, fail } from "$lib/responses";
import type { Result } from "$lib/responses";
import { docsUrlToId, parseBaseEvent } from "$lib/events/events";
import { getDocsService, getCalendarService } from "$lib/google";
import { CALENDAR_ID } from "$env/static/private";
import moment from "moment-timezone";

const noDate = /\(.*?\)/;

export const calendar = form(
  v.object({
    url: v.pipe(v.string(), v.nonEmpty(), v.trim(), v.url()),
  }),
  async ({ url }): Promise<Result<{link: string, name: string}>> => {
    const idResult = docsUrlToId(url);
    if (!idResult.ok) {
      return fail(idResult.error);
    }
    const id = idResult.data;

    const calendarService = getCalendarService();
    const eventInfo = await parseBaseEvent(id, getDocsService());
    if (!eventInfo.ok) {
      return fail("Failed to extract event info from attendance document.");
    }
    const event = eventInfo.data.event;
    if (!event.date || !event.start_time || !event.end_time) {
      return fail("Event is missing date or time information.");
    }

    const calendarEvent = {
      summary: event.name!.replace(noDate, ""),
      location: event.address ?? undefined,
      description: event.description ?? undefined,
      start: {
        dateTime: `${event.date}T${event.start_time}`,
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: `${event.date}T${event.end_time}`,
        timeZone: "America/Los_Angeles",
      },
      attachments: [
        {
          fileUrl: event.attendance_url!,
          title: "Attendance Document",
        },
      ],
    };

    if (await alreadyExists(calendarService, CALENDAR_ID, calendarEvent)) {
      return fail("Event already exists in calendar.");
    }

    const result = await calendarService.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: calendarEvent,
      supportsAttachments: true,
    });

    return ok({ link: result.data.htmlLink ?? "", name: event.name! });
  },
);

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
    timeMin: moment.tz(event.start.dateTime, "America/Los_Angeles").toISOString(),
    timeMax: moment.tz(event.end.dateTime, "America/Los_Angeles").toISOString(),
  });

  for (const item of response.data.items ?? []) {
    if (item.summary?.trim().toLowerCase() === event.summary.trim().toLowerCase()) {
      return true;
    }
  }
  return false;
}
