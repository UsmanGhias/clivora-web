import { NextRequest, NextResponse } from "next/server";
import { redeemPromoCode } from "@/lib/promo-codes";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Spend one use of a promo code, after a payment request has been recorded.
//
// This used to happen in the browser as a select-then-update on promo_codes.
// That never worked (the table has no client UPDATE policy, and the error was
// swallowed), and would have been wrong anyway: read-then-write is not atomic.
// The increment now runs here and the cap is enforced inside the SQL statement.

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { data: recentEvents, error: auditError } = await supabase
      .from('audit_events')
      .select('id')
      .eq('user_id', user.id)
      .eq('action', 'promo_redeem')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());
      
    if (auditError) {
      console.error("[promo/redeem] audit check failed:", auditError);
      return NextResponse.json({ error: "redeem_failed" }, { status: 500 });
    }
    
    if (recentEvents && recentEvents.length > 5) {
      return NextResponse.json({ error: "rate_limit_exceeded" }, { status: 429 });
    }

    const body = (await req.json().catch(() => null)) as { code?: string } | null;
    const code = String(body?.code ?? "").trim();
    if (!code) return NextResponse.json({ error: "code_required" }, { status: 400 });

    const redeemed = await redeemPromoCode(code);
    
    await supabase.from('audit_events').insert({
      user_id: user.id,
      action: 'promo_redeem',
      metadata: { code, success: redeemed }
    });
    
    return NextResponse.json({ redeemed });
  } catch (err) {
    console.error("[promo/redeem]", err);
    return NextResponse.json({ error: "redeem_failed" }, { status: 500 });
  }
}
