import { PUBLIC_API_URL } from "$env/static/public";

/**
 * Maps a /members/hours API response onto the fields the Hours page displays.
\ * @param {{name: string, all_hours: number, term_hours: number, grad_year: number, class: string}} data
 */
export function toHoursView(data) {
  return {
    name: data.name,
    allHours: data.all_hours,
    termHours: data.term_hours,
    gradYear: data.grad_year,
    className: data.class,
  };
}

/**
 * Looks up a member's hours from the API.
 * @param {string} name
 * @returns {Promise<ReturnType<typeof toHoursView>>}
 */
export async function fetchHours(name) {
  const res = await fetch(`${PUBLIC_API_URL}/members/hours`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error(`Server responded ${res.status}`);

  return toHoursView(await res.json());
}
