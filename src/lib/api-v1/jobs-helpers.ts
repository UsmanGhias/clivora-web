import {
  extractAuthToken,
  sanitizePostgrestSearch,
  sanitizePostgrestToken,
  timingSafeStringEqual,
} from "@/lib/security-utils";

export const PUBLIC_JOB_SELECT = [
  "id",
  "title",
  "company_name",
  "company_domain",
  "description",
  "category",
  "language",
  "tags",
  "salary_min",
  "salary_max",
  "currency",
  "location",
  "job_type",
  "source",
  "source_url",
  "seo_slug",
  "status",
  "is_public",
  "expires_at",
  "created_at",
  "updated_at",
].join(",");

export const BOT_JOB_SELECT = [
  PUBLIC_JOB_SELECT,
  "source_id",
  "posted_by",
  "claimed_by",
].join(",");

export const ALLOWED_JOB_PATCH_FIELDS = new Set([
  "title",
  "company_name",
  "company_domain",
  "company_email",
  "description",
  "category",
  "language",
  "tags",
  "salary_min",
  "salary_max",
  "currency",
  "location",
  "job_type",
  "source_url",
  "status",
  "is_public",
  "expires_at",
]);

const ALLOWED_JOB_STATUSES = new Set(["published", "active", "draft", "expired", "removed"]);

export function verifyJobBotApiKey(req: Request): boolean {
  const allowed = [
    process.env.JOB_BOT_API_KEY?.trim(),
    process.env.CLIVORA_API_KEY?.trim(),
  ].filter((k): k is string => Boolean(k));

  if (allowed.length === 0) return false;
  const token = extractAuthToken(req, ["x-api-key"]);
  if (!token) return false;
  return allowed.some((key) => timingSafeStringEqual(token, key));
}

export function sanitizeJobPatchBody(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const src = raw as Record<string, unknown>;
  const patch: Record<string, unknown> = {};
  for (const key of ALLOWED_JOB_PATCH_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(src, key)) continue;
    patch[key] = src[key];
  }
  return patch;
}

export function sanitizeJobStatus(raw: string | null): string {
  const cleaned = (raw ?? "published").trim().toLowerCase();
  return ALLOWED_JOB_STATUSES.has(cleaned) ? cleaned : "published";
}

export function buildJobSearchOrClause(rawQuery: string | null): string | null {
  if (!rawQuery) return null;
  const cleaned = sanitizePostgrestSearch(rawQuery);
  if (!cleaned) return null;
  return `(title.ilike.*${cleaned}*,company_name.ilike.*${cleaned}*,description.ilike.*${cleaned}*)`;
}

export function sanitizeSlugOrUuidFilter(rawId: string): {
  valid: boolean;
  filter?: string;
} {
  const trimmed = rawId.trim();
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed);
  if (isUuid) {
    return { valid: true, filter: `id=eq.${trimmed.toLowerCase()}` };
  }
  const safeSlug = sanitizePostgrestToken(trimmed, /^[a-z0-9._-]{1,180}$/i);
  if (!safeSlug) return { valid: false };
  return { valid: true, filter: `seo_slug=eq.${safeSlug}` };
}

export { sanitizePostgrestToken };
