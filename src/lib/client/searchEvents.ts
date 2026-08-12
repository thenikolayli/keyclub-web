import type { EventSearchRequest } from "$lib/types/events";

export const searchEvents = async (params: EventSearchRequest) => {
  const response = await fetch(`/api/events/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};
