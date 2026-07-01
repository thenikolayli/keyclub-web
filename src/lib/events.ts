import { PUBLIC_API_URL } from "$env/static/public";
import type { CalendarDate } from "@internationalized/date";

export interface EventSearchRequest {
  times: [number, number];
  length: [number, number];
  dates: [string, string];
  spots: [number, number];
}

export interface Event {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  length: number;
  address: string;
  nofOpenSlots: number;
  signUpUrl: string;
  description: string;
}

export async function searchEvents(params: EventSearchRequest) {
  const response = await fetch(`${PUBLIC_API_URL}/events/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) throw new Error(`Server responded ${response.status}`);

  return response.json() as Promise<Event[]>;
}
