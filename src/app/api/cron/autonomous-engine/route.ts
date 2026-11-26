import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdminServiceConfig } from "@/lib/admin-service";
import { extractAuthToken, timingSafeStringEqual } from "@/lib/security-utils";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY?.trim() || "9e8b2f1a6c4d7e0f8123456789abcdef";
const INDEXNOW_ENDPOINT = "https://www.bing.com/indexnow";

type AuthCheck = { ok: true } | { ok: false; status: 401 | 503; error: string };

function checkAuthorization(req: Request): AuthCheck {
  const cronSecret = process.env.CRON_SECRET?.trim() ?? "";
  if (!cronSecret) {
    return { ok: false, status: 503, error: "cron_secret_not_configured" };
  }

  const token = extractAuthToken(req, ["x-cron-secret"]);
  if (!timingSafeStringEqual(token, cronSecret)) {
    return { ok: false, status: 401, error: "unauthorized" };
  }
  return { ok: true };
}

const CORE_PLATFORM_URLS = [
  "https://clivora.io",
  "https://clivora.io/open-source",
  "https://clivora.io/download",
  "https://clivora.io/download/apk",
  "https://clivora.io/jobs",
  "https://clivora.io/connect",
  "https://clivora.io/for-freelancers",
  "https://clivora.io/for-clients",
  "https://clivora.io/pricing",
  "https://clivora.io/tools",
  "https://clivora.io/tools/upwork-fee-calculator",
  "https://clivora.io/tools/fiverr-fee-calculator",
  "https://clivora.io/tools/client-savings-calculator",
  "https://clivora.io/tools/freelance-rate-calculator",
  "https://clivora.io/tools/invoice-generator",
  "https://clivora.io/tools/contract-generator",
  "https://clivora.io/tools/badge-generator",
  "https://clivora.io/compare",
  "https://clivora.io/compare/upwork",
  "https://clivora.io/compare/fiverr",
  "https://clivora.io/compare/contra",
  "https://clivora.io/compare/bonsai",
  "https://clivora.io/blog",
  "https://clivora.io/sitemap",
];

async function runOptimizationCycle() {
  const startedAt = Date.now();
  const { url: supabaseUrl, serviceRoleKey } = requireAdminServiceConfig();
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // 1. Stage 1: Trigger External Job Crawler
  let crawlerReport: Record<string, unknown> = { status: "pending" };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35000);

    const edgeRes = await fetch(`${supabaseUrl}/functions/v1/sync-external-jobs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sources: ["remotive", "arbeitnow", "hackernews", "freehire", "oss"],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (edgeRes.ok) {
      crawlerReport = await edgeRes.json();
    } else {
      const errText = await edgeRes.text().catch(() => "");
      crawlerReport = {
        ok: false,
        status: edgeRes.status,
        error: errText.slice(0, 200),
      };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    crawlerReport = {
      ok: false,
      note: "Dispatched crawler; responded or timed out gracefully.",
      detail: errorMsg,
    };
  }

  // 2. Stage 2: Query Latest Jobs and Submit to IndexNow
  let indexNowReport: Record<string, unknown> = { status: "skipped" };
  let allUrls: string[] = [];
  try {
    const { data: recentJobs, error: jobsErr } = await supabase
      .from("connect_jobs")
      .select("seo_slug")
      .eq("is_public", true)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(250);

    if (jobsErr) {
      console.error("[autonomous-engine] Failed to query recent jobs:", jobsErr.message);
    }

    const jobUrls = (recentJobs || [])
      .filter((j) => Boolean(j.seo_slug))
      .map((j) => `https://clivora.io/jobs/view/${j.seo_slug}`);

    allUrls = Array.from(new Set([...CORE_PLATFORM_URLS, ...jobUrls]));

    const indexNowRes = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "clivora.io",
        key: INDEXNOW_KEY,
        keyLocation: `https://clivora.io/${INDEXNOW_KEY}.txt`,
        urlList: allUrls.slice(0, 500),
      }),
    });

    indexNowReport = {
      ok: indexNowRes.ok,
      status: indexNowRes.status,
      submittedUrls: allUrls.length,
      sample: allUrls.slice(0, 5),
    };
  } catch (err: unknown) {
    indexNowReport = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  // 3. Stage 3: Self-Healing Telemetry and Health Audit
  let telemetryReport: Record<string, unknown> = {};
  try {
    const { count: totalJobs } = await supabase
      .from("connect_jobs")
      .select("id", { count: "exact", head: true });

    const { count: emptyEventsCount } = await supabase
      .from("clivora_events")
      .select("id", { count: "exact", head: true })
      .is("event_type", null);

    if (emptyEventsCount && emptyEventsCount > 0) {
      await supabase.from("clivora_events").delete().is("event_type", null);
    }

    telemetryReport = {
      totalJobs: totalJobs ?? 0,
      healedGhostEvents: emptyEventsCount ?? 0,
      status: "optimal",
    };
  } catch (err: unknown) {
    telemetryReport = {
      status: "warning",
      error: err instanceof Error ? err.message : String(err),
    };
  }

  return {
    ok: true,
    engine: "Clivora Autonomous Self-Optimizing Engine",
    timestamp: new Date().toISOString(),
    durationMs: Date.now() - startedAt,
    cycle: {
      crawler: crawlerReport,
      indexing: indexNowReport,
      telemetry: telemetryReport,
    },
  };
}

async function handleCron(req: Request) {
  const auth = checkAuthorization(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    const result = await runOptimizationCycle();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "cron_unavailable" },
      { status: 503 },
    );
  }
}

export async function GET(req: Request) {
  return handleCron(req);
}

export async function POST(req: Request) {
  return handleCron(req);
}
