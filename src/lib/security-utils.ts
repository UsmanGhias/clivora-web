import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Constant-time equality over arbitrary-length secrets by hashing both inputs
 * to fixed-length 256-bit digests before timingSafeEqual.
 */
export function timingSafeStringEqual(
  provided: string | null | undefined,
  expected: string | null | undefined,
): boolean {
  if (!provided || !expected) return false;
  const a = createHash("sha256").update(provided, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

/**
 * Extract a secret presented either as `Authorization: Bearer <token>` or
 * via one of the specified fallback header names.
 */
export function extractAuthToken(
  req: Request,
  extraHeaders: string[] = [],
): string {
  for (const name of extraHeaders) {
    const val = req.headers.get(name)?.trim();
    if (val) return val;
  }
  const authHeader = req.headers.get("authorization") ?? "";
  if (/^bearer\s+/i.test(authHeader)) {
    return authHeader.replace(/^bearer\s+/i, "").trim();
  }
  return "";
}

const SAFEPAY_PAID_STATES = new Set([
  "ENDED",
  "PAID",
  "COMPLETED",
  "SETTLED",
  "CAPTURED",
  "SUCCEEDED",
  "SUCCESS",
]);

const SAFEPAY_UNPAID_PREFIXES = [
  "UN",
  "NOT",
  "FAIL",
  "CANCEL",
  "EXPIRE",
  "PENDING",
  "VOID",
  "REFUND",
  "DECLIN",
  "REJECT",
  "INIT",
  "OPEN",
  "WAIT",
];

/**
 * Exact-token verification of SafePay tracker states. Prevents substring traps
 * such as "UNPAID".includes("PAID") === true.
 */
export function isSafepayPaidState(rawState?: string | null): boolean {
  if (!rawState) return false;
  const normalized = rawState.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");
  if (!normalized) return false;
  for (const prefix of SAFEPAY_UNPAID_PREFIXES) {
    if (normalized.startsWith(prefix)) return false;
  }
  return SAFEPAY_PAID_STATES.has(normalized);
}

/**
 * Strip PostgREST filter delimiters and wildcards from user search queries so
 * interpolated `or=(...)` filters cannot inject extra filter clauses.
 */
export function sanitizePostgrestSearch(raw: string, maxLen = 120): string {
  return raw
    .replace(/[*(),."'`\\;\r\n\0]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

/**
 * Strict identifier validation for PostgREST `eq.` / `cs.` filter values.
 */
export function sanitizePostgrestToken(
  raw: string,
  allowedPattern = /^[a-z0-9_-]{1,80}$/i,
): string | null {
  const trimmed = raw.trim();
  if (!trimmed || !allowedPattern.test(trimmed)) return null;
  return trimmed;
}

export { escapeHtml, serializeJsonLd } from "./html-safety";

/**
 * Extract best-effort client IP from reverse-proxy headers on Node/Vercel.
 */
export function getClientIp(req: Request): string {
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const vercelIp = req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercelIp) return vercelIp;
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "127.0.0.1";
}

type RateBucket = {
  hits: number[];
};

const MAX_RATE_BUCKETS = 10_000;
const rateBuckets = new Map<string, RateBucket>();

/**
 * Sliding-window in-memory rate limiter per namespace+key. Safe fallback protection
 * against abuse bursts when deployed on serverless/Node workers.
 */
export function consumeIpRateLimit(
  namespace: string,
  key: string,
  maxRequests: number,
  windowMs: number,
): { allowed: boolean; retryAfterSeconds: number; remaining: number } {
  const now = Date.now();
  const fullKey = `${namespace}:${key}`;

  if (rateBuckets.size >= MAX_RATE_BUCKETS) {
    for (const [k, b] of rateBuckets.entries()) {
      b.hits = b.hits.filter((ts) => now - ts < windowMs);
      if (b.hits.length === 0) rateBuckets.delete(k);
      if (rateBuckets.size < MAX_RATE_BUCKETS * 0.8) break;
    }
  }

  let bucket = rateBuckets.get(fullKey);
  if (!bucket) {
    bucket = { hits: [] };
    rateBuckets.set(fullKey, bucket);
  }
  bucket.hits = bucket.hits.filter((ts) => now - ts < windowMs);

  if (bucket.hits.length >= maxRequests) {
    const oldest = bucket.hits[0] ?? now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return { allowed: false, retryAfterSeconds, remaining: 0 };
  }

  bucket.hits.push(now);
  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: Math.max(0, maxRequests - bucket.hits.length),
  };
}

/**
 * Safe PostgREST `.or()` filter for client-shared CRM tables (`invoice_shares`,
 * `project_shares`, `quote_shares`) avoiding raw comma/paren filter injection.
 */
export function buildClientShareFilter(uid: string, email?: string | null): string {
  const safeUid = sanitizePostgrestToken(uid, /^[a-z0-9-]+$/i);
  const uidClause = safeUid ? `client_uid.eq.${safeUid}` : "client_uid.is.null";
  const normalized = email?.trim().toLowerCase() ?? "";
  if (!normalized || !/^[^\s@,"()\\]+@[^\s@,"()\\]+$/.test(normalized)) {
    return uidClause;
  }
  const escaped = normalized.replace(/"/g, "");
  return `${uidClause},client_email.eq."${escaped}"`;
}
