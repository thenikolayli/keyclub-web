import { logger } from "./logger";

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

// this is what the api should return, ideally
export function toResponse<T>(result: Result<T>, status: number): Response {
  if (result.ok) {
    return new Response(JSON.stringify(result), { status });
  }
  return new Response(
    JSON.stringify({ ok: false, error: result.error }),
    { status },
  );
}

export function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}
export function fail(error: string, cause?: unknown): { ok: false; error: string } {
  logger.error({error, cause}, error);
  return { ok: false, error };
}
