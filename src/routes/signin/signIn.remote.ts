import * as v from 'valibot';
import { form } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { fail } from '$lib/responses';
import type { Result } from '$lib/responses';
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
      return fail(error.message);
    }
    throw redirect(303, "/admin");
  },
)
