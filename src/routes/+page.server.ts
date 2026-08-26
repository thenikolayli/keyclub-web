import { getMeetings } from "$lib/events/meetings";
import { searchEvents } from "./events/events.remote";
import {
  getLocalTimeZone,
  today,
} from "@internationalized/date";

export const prerender = false;

// Preloads general meetings + all events
export async function load() {
  const meetingsResult = await getMeetings();
  if (!meetingsResult.ok) {
    return {meetings: [], events: []}
  }

  const start = today(getLocalTimeZone());
  const end = start.add({ months: 1 });
  const eventsResult = await searchEvents({
    times: ["00:00:00", "23:59:59"],
    lengths: [0, 24],
    dates: [start.toString(), end.toString()],
    spots: [0, 50],
  });
  if (!eventsResult.ok) {
    return {meetings: [], events: []}
  }

  return {
    meetings: meetingsResult.data.filter(meeting => meeting.committee === "general"),
    events: eventsResult.data.slice(0, 5),
    cache: { maxage: 60 * 15 },
  };
}
