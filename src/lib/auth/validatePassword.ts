import type { Result } from "../responses";

export function isValidPassword(password: string): Result<null> {
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters long." };
  }
  return { ok: true, data: null };
}
