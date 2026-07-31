const DEV_FALLBACK_URL = "https://jtzjwgovqczlccyeujhq.supabase.co";
const DEV_FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0emp3Z292cWN6bGNjeWV1amhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxODAwNzMsImV4cCI6MjA5ODc1NjA3M30.BwatkYlqX88GRCdyAvTCiUmsCF3Nc171an8XfosuuLM";

const isLocalDev = process.env.NODE_ENV === "development";
/** Next.js sets this while compiling / collecting page data. */
const isNextBuild = process.env.NEXT_PHASE === "phase-production-build";

function resolveSupabaseUrl(): string {
  const fromEnv = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL)?.trim();
  if (fromEnv) return fromEnv;
  if (isLocalDev || isNextBuild) return DEV_FALLBACK_URL;
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)");
}

function resolveAnonKey(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (fromEnv) return fromEnv;
  if (isLocalDev || isNextBuild) return DEV_FALLBACK_ANON_KEY;
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const SUPABASE_URL = resolveSupabaseUrl();
export const SUPABASE_ANON_KEY = resolveAnonKey();
