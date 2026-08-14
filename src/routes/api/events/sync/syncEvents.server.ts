import { supabase } from "$lib/db/admin";
import { getCalendarService, getDocsService } from "$lib/google";
import { CALENDAR_ID } from "$env/static/private";
import type { CalendarEvent } from "$lib/types/events";
import type { Result } from "$lib/types/responses";

// syncs events from the key club google calendar (Key Club Member Calendar) and returns number of events synced/updated
export async function syncEventsFromCalendar(): Promise<Result<number>> {
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
  const parsedEvents: CalendarEvent[] = [];

  for (const calEvent of unparsedEvents) {
    if (!calEvent.attachments || calEvent.attachments.length === 0) continue;

    const fileUrl = calEvent.attachments[0].fileUrl;
    if (!fileUrl) continue;

    const docId = docsUrlToId(fileUrl);
    if (!docId) continue;

    try {
      const parsed = await parseAttendanceDoc(docId, docs);
      if (parsed) parsedEvents.push(parsed);
    } catch (err) {
      console.warn("sync: failed to parse doc for", calEvent.summary, err);
    }
  }

  let updates = 0;

  for (const event of parsedEvents) {
    const { error: upsertError } = await supabase
      .from("calendar_events")
      .upsert(event, { onConflict: "attendance_url", ignoreDuplicates: false });
    if (upsertError) {
      console.error("sync: upsert failed for", event.name, upsertError);
      continue;
    }
    updates++;
  }

  return { ok: true, data: updates };
};

// https://docs.google.com/document/d/id-example/edit?tab=t.0
// https://docs.google.com/document/u/0/d/1x8B8h9ZFNIUcartcK7JLDUHjmnMTu62LP8hNzK82xgI/mobilebasic
// https://docs.google.com/document/d/1az1JXExSu5MLe3_vanaZ-x19nrbDJoy0H6TLfhIh1vI/edit?usp=sharing
// https://drive.google.com/open?id=1lhPZhj3s3DQawtCnIytPqAYKWXrAnAgeuTovbKfX2kM
const docsUrlToId = (url: string): string | null => {
  let parts = url.split("/d/");
  if (parts.length >= 2) {
    url = parts[1];
  } else {
    parts = url.split("id=");
    if (parts.length >= 2) {
      url = parts[1];
    }
  }

  return url.split("/")[0];
};

const parseAttendanceDoc = async (
  documentId: string,
  docs: ReturnType<typeof getDocsService>,
): Promise<CalendarEvent | null> => {
  const res = await docs.documents.get({ documentId });
  const doc = res.data;

  if (!doc.body?.content) return null;

  const content = doc.body.content;

  const tables = content
    .filter((el: any) => el.table)
    .map((el: any) => el.table!);
  if (tables.length === 0) return null;

  const description = fetchDescription(content);

  const infoTable = tables[0];
  const info = parseInfoTable(infoTable);

  const attendanceTables = tables.slice(1);
  let nOfSlots = 0;
  let nOfVolunteers = 0;

  for (const table of attendanceTables) {
    if (!table.tableRows) continue;
    for (let i = 1; i < table.tableRows.length; i++) {
      nOfSlots++;
      const cells = table.tableRows[i].tableCells;
      if (cells && cells.length >= 2) {
        const memberName = getCellText(cells[1]);
        if (memberName) nOfVolunteers++;
      }
    }
  }

  return {
    name: info.name,
    date: info.date,
    start_time: info.startTime,
    end_time: info.endTime,
    address: info.address,
    n_of_slots: nOfSlots,
    n_of_volunteers: nOfVolunteers,
    description,
    attendance_url: `https://docs.google.com/document/d/${documentId}/edit?tab=t.0`,
  };
};

const fetchDescription = (content: any[]): string | null => {
  let foundFirstTable = false;

  for (const el of content) {
    if (el.table) {
      if (!foundFirstTable) {
        foundFirstTable = true;
      }
      continue;
    }

    if (!foundFirstTable || !el.paragraph) continue;

    const text = getParagraphText(el.paragraph);
    if (!text) continue;

    const newlineIdx = text.indexOf("\n");
    return newlineIdx >= 0 ? text.slice(0, newlineIdx).trim() : text.trim();
  }

  return "Check attendance doc for description.";
};

interface InfoTableResult {
  name: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  address: string | null;
}

const parseInfoTable = (table: any): InfoTableResult => {
  const fields: Record<string, string> = {};

  for (const row of table.tableRows || []) {
    const cells = row.tableCells;
    if (!cells || cells.length < 2) continue;
    const header = getCellText(cells[0]).toLowerCase().replace(":", "").trim();
    const value = getCellText(cells[1]).trim();
    fields[header] = value;
  }

  const name = fields["event name"] || fields["event"] || "";
  const address = fields["address"] || fields["location"] || "";
  const dateStr = fields["date"] || "";
  const timeStr = fields["time"] || "";

  let date: string | null = null;
  let startTime: string | null = null;
  let endTime: string | null = null;

  if (dateStr) {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      date = parsed.toISOString().split("T")[0];
    }
  }

  if (timeStr) {
    const [start, end] = timeStr.split(/[-to]/).map((s) => s.trim());
    if (start) startTime = start;
    if (end) endTime = end;
  }

  return { name, date, startTime, endTime, address };
};

const getCellText = (cell: any): string => {
  if (!cell.content) return "";
  return cell.content
    .map((c: any) => {
      if (!c.paragraph) return "";
      return (
        c.paragraph.elements
          ?.map((e: any) => {
            if (e.textRun) return e.textRun.content || "";
            if (e.richLink?.richLinkProperties)
              return e.richLink.richLinkProperties.title || "";
            if (e.person?.personProperties)
              return (
                e.person.personProperties.name ||
                e.person.personProperties.email ||
                ""
              );
            return "";
          })
          .join("") || ""
      );
    })
    .join("")
    .trim();
};

const getParagraphText = (paragraph: any): string | null => {
  if (!paragraph.elements) return null;
  return (
    paragraph.elements
      .map((e: any) => {
        if (e.textRun) return e.textRun.content || "";
        if (e.richLink?.richLinkProperties)
          return e.richLink.richLinkProperties.title || "";
        if (e.person?.personProperties)
          return (
            e.person.personProperties.name ||
            e.person.personProperties.email ||
            ""
          );
        return "";
      })
      .join("")
      .trim() || null
  );
};
