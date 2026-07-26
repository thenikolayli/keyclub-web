import { PUBLIC_API_URL } from "$env/static/public";

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export const userState = $state({user: null as User | null});

export async function updateUser() {
  const response = await fetch(`${PUBLIC_API_URL}/auth/me`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    userState.user = null;
  } else {
    userState.user = await response.json() as User;
  }
}