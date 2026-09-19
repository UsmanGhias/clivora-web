import { createClient as createServiceClient, type SupabaseClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://jtzjwgovqczlccyeujhq.supabase.co";

type Plan = "pro" | "pro_plus";

type PromoRow = {
  code: string;
  discount_type: string;
  discount_value: number | string;
  applies_to: string;
  max_uses: number | string | null;
  used_count: number | string | null;
  expires_at: string | null;
  is_active: boolean | null;
};

export type ValidatedPromo = {
  code: string;
  discountType: string;
  discountValue: number;
  note: string;
  finalAmountUsd: number;
};

async function promoClient(): Promise<Pick<SupabaseClient, "rpc">> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    return createServiceClient(SUPABASE_URL, serviceKey, { auth: { persistSession: false } });
  }
  return createServerClient();
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function discountedAmount(amountUsd: number, discountType: string, discountValue: number) {
  const amount = Number.isFinite(amountUsd) && amountUsd > 0 ? amountUsd : 0;
  if (discountType === "percent") {
    return roundMoney(Math.max(0, amount * (1 - discountValue / 100)));
  }
  return roundMoney(Math.max(0, amount - discountValue));
}

export async function validatePromoCode({
  code: codeRaw,
  plan,
  amountUsd,
}: {
  code: string;
  plan: Plan;
  amountUsd: number;
}): Promise<ValidatedPromo | null> {
  const code = codeRaw.trim().toUpperCase();
  if (!code) return null;

  // promo_code_lookup keys on the code the caller presented. Reading the table
  // directly would need a policy broad enough to expose every live discount,
  // because RLS cannot see the typed code.
  const supabase = await promoClient();
  const { data: rows, error } = await supabase.rpc("promo_code_lookup", { p_code: code });

  if (error) throw new Error(error.message);
  const data = (Array.isArray(rows) ? rows[0] : rows) as PromoRow | null;
  if (!data || !data.is_active) throw new Error("Promo code is invalid or inactive");
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    throw new Error("Promo code expired");
  }
  if (data.max_uses != null && Number(data.used_count ?? 0) >= Number(data.max_uses)) {
    throw new Error("Promo code usage limit reached");
  }
  if (data.applies_to !== "any" && data.applies_to !== plan) {
    throw new Error(`Promo applies to ${data.applies_to} only`);
  }

  const discountValue = Number(data.discount_value);
  const note =
    data.discount_type === "percent"
      ? `${discountValue}% off ${plan === "pro_plus" ? "Pro Plus" : "Pro"}`
      : `$${discountValue} off`;

  return {
    code: data.code,
    discountType: data.discount_type,
    discountValue,
    note,
    finalAmountUsd: discountedAmount(amountUsd, data.discount_type, discountValue),
  };
}

/**
 * Spend one use of a promo code. Returns false when the code is unknown,
 * inactive, expired, or already at its cap.
 *
 * promo_code_redeem re-checks the cap inside the UPDATE, so this is safe to call
 * concurrently and cannot overshoot max_uses. It must stay server-side: an
 * increment issued from the browser is one the browser can decline to send.
 */
export async function redeemPromoCode(codeRaw: string): Promise<boolean> {
  const code = codeRaw.trim().toUpperCase();
  if (!code) return false;

  const supabase = await promoClient();
  const { data, error } = await supabase.rpc("promo_code_redeem", { p_code: code });
  if (error) {
    console.error("[promo] redeem failed", error.message);
    return false;
  }
  const row = Array.isArray(data) ? data[0] : data;
  return row != null;
}
