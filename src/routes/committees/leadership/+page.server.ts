import { getMeetings } from "$lib/events/meetings";

export const prerender = false;

export async function load({ locals }) {
  if (!locals.profile || locals.profile.role == "member") {
    return { meetings: [], authorized: false };
  }

  const meetingsResult = await getMeetings();
  if (!meetingsResult.ok) {
    return { meetings: [], authorized: true };
  }

  const meetings = meetingsResult.data
    .filter((meeting) => meeting.committee === "leadership")
    .sort(
      (a, b) => new Date(a.start!).getTime() - new Date(b.start!).getTime(),
    );

  return {
    meetings,
    authorized: true,
    cache: { maxage: 60 * 15 },
  };
}
