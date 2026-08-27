import type { MemberAttendance, BaseEvent } from "./types";
import { getDocsService } from "../google";
import type { Result } from "../responses";
import { parseDateField, parseTimeField } from "./datetime";
import { tokenizeName } from "$lib/members/tokenizeName";
import moment from "moment-timezone";

// Parses an attendance document into a BaseEvent plus per-member attendance,
// computing slots, volunteers, and total hours in one pass over the tables.
// The event name is the document title; callers can derive their own if needed.
export async function parseBaseEvent(
  documentId: string,
  docs: ReturnType<typeof getDocsService>,
): Promise<Result<{ event: BaseEvent; memberAttendance: MemberAttendance[] }>> {
  const res = await docs.documents.get({ documentId });
  const doc = res.data;
  if (!doc.body?.content) return { ok: false, error: "No content" };

  const tables = doc.body.content
    .filter((el: any) => el.table)
    .map((el: any) => el.table!);
  if (tables.length === 0) return { ok: false, error: "No tables" };

  const fields = parseInfoFields(tables[0]);
  const { date, startTime, endTime } = parseEventDateTimes(fields, doc.title!);

  let nOfSlots = 0;
  let nOfVolunteers = 0;
  let totalHours = 0;
  const memberAttendance: MemberAttendance[] = [];

  // Grabs the attendance tables (every table after the first)
  for (const table of tables.slice(1)) {
    if (!table.tableRows) continue;
    for (let i = 1; i < table.tableRows.length; i++) {
      nOfSlots++;
      const cells = table.tableRows[i].tableCells;
      if (!cells || cells.length < 2) continue;

      const memberName = getCellText(cells[1]);
      if (!memberName) continue;
      nOfVolunteers++;

      // Rows without the full cell set (#, name, grade, email/phone, sign in, sign out, hours)
      // don't produce attendance
      if (cells.length < 7) continue;

      const hoursResult = calculateHours(getCellText(cells[4]), getCellText(cells[5]));
      const hours = hoursResult.ok ? hoursResult.data : null;
      if (hours != null) totalHours += hours;

      memberAttendance.push({
        name: memberName,
        tokenizedName: tokenizeName(memberName),
        hours,
        // +1/-1 offsets grab the inside of the cell, not its borders
        hoursStartIndex: cells[6].startIndex + 1,
        hoursEndIndex: cells[6].endIndex - 1,
      });
    }
  }

  return {
    ok: true,
    data: {
      event: {
        name: doc.title!,
        date,
        start_time: startTime,
        end_time: endTime,
        address: fields["address"] || fields["location"] || null,
        description: fetchDescription(doc.body.content),
        attendance_url: attendanceUrlFromId(documentId),
        made_by: fields["made by"] || null,
        leaders: splitLeaders(fields["leaders"]),
        n_slots: nOfSlots,
        n_volunteers: nOfVolunteers,
        total_hours: totalHours,
        created_at: "",
        id: "",
      },
      memberAttendance,
    },
  };
}

// computes hours between start and end time strings (HH:MM)
// returns null (not an error) when both times are blank, meaning no hours logged
function calculateHours(startTime: string, endTime: string): Result<number | null> {
  const start = startTime.trim();
  const end = endTime.trim();
  if (!start && !end) return { ok: true, data: null };

  const startMoment = moment(start, "HH:mm");
  const endMoment = moment(end, "HH:mm");
  if (!startMoment.isValid() || !endMoment.isValid()) {
    return {
      ok: false,
      error: `Invalid time format (expected HH:MM): start="${start}" end="${end}"`,
    };
  }

  // assume 12-hour format: if end is before start, end is PM, e.g. 8 to 2 -> 8am to 2pm
  if (endMoment.isBefore(startMoment)) {
    endMoment.add(12, "hours");
  }

  const hours = Math.round(endMoment.diff(startMoment, "hours", true) * 100) / 100;
  return { ok: true, data: hours };
}

// https://docs.google.com/document/d/id-example/edit?tab=t.0
// https://docs.google.com/document/u/0/d/1x8B8h9ZFNIUcartcK7JLDUHjmnMTu62LP8hNzK82xgI/mobilebasic
// https://docs.google.com/document/d/1az1JXExSu5MLe3_vanaZ-x19nrbDJoy0H6TLfhIh1vI/edit?usp=sharing
// https://drive.google.com/open?id=1lhPZhj3s3DQawtCnIytPqAYKWXrAnAgeuTovbKfX2kM
export function docsUrlToId(url: string): Result<string> {
  let parts = url.split("/d/");
  if (parts.length >= 2) {
    url = parts[1];
  } else {
    parts = url.split("id=");
    if (parts.length >= 2) {
      url = parts[1];
    }
  }

  const id = url.split("/")[0];
  if (!id) return { ok: false, error: "Could not extract document ID from URL." };
  return { ok: true, data: id };
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

function parseInfoFields(table: any): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const row of table.tableRows || []) {
    const cells = row.tableCells;
    if (!cells || cells.length < 2) continue;
    const header = getCellText(cells[0]).toLowerCase().replace(":", "").trim();
    const value = getCellText(cells[1]).trim();
    fields[header] = value;
  }
  return fields;
}

// Parses the date/time fields. The date falls back to the "(M/D)" prefix of the
// document title when the date field is blank.
function parseEventDateTimes(
  fields: Record<string, string>,
  title: string,
): { date: string | null; startTime: string | null; endTime: string | null } {
  const dateStr = fields["date"] || "";
  const dateRes = dateStr
    ? parseDateField(dateStr)
    : parseDateField(title.split(")")[0].substring(1)); // grabs it from inside the parenthesis

  let startTime: string | null = null;
  let endTime: string | null = null;
  const timeStr = fields["time"] || "";
  if (timeStr) {
    const [start, end] = timeStr
      .split(/\s*(?:-|to|until)\s*/i)
      .map((s) => s.trim());
    if (start) {
      const res = parseTimeField(start);
      startTime = res.ok ? res.data : null;
    }
    if (end) {
      const res = parseTimeField(end);
      endTime = res.ok ? res.data : null;
    }
  }

  return { date: dateRes.ok ? dateRes.data : null, startTime, endTime };
}

function splitLeaders(leaders: string): string[] | null {
  if (!leaders) return null;
  return leaders
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const attendanceUrlFromId = (id: string) =>
  `https://docs.google.com/document/d/${id}/edit?tab=t.0`;

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
