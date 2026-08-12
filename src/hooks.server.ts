import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_PUBLISHABLE_KEY,
} from "$env/static/public";
import { createServerClient } from "@supabase/ssr";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return event.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          /**
           * Note: You have to add the `path` variable to the
           * set and remove method due to sveltekit's cookie API
           * requiring this to be set, setting the path to `/`
           * will replicate previous/standard behavior (https://kit.svelte.dev/docs/types#public-types-cookies)
           */
          cookiesToSet.forEach(({ name, value, options }) =>
            event.cookies.set(name, value, { ...options, path: "/" }),
          );
          if (Object.keys(headers).length > 0) {
            event.setHeaders(headers);
          }
        },
      },
    },
  );

  // loads the profile of the current user into event locals per-request
  const user = await event.locals.supabase.auth.getUser();
  if (user.data.user) {
    const profile = await event.locals.supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.data.user.id)
      .single();

    if (profile.data) {
      event.locals.profile = profile.data;
    }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version";
    },
  });
};
