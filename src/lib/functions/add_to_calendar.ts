import { PUBLIC_API_URL } from "$env/static/public";

export interface AddToCalendarRequest {
    url: string;
}

export interface AddToCalendarResponse {
    url: string;
}

export async function addToCalendar(params: AddToCalendarRequest) {
  const response = await fetch(`${PUBLIC_API_URL}/events/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(params),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
