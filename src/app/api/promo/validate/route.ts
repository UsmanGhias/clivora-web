import { NextRequest, NextResponse } from "next/server";
import { PRO_PLUS_PRICE_USD, PRO_PRICE_USD } from "@/lib/pricing";
import { validatePromoCode } from "@/lib/promo-codes";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      code?: string;
      plan?: string;
      amountUsd?: number;
    };

    const plan = body.plan === "pro" ? "pro" : "pro_plus";
    const amountUsd =
      typeof body.amountUsd === "number" && body.amountUsd > 0
        ? body.amountUsd
        : plan === "pro_plus"
          ? PRO_PLUS_PRICE_USD
          : PRO_PRICE_USD;
    const promo = await validatePromoCode({
      code: String(body.code ?? ""),
      plan,
      amountUsd,
    });

    return NextResponse.json({ promo });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Promo validation failed" },
      { status: 400 },
    );
  }
}
