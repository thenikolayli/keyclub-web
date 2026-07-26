import { PUBLIC_API_URL } from "$env/static/public";

export interface inviteRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Invite {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  expiresAt: string;
  acceptedAt: string | null;
}

export async function inviteCreate(request: inviteRequest) {
  const response = await fetch(`${PUBLIC_API_URL}/auth/invites/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(request),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function inviteAccept(token: string) {
  const response = await fetch(`${PUBLIC_API_URL}/auth/invites/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function listInvites(skip: number, limit: number) {
  const response = await fetch(
    `${PUBLIC_API_URL}/auth/invites?skip=${skip}&limit=${limit}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data as Invite[];
}
