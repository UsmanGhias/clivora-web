import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? "https://jtzjwgovqczlccyeujhq.supabase.co";

function serviceKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

function restHeaders(key: string) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      action: "list" | "set" | "delete";
      adminEmail?: string;
      adminToken?: string;
      key?: string;
      value?: unknown;
      description?: string;
    };

    const { action, adminEmail, adminToken } = body;
    await requireAdminRequest(req);

    const svcKey = serviceKey();
    if (!svcKey) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY not configured" },
        { status: 503 },
      );
    }
    const headers = restHeaders(svcKey);

    if (action === "list") {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/app_feature_flags?select=*&order=key.asc`,
        { headers, cache: "no-store" },
      );
      const flags = res.ok ? await res.json() : [];
      return NextResponse.json({ flags });
    }

    if (action === "set") {
      const { key, value, description } = body;
      if (!key?.trim()) {
        return NextResponse.json({ error: "key is required" }, { status: 400 });
      }
      const payload = {
        key: key.trim(),
        value: value ?? null,
        description: description ?? null,
        updated_at: new Date().toISOString(),
      };
      const res = await fetch(`${SUPABASE_URL}/rest/v1/app_feature_flags`, {
        method: "POST",
        headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Upsert failed");
      }
      return NextResponse.json({ ok: true });
    }

    if (action === "delete") {
      const { key } = body;
      if (!key?.trim()) {
        return NextResponse.json({ error: "key is required" }, { status: 400 });
      }
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/app_feature_flags?key=eq.${encodeURIComponent(key.trim())}`,
        { method: "DELETE", headers: { ...headers, Prefer: "return=minimal" } },
      );
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Delete failed");
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Request failed" },
      { status: 400 },
    );
  }
}
