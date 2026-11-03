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
    return "https://your-project-ref.supabase.co";
  }
  return url;
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production" && !process.env.NEXT_PHASE) {
      console.warn("WARN: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment.");
    }
    return "your-development-anon-key";
  }
  return key;
}

export const SUPABASE_URL = getSupabaseUrl();
export const SUPABASE_ANON_KEY = getSupabaseAnonKey();
