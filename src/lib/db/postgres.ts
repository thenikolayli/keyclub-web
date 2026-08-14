import postgres from "postgres";
import { SUPABASE_DIRECT_STRING } from "$env/static/private";

export const supabase = postgres(SUPABASE_DIRECT_STRING);
