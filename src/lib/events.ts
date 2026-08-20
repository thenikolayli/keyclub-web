import type { CalendarEvent } from "./types/events";
import { getDocsService } from "./google";
import type { Result } from "./types/responses";

// Local type not in $lib/types because it's used locally only
interface InfoTableResult {
  name: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  address: string | null;
}

export const parseAttendanceDoc = async (
  documentId: string,
  docs: ReturnType<typeof getDocsService>,
): Promise<Result<CalendarEvent>> => {
  const res = await docs.documents.get({ documentId });
  const doc = res.data;

  if (!doc.body?.content) return { ok: false, error: "No content" };

  const content = doc.body.content;

  const tables = content
    .filter((el: any) => el.table)
    .map((el: any) => el.table!);
  if (tables.length === 0) return { ok: false, error: "No tables" };

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
    ok: true,
    data: {
      name: info.name,
      date: info.date,
      start_time: info.startTime,
      end_time: info.endTime,
      address: info.address,
      n_of_slots: nOfSlots,
      n_of_volunteers: nOfVolunteers,
      description,
      attendance_url: `https://docs.google.com/document/d/${documentId}/edit?tab=t.0`,
    } as CalendarEvent,
  };
};

// https://docs.google.com/document/d/id-example/edit?tab=t.0
// https://docs.google.com/document/u/0/d/1x8B8h9ZFNIUcartcK7JLDUHjmnMTu62LP8hNzK82xgI/mobilebasic
// https://docs.google.com/document/d/1az1JXExSu5MLe3_vanaZ-x19nrbDJoy0H6TLfhIh1vI/edit?usp=sharing
// https://drive.google.com/open?id=1lhPZhj3s3DQawtCnIytPqAYKWXrAnAgeuTovbKfX2kM
export function docsUrlToId(url: string): string | null {
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
}

function fetchDescription(content: any[]): string | null {
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
}

function parseInfoTable(table: any): InfoTableResult {
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
    date = parseDateField(dateStr);
  }

  if (timeStr) {
    const [start, end] = timeStr
      .split(/\s*(?:-|to|until)\s*/i)
      .map((s) => s.trim());
    if (start) startTime = parseTimeField(start);
    if (end) endTime = parseTimeField(end);
  }

  return { name, date, startTime, endTime, address };
}

// Handles date strings like "2026-08-22", "August 22, 2026", or "monday, august 22nd, 2026".
function parseDateField(dateStr: string): string | null {
  const normalized = dateStr
    .replace(
      /^\s*(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday),?\s*/i,
      "",
    )
    .replace(/\b(\d+)(?:st|nd|rd|th)\b/gi, "$1")
    .trim();

  const parsed = new Date(normalized);
  if (isNaN(parsed.getTime())) return null;
  return parsed.toISOString().split("T")[0];
}

// Converts "10 am", "4 pm", "10:30 am", or "16:00" into 24h "HH:MM:SS".
function parseTimeField(timeStr: string): string | null {
  const m = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!m) return null;

  let hours = parseInt(m[1], 10);
  const minutes = m[2] ? parseInt(m[2], 10) : 0;
  const meridiem = m[3]?.toLowerCase();

  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

function getCellText(cell: any): string {
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
}

function getParagraphText(paragraph: any): string | null {
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
}
