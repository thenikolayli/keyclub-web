import type { Database } from "$lib/db/schema";

export type CalendarEvent = Database["public"]["Tables"]["calendar_events"]["Row"];
