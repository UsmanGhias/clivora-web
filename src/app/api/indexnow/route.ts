import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminErrorResponse, requireAdminRequest } from "@/lib/admin-auth";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/env";
import { extractAuthToken, timingSafeStringEqual } from "@/lib/security-utils";

const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY?.trim() || "9e8b2f1a6c4d7e0f8123456789abcdef";
const INDEXNOW_ENDPOINT = "https://www.bing.com/indexnow";

async function authorizeIndexNow(req: Request): Promise<void> {
  const token = extractAuthToken(req, ["x-indexnow-token", "x-cron-secret"]);
  const validTokens = [
    process.env.INDEXNOW_ADMIN_TOKEN?.trim(),
    process.env.CRON_SECRET?.trim(),
  ].filter((t): t is string => Boolean(t));

  if (token && validTokens.some((secret) => timingSafeStringEqual(token, secret))) {
    return;
  }

  await requireAdminRequest(req, { requireAal2: true });
}

function sanitizeClivoraUrls(rawUrls: unknown): string[] {
  if (!Array.isArray(rawUrls)) return [];
  const clean: string[] = [];
  for (const item of rawUrls) {
    if (typeof item !== "string") continue;
    try {
      const parsed = new URL(item.trim());
      if (
        parsed.protocol === "https:" &&
        (parsed.hostname === "clivora.io" || parsed.hostname === "www.clivora.io")
      ) {
        clean.push(parsed.toString());
      }
    } catch {
      // Ignore malformed URLs.
    }
    if (clean.length >= 1000) break;
  }
  return Array.from(new Set(clean));
}

export async function POST(req: Request) {
  try {
    await authorizeIndexNow(req);
  } catch (err) {
    return adminErrorResponse(err, "Unauthorized");
  }

  try {
    const body = (await req.json().catch(() => ({}))) as { urls?: unknown };
    const providedUrls = sanitizeClivoraUrls(body.urls);

    if (providedUrls.length > 0) {
      const resp = await fetch(INDEXNOW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: "clivora.io",
          key: INDEXNOW_KEY,
          keyLocation: `https://clivora.io/${INDEXNOW_KEY}.txt`,
          urlList: providedUrls,
        }),
      });

      return NextResponse.json({
        ok: resp.ok,
        status: resp.status,
        count: providedUrls.length,
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: jobs } = await supabase
      .from("connect_jobs")
      .select("seo_slug")
      .eq("is_public", true)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(200);

    const coreUrls = [
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

    const jobUrls = (jobs || [])
      .filter((j) => Boolean(j.seo_slug))
      .map((j) => `https://clivora.io/jobs/view/${j.seo_slug}`);
    const allUrls = Array.from(new Set([...coreUrls, ...jobUrls]));

    const resp = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "clivora.io",
        key: INDEXNOW_KEY,
        keyLocation: `https://clivora.io/${INDEXNOW_KEY}.txt`,
        urlList: allUrls,
      }),
    });

    return NextResponse.json({
      ok: resp.ok,
      status: resp.status,
      submitted: allUrls.length,
      sample: allUrls.slice(0, 5),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await authorizeIndexNow(req);
  } catch (err) {
    return adminErrorResponse(err, "Unauthorized");
  }

  return NextResponse.json({
    service: "CLIVORA IndexNow Submitter",
    endpoint: INDEXNOW_ENDPOINT,
    keyLocation: `https://clivora.io/${INDEXNOW_KEY}.txt`,
    status: "active",
  });
}
