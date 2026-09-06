import moment from "moment-timezone";
import { ok, fail, type Result} from "$lib/responses";

// Everything takes place in LA time for this club.
const LA_TIMEZONE = "America/Los_Angeles";
const DATE_FORMATS = [
  "YYYY-MM-DD",
  "M/D",
  "MMMM D, YYYY",
  "MMMM D YYYY",
];

// Handles date strings like "2026-08-22", "August 22, 2026", "monday, august 22nd, 2026",
// or "6/25" (month/day, year defaults to the current year).
// Returns "YYYY-MM-DD".
export function parseDateField(dateStr: string): Result<string> {
  const normalized = dateStr
    .replace(
      /^\s*(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday),?\s*/i,
      "",
    )
    .replace(/\b(\d+)(?:st|nd|rd|th)\b/gi, "$1")
    .trim();

  const parsed = moment.tz(normalized, DATE_FORMATS, LA_TIMEZONE);
  if (!parsed.isValid()) return fail(`Could not parse date "${dateStr}".`);
  return ok(parsed.format("YYYY-MM-DD"));
}

// Converts "10 am", "4 pm", "10:30 am", or "16:00" into 24h "HH:MM:SS".
export function parseTimeField(timeStr: string): Result<string> {
  const m = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!m) return fail(`Could not parse time "${timeStr}".`);

  let hours = parseInt(m[1], 10);
  const minutes = m[2] ? parseInt(m[2], 10) : 0;
  const meridiem = m[3]?.toLowerCase();

  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;

  const parsed = moment.tz({ hours, minutes, seconds: 0 }, LA_TIMEZONE);
  return ok(parsed.format("HH:mm:ss"));
}
