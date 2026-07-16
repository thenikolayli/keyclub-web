import { PUBLIC_API_URL } from "$env/static/public";

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

let currentUser = $state<User | null>(null);
let loading = $state(false);

// object literal to manage user state
export const userState = {
  // getters for user and loading state
  get user() { return currentUser; },
  get loading() { return loading; },
  // method to fetch user data from the server
  async fetchUser() {
    loading = true;
    try {
      currentUser = await fetchUser();
    } catch {
      currentUser = null;
    } finally {
      loading = false;
    }
  },
  // method to clear user data
  clearUser() {
    currentUser = null;
  },
};

async function fetchUser(): Promise<User> {
  const response = await fetch(`${PUBLIC_API_URL}/auth/me`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) throw new Error(`Server responded ${response.status}`);
  return await response.json();
}