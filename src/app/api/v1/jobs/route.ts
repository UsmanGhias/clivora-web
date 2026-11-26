import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  AdminServiceConfigurationError,
  adminServiceHeaders,
  requireAdminServiceConfig,
} from "@/lib/admin-service";
import {
  BOT_JOB_SELECT,
  PUBLIC_JOB_SELECT,
  buildJobSearchOrClause,
  sanitizeJobStatus,
  sanitizePostgrestToken,
  verifyJobBotApiKey,
} from "@/lib/api-v1/jobs-helpers";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";

export const runtime = "nodejs";

/**
 * GET /api/v1/jobs
 * Query jobs for job.clivora.io bot and public job feeds.
 */
export async function GET(req: NextRequest) {
  const isAuthed = verifyJobBotApiKey(req);
  const { searchParams } = new URL(req.url);
  const limitRaw = Number(searchParams.get("limit") || 50);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(Math.trunc(limitRaw), 1), 200) : 50;
  const pageRaw = Number(searchParams.get("page") || 1);
  const page = Number.isFinite(pageRaw) ? Math.max(Math.trunc(pageRaw), 1) : 1;
  const offset = (page - 1) * limit;

  const category = searchParams.get("category");
  const language = searchParams.get("lang") || searchParams.get("language");
  const tag = searchParams.get("tag") || searchParams.get("tech");
  const jobType = searchParams.get("job_type") || searchParams.get("type");
  const query = searchParams.get("q") || searchParams.get("query");
  const rawStatus = searchParams.get("status");

  try {
    let baseUrl = SUPABASE_URL;
    let apiKey = SUPABASE_ANON_KEY;

    if (isAuthed) {
      const cfg = requireAdminServiceConfig();
      baseUrl = cfg.url;
      apiKey = cfg.serviceRoleKey;
    } else if (!baseUrl || !apiKey) {
      return NextResponse.json(
        { ok: false, error: "Public jobs database is not configured" },
        { status: 503 },
      );
    }

    const params = new URLSearchParams();
    params.set("select", isAuthed ? BOT_JOB_SELECT : PUBLIC_JOB_SELECT);
    params.set("order", "created_at.desc");
    params.set("limit", String(limit));
    params.set("offset", String(offset));

    if (!isAuthed) {
      params.set("is_public", "eq.true");
      params.set("status", "eq.published");
    } else if (rawStatus !== "all") {
      const safeStatus = sanitizeJobStatus(rawStatus);
      params.set("status", `in.(${safeStatus},published,active)`);
    }

    if (category && category !== "all" && category !== "general") {
      const safeCategory = sanitizePostgrestToken(category, /^[a-z0-9 _-]{1,80}$/i);
      if (safeCategory) params.set("category", `eq.${safeCategory}`);
    }

    if (language && language !== "all") {
      const safeLang = sanitizePostgrestToken(language, /^[a-z]{2,8}(?:-[a-z0-9]{2,8})?$/i);
      if (safeLang) params.set("language", `eq.${safeLang.toLowerCase()}`);
    }

    if (jobType && jobType !== "all") {
      const safeType = sanitizePostgrestToken(jobType, /^[a-z0-9_-]{1,40}$/i);
      if (safeType) params.set("job_type", `eq.${safeType.toLowerCase()}`);
    }

    if (tag && tag !== "all") {
      const safeTag = sanitizePostgrestToken(tag, /^[a-z0-9._+#/-]{1,50}$/i);
      if (safeTag) params.set("tags", `cs.{${safeTag.toLowerCase()}}`);
    }

    const orClause = buildJobSearchOrClause(query);
    if (orClause) {
      params.set("or", orClause);
    }

    const res = await fetch(`${baseUrl}/rest/v1/connect_jobs?${params.toString()}`, {
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        Prefer: "count=exact",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "Failed to fetch jobs from database" },
        { status: res.status },
      );
    }

    const data = (await res.json()) as Array<Record<string, unknown>>;
    const contentRange = res.headers.get("content-range");
    let totalCount = data.length;
    if (contentRange) {
      const match = contentRange.match(/\/(\d+)$/);
      if (match) totalCount = Number(match[1]);
    }

    const sanitized = data.map((job) => {
      if (!isAuthed) {
        return {
          id: job.id,
          title: job.title,
          company_name: job.company_name,
          category: job.category,
          language: job.language || "en",
          tags: job.tags,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          currency: job.currency,
          location: job.location,
          job_type: job.job_type,
          seo_slug: job.seo_slug,
          created_at: job.created_at,
          apply_url: `/jobs/view/${job.seo_slug || job.id}`,
        };
      }
      return job;
    });

    return NextResponse.json({
      ok: true,
      authenticated: isAuthed,
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      jobs: sanitized,
    });
  } catch (e) {
    if (e instanceof AdminServiceConfigurationError) {
      return NextResponse.json(
        { ok: false, error: "Jobs service is unavailable" },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/v1/jobs
 * Ingest new jobs from job.clivora.io crawler bot
 */
export async function POST(req: NextRequest) {
  if (!verifyJobBotApiKey(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized: Valid API Key required in x-api-key or Authorization Bearer header" },
      { status: 401 },
    );
  }

  let adminCfg: { url: string; serviceRoleKey: string };
  try {
    adminCfg = requireAdminServiceConfig();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Database service configuration missing" },
      { status: 503 },
    );
  }

  try {
    const body = await req.json();
    const {
      title,
      company_name,
      company_domain,
      company_email,
      description,
      category = "Software Development",
      tags = [],
      salary_min = null,
      salary_max = null,
      currency = "USD",
      location = "Remote",
      job_type = "full_time",
      source = "import",
      source_id = null,
      source_url = null,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: title and description are required" },
        { status: 400 },
      );
    }

    const slugBase = String(title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const randomSuffix = randomUUID().slice(0, 6);
    const seo_slug = `${slugBase}-${randomSuffix}`;

    const newJob = {
      title,
      company_name: company_name || "Confidential",
      company_domain: company_domain || null,
      company_email: company_email || null,
      description,
      category,
      tags: Array.isArray(tags) ? tags : [],
      salary_min: salary_min ? Number(salary_min) : null,
      salary_max: salary_max ? Number(salary_max) : null,
      currency,
      location,
      job_type,
      source,
      source_id,
      source_url,
      seo_slug,
      status: "published",
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const res = await fetch(`${adminCfg.url}/rest/v1/connect_jobs`, {
      method: "POST",
      headers: adminServiceHeaders(adminCfg.serviceRoleKey, "return=representation"),
      body: JSON.stringify(newJob),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { ok: false, error: "Failed to insert job: " + errText },
        { status: res.status },
      );
    }

    const inserted = (await res.json()) as Array<Record<string, unknown>>;
    const row = inserted[0] ?? {};
    delete row.claim_token;
    return NextResponse.json(
      { ok: true, message: "Job successfully created", job: row },
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
