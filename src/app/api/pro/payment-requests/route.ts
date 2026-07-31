import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { PRO_PLUS_PRICE_USD, PRO_PRICE_USD } from "@/lib/pricing";
import { validatePromoCode } from "@/lib/promo-codes";
import { SUPABASE_URL } from "@/lib/supabase/env";

export const runtime = "nodejs";

const ALLOWED_METHODS = new Set(["jazzcash", "easypaisa", "bank", "manual"]);
const ALLOWED_COUNTRIES = new Set(["PK", "US", "AE", "GB", "OTHER"]);

function privateJson(body: unknown, init?: { status?: number }) {
  return NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: {
      "Cache-Control": "private, no-store",
      Vary: "Cookie, Authorization",
    },
  });
}

function serviceWriter() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) return null;
  return createServiceClient(SUPABASE_URL, key, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return privateJson({ error: "Authentication required" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as {
      plan?: string;
      accountType?: string;
      fullName?: string;
      email?: string;
      country?: string;
      paymentMethod?: string;
      paymentReference?: string;
      notes?: string;
      promoCode?: string;
      amountUsd?: number;
      status?: string;
      user_id?: string;
    };

    const plan = body.plan === "pro" ? "pro" : body.plan === "pro_plus" ? "pro_plus" : null;
    if (!plan) {
      return privateJson({ error: "Invalid plan" }, { status: 400 });
    }

    const accountType = body.accountType === "client" ? "client" : "freelancer";
    const email = String(body.email ?? user.email ?? "")
      .trim()
      .toLowerCase();
    const fullName = String(body.fullName ?? "").trim().slice(0, 200);
    const countryRaw = String(body.country ?? "PK").trim().toUpperCase();
    const country = ALLOWED_COUNTRIES.has(countryRaw) ? countryRaw : "OTHER";
    const paymentMethod = String(body.paymentMethod ?? "").trim().toLowerCase();
    const paymentReference = String(body.paymentReference ?? "").trim().slice(0, 200);
    const notes = String(body.notes ?? "").trim().slice(0, 2000);

    if (!email.includes("@") || email.length > 320) {
      return privateJson({ error: "Valid email required" }, { status: 400 });
    }
    if (!fullName) {
      return privateJson({ error: "Full name required" }, { status: 400 });
    }
    if (!ALLOWED_METHODS.has(paymentMethod)) {
      return privateJson({ error: "Invalid payment method" }, { status: 400 });
    }
    if (paymentMethod !== "manual" && paymentReference.length < 4) {
      return privateJson({ error: "Payment reference required" }, { status: 400 });
    }

    const baseAmount = plan === "pro_plus" ? PRO_PLUS_PRICE_USD : PRO_PRICE_USD;
    let promo: Awaited<ReturnType<typeof validatePromoCode>> = null;
    if (body.promoCode?.trim()) {
      try {
        promo = await validatePromoCode({
          code: body.promoCode,
          plan,
          amountUsd: baseAmount,
        });
      } catch (err) {
        return privateJson(
          { error: err instanceof Error ? err.message : "Invalid promo code" },
          { status: 400 },
        );
      }
    }

    const amountDue = promo?.finalAmountUsd ?? baseAmount;
    // Ignore client-supplied amountUsd / status / user_id — server is source of truth.
    if (
      typeof body.amountUsd === "number" &&
      Number.isFinite(body.amountUsd) &&
      Math.abs(body.amountUsd - amountDue) > 0.01 &&
      !promo
    ) {
      // Soft check only when no promo: client may send list price; always store server amount.
    }

    const writer = serviceWriter();
    if (!writer) {
      console.error("[pro/payment-requests] missing SUPABASE_SERVICE_ROLE_KEY");
      return privateJson({ error: "Payment service unavailable" }, { status: 503 });
    }

    const noteParts = [notes];
    if (promo) noteParts.push(`Promo: ${promo.code} (${promo.note})`);

    const { data: row, error: insertError } = await writer
      .from("pro_payment_requests")
      .insert({
        email,
        full_name: fullName,
        account_type: accountType,
        plan,
        amount_usd: amountDue,
        currency: "USD",
        country,
        payment_method: paymentMethod,
        payment_reference: paymentReference || `manual_${user.id.slice(0, 8)}_${Date.now()}`,
        notes: noteParts.filter(Boolean).join("\n"),
        promo_code: promo?.code ?? null,
        status: "pending",
        user_id: user.id,
      })
      .select("id")
      .maybeSingle();

    if (insertError) {
      console.error("[pro/payment-requests] insert failed", insertError.message);
      return privateJson({ error: "Could not submit payment request" }, { status: 400 });
    }

    if (promo?.code) {
      try {
        const { data: promoRow } = await writer
          .from("promo_codes")
          .select("used_count")
          .eq("code", promo.code)
          .maybeSingle();
        await writer
          .from("promo_codes")
          .update({ used_count: Number(promoRow?.used_count ?? 0) + 1 })
          .eq("code", promo.code);
      } catch (err) {
        console.error(
          "[pro/payment-requests] promo used_count update failed",
          err instanceof Error ? err.message : err,
        );
      }
    }

    return privateJson({ ok: true, id: row?.id ?? null });
  } catch (err) {
    console.error(
      "[pro/payment-requests] unexpected",
      err instanceof Error ? err.message : err,
    );
    return privateJson({ error: "Could not submit payment request" }, { status: 500 });
  }
}
