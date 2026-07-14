import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  "https://jtzjwgovqczlccyeujhq.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0emp3Z292cWN6bGNjeWV1amhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxODAwNzMsImV4cCI6MjA5ODc1NjA3M30.BwatkYlqX88GRCdyAvTCiUmsCF3Nc171an8XfosuuLM";

let browserClient: SupabaseClient | null = null;

export function createBrowserSupabaseClient() {
  if (!browserClient) {
    browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return browserClient;
}

export { SUPABASE_URL, SUPABASE_ANON_KEY };
