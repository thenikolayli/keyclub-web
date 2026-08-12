import postgres from "postgres";
import { SUPABASE_DIRECT_STRING } from "$env/static/private";

export const postgresClient = postgres(SUPABASE_DIRECT_STRING);
