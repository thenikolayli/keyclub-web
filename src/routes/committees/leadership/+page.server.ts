import { getMeetings } from "$lib/events/meetings";

export const prerender = false;

export async function load({ locals }) {
  const meetingsResult = await getMeetings();
  if (!meetingsResult.ok) {
    return { meetings: [] };
  }

  const meetings = meetingsResult.data
    .filter((meeting) => meeting.committee === "leadership")
    .sort(
      (a, b) => new Date(a.start!).getTime() - new Date(b.start!).getTime(),
    );

  return {
    meetings,
    cache: { maxage: 60 * 15 },
  };
}
