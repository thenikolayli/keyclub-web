import { PUBLIC_API_URL } from "$env/static/public";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface UpdateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export async function listUsers(skip: number, limit: number) {
  const response = await fetch(
    `${PUBLIC_API_URL}/auth/users?skip=${skip}&limit=${limit}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data as User[];
}

export async function updateUser(id: string, userData: UpdateUserRequest) {
  const response = await fetch(`${PUBLIC_API_URL}/auth/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function deleteUser(id: string) {
  const response = await fetch(`${PUBLIC_API_URL}/auth/users/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
