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
      action: "admin_release" | "list_milestones";
      adminEmail?: string;
      adminToken?: string;
      milestoneId?: string;
      requestId?: string;
      amount?: number;
      currency?: string;
      notes?: string;
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

    if (action === "list_milestones") {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/connect_milestones?select=*&order=created_at.desc&limit=100`,
        { headers, cache: "no-store" },
      );
      const milestones = res.ok ? await res.json() : [];
      return NextResponse.json({ milestones });
    }

    if (action === "admin_release") {
      return NextResponse.json(
        { error: "Live escrow release is disabled until the transactional funds RPC is deployed." },
        { status: 410 },
      );
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Request failed" },
      { status: 400 },
    );
  }
}
