import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://jtzjwgovqczlccyeujhq.supabase.co";

function serviceKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

function headers(key: string) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

const ALLOWED_STATUS = new Set(["open", "in_progress", "resolved", "closed"]);

export async function POST(req: NextRequest) {
  try {
    await requireAdminRequest(req, { requireAal2: false });
    const key = serviceKey();
    if (!key) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as {
      action?: string;
      id?: string;
      status?: string;
      admin_notes?: string;
      priority?: string;
    };

    const action = String(body.action ?? "update");
    const id = String(body.id ?? "").trim();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    if (action !== "update") {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (typeof body.status === "string" && body.status.trim()) {
      const status = body.status.trim().toLowerCase();
      if (!ALLOWED_STATUS.has(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      patch.status = status;
    }
    if (typeof body.admin_notes === "string") {
      patch.admin_notes = body.admin_notes;
    }
    if (typeof body.priority === "string" && body.priority.trim()) {
      patch.priority = body.priority.trim().toLowerCase();
    }
    if (Object.keys(patch).length <= 1) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/support_tickets?id=eq.${encodeURIComponent(id)}`,
      { method: "PATCH", headers: headers(key), body: JSON.stringify(patch) },
    );
    if (!res.ok) {
      return NextResponse.json({ error: await res.text() }, { status: 400 });
    }
    const rows = (await res.json()) as unknown[];
    return NextResponse.json({ ok: true, ticket: rows[0] ?? null });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Request failed" },
      { status: 400 },
    );
  }
}
