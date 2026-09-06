import { ok, fail } from "../responses";
import type { Result } from "../responses";

export function isValidPassword(password: string): Result<null> {
  if (password.length < 6) {
    return fail("Password must be at least 6 characters long.");
  }
  return ok(null);
}
