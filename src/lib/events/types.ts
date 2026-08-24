import type { Database } from "$lib/db/schema";

export type CalendarEvent = Database["public"]["Tables"]["calendar_events"]["Row"];
export type SpreadsheetEvent = Database["public"]["Tables"]["spreadsheet_events"]["Row"];

// The union of every field in CalendarEvent and SpreadsheetEvent.
// Fields only present in one of them are nullable.
export interface BaseEvent {
  address: string | null;
  attendance_url: string | null;
  created_at: string;
  date: string | null;
  description: string | null;
  end_time: string | null;
  id: string;
  leaders: string[] | null;
  made_by: string | null;
  n_slots: number | null;
  n_volunteers: number | null;
  name: string | null;
  start_time: string | null;
  total_hours: number | null;
}

// hoursStartIndex is the index of the hours cell (Google Docs), where calculated hours are written.
// hours is null when the member has no logged start/end times.
export interface MemberAttendance {
  name: string;
  tokenizedName: string[];
  hours: number | null;
  hoursStartIndex: number;
  hoursEndIndex: number;
}
