import { PUBLIC_API_URL } from "$env/static/public";

export interface HoursResponse {
  name: string;
  allHours: number;
  termHours: number;
  gradYear: number;
  className: string;
}

export async function fetchHours(name: string) {
  const response = await fetch(`${PUBLIC_API_URL}/members/hours`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return {
    name: data.name,
    allHours: data.all_hours,
    termHours: data.term_hours,
    gradYear: data.grad_year,
    className: data.class,
  } as HoursResponse;
}
