import { NextRequest, NextResponse } from "next/server";
import {
  AdminServiceConfigurationError,
  adminServiceHeaders,
  requireAdminServiceConfig,
} from "@/lib/admin-service";
import {
  BOT_JOB_SELECT,
  PUBLIC_JOB_SELECT,
  sanitizeJobPatchBody,
  sanitizeSlugOrUuidFilter,
  verifyJobBotApiKey,
} from "@/lib/api-v1/jobs-helpers";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const target = sanitizeSlugOrUuidFilter(id);
  if (!target.valid || !target.filter) {
    return NextResponse.json({ ok: false, error: "Invalid job identifier" }, { status: 400 });
  }

  const isAuthed = verifyJobBotApiKey(req);

  try {
    let baseUrl = SUPABASE_URL;
    let apiKey = SUPABASE_ANON_KEY;

    if (isAuthed) {
      const cfg = requireAdminServiceConfig();
      baseUrl = cfg.url;
      apiKey = cfg.serviceRoleKey;
    } else if (!baseUrl || !apiKey) {
      return NextResponse.json({ ok: false, error: "Jobs service unavailable" }, { status: 503 });
    }

    const query = new URLSearchParams();
    query.set("select", isAuthed ? BOT_JOB_SELECT : PUBLIC_JOB_SELECT);
    if (!isAuthed) {
      query.set("is_public", "eq.true");
      query.set("status", "eq.published");
    }
    const [col, val] = target.filter.split("=eq.");
    query.set(col, `eq.${val}`);
    query.set("limit", "1");

    const res = await fetch(`${baseUrl}/rest/v1/connect_jobs?${query.toString()}`, {
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });
    }

    const data = (await res.json()) as Array<Record<string, unknown>>;
    if (!data.length) {
      return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, job: data[0] });
  } catch (e) {
    if (e instanceof AdminServiceConfigurationError) {
      return NextResponse.json({ ok: false, error: "Jobs service unavailable" }, { status: 503 });
    }
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!verifyJobBotApiKey(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized: Valid API Key required" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const target = sanitizeSlugOrUuidFilter(id);
  if (!target.valid || !target.filter) {
    return NextResponse.json({ ok: false, error: "Invalid job identifier" }, { status: 400 });
  }

  let adminCfg: { url: string; serviceRoleKey: string };
  try {
    adminCfg = requireAdminServiceConfig();
  } catch {
    return NextResponse.json({ ok: false, error: "Database configuration missing" }, { status: 503 });
  }

  try {
    const rawBody = await req.json().catch(() => null);
    const patch = sanitizeJobPatchBody(rawBody);
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ ok: false, error: "No updatable job fields provided" }, { status: 400 });
    }

    const query = new URLSearchParams();
    const [col, val] = target.filter.split("=eq.");
    query.set(col, `eq.${val}`);
    query.set("select", BOT_JOB_SELECT);

    const res = await fetch(`${adminCfg.url}/rest/v1/connect_jobs?${query.toString()}`, {
      method: "PATCH",
      headers: adminServiceHeaders(adminCfg.serviceRoleKey, "return=representation"),
      body: JSON.stringify({
        ...patch,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "Failed to update job" },
        { status: res.status },
      );
    }

    const updated = (await res.json()) as Array<Record<string, unknown>>;
    return NextResponse.json({ ok: true, job: updated[0] || updated });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
