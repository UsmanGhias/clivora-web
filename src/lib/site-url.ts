/**
 * Canonical public origin for auth redirects, OAuth callbacks, sitemap, etc.
 * Prefer NEXT_PUBLIC_SITE_URL so Hostinger (clivora.io) and Vercel staging
 * can share the same codebase without hard-coding a host.
 */
export function getPublicSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    const withScheme = raw.startsWith("http") ? raw : `https://${raw}`;
    return withScheme.replace(/\/+$/, "");
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const withScheme = vercel.startsWith("http") ? vercel : `https://${vercel}`;
    return withScheme.replace(/\/+$/, "");
  }
  // Production default (Hostinger). Override with NEXT_PUBLIC_SITE_URL when needed.
  return "https://clivora.io";
}
