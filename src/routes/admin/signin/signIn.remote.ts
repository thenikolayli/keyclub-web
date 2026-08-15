import * as v from 'valibot';
import { form } from '$app/server';
import type { Result } from '$lib/types/responses';
import { getRequestEvent } from '$app/server';

export const signIn = form(
  v.object({
    email: v.pipe(v.string(), v.email(), v.nonEmpty()),
    password: v.pipe(v.string(), v.nonEmpty()),
  }),
  async ({ email, password }): Promise<Result<null>> => {
    const event = getRequestEvent();
    const supabase = event.locals.supabase;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true, data: null };
  },
)
