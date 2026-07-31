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

async function promoClient(): Promise<Pick<SupabaseClient, "from">> {
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

  const supabase = await promoClient();
  const { data, error } = await supabase
    .from("promo_codes")
    .select("code, discount_type, discount_value, applies_to, max_uses, used_count, expires_at, is_active")
    .eq("code", code)
    .maybeSingle<PromoRow>();

  if (error) throw new Error(error.message);
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
