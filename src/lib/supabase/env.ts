/**
 * Supabase Environment Configuration & Accessors
 * Single source of truth for Supabase URL and public keys across the application.
 */

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!url) {
    if (process.env.NODE_ENV === "production" && !process.env.NEXT_PHASE) {
      console.warn("WARN: NEXT_PUBLIC_SUPABASE_URL is not set in environment.");
    }
    return "https://jtzjwgovqczlccyeujhq.supabase.co";
  }
  return url;
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production" && !process.env.NEXT_PHASE) {
      console.warn("WARN: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment.");
    }
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0emp3Z292cWN6bGNjeWV1amhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxODAwNzMsImV4cCI6MjA5ODc1NjA3M30.BwatkYlqX88GRCdyAvTCiUmsCF3Nc171an8XfosuuLM";
  }
  return key;
}

export const SUPABASE_URL = getSupabaseUrl();
export const SUPABASE_ANON_KEY = getSupabaseAnonKey();
