import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/env";

const INDEXNOW_KEY = "9e8b2f1a6c4d7e0f8123456789abcdef";
const INDEXNOW_ENDPOINT = "https://www.bing.com/indexnow";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const urls: string[] = body.urls || [];

    if (urls.length > 0) {
      const resp = await fetch(INDEXNOW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: "clivora.io",
          key: INDEXNOW_KEY,
          keyLocation: `https://clivora.io/${INDEXNOW_KEY}.txt`,
          urlList: urls.slice(0, 1000),
        }),
      });

      return NextResponse.json({ ok: resp.ok, status: resp.status, count: urls.length });
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
      "https://clivora.io/jobs",
      "https://clivora.io/connect",
      "https://clivora.io/for-freelancers",
      "https://clivora.io/for-clients",
      "https://clivora.io/pricing",
      "https://clivora.io/tools",
      "https://clivora.io/compare",
      "https://clivora.io/blog",
    ];

    const jobUrls = (jobs || []).map((j) => `https://clivora.io/jobs/view/${j.seo_slug}`);
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

export async function GET() {
  return NextResponse.json({
    service: "CLIVORA IndexNow Submitter",
    endpoint: INDEXNOW_ENDPOINT,
    keyLocation: `https://clivora.io/${INDEXNOW_KEY}.txt`,
    status: "active",
  });
}
