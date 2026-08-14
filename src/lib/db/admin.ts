import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SECRET_KEY } from '$env/static/private';

// Admin client for inserts and such, only to be used in remote functions or api routes
export const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  SUPABASE_SECRET_KEY,
);
