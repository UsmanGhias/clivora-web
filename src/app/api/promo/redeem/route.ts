import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { requireAdminServiceConfig } from "@/lib/admin-service";
import { redeemPromoCode } from "@/lib/promo-codes";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { url, serviceRoleKey } = requireAdminServiceConfig();
    const admin = createServiceClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { data: recentEvents, error: auditError } = await admin
      .from("audit_events")
      .select("id")
      .eq("actor_uid", user.id)
      .eq("action", "promo_redeem")
      .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

    if (auditError) {
      console.error("[promo/redeem] audit check failed:", auditError);
      return NextResponse.json({ error: "redeem_failed" }, { status: 500 });
    }

    if (recentEvents && recentEvents.length >= 5) {
      return NextResponse.json({ error: "rate_limit_exceeded" }, { status: 429 });
    }

    const body = (await req.json().catch(() => null)) as { code?: string } | null;
    const code = String(body?.code ?? "").trim().toUpperCase();
    if (!code) return NextResponse.json({ error: "code_required" }, { status: 400 });

    const redeemed = await redeemPromoCode(code);

    await admin.from("audit_events").insert({
      actor_uid: user.id,
      workspace_uid: user.id,
      action: "promo_redeem",
      entity_type: "promo_code",
      entity_id: code,
      payload: { code, success: redeemed },
    });

    return NextResponse.json({ redeemed });
  } catch (err) {
    console.error("[promo/redeem]", err);
    return NextResponse.json({ error: "redeem_failed" }, { status: 500 });
  }
}
