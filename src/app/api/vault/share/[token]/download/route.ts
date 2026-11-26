import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { requireAdminServiceConfig } from "@/lib/admin-service";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { consumeIpRateLimit, getClientIp } from "@/lib/security-utils";
import { createClient } from "@/lib/supabase/server";

// Counted download for a vault share link.
//
// The share page itself stays a pure read: it renders metadata only and never
// sees the storage path. Spending one of the link's downloads happens here, on
// an explicit click, so a page render or prefetch cannot burn the quota.
//
// vault_redeem_share_token does the increment and the expiry/quota check in a
// single UPDATE ... RETURNING, so two simultaneous clicks on the last remaining
// download cannot both succeed.

const SIGNED_URL_TTL_SECONDS = 60 * 5;

function deny(code: string, status: number, detail?: unknown, retryAfterSeconds?: number) {
  if (detail) console.error(`[vault/share/download] ${code}`, detail);
  return NextResponse.json(
    { error: code },
    retryAfterSeconds
      ? { status, headers: { "Retry-After": String(retryAfterSeconds) } }
      : { status },
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const rate = consumeIpRateLimit("vault_share_download", getClientIp(req), 25, 60_000);
    if (!rate.allowed) {
      return deny("rate_limit_exceeded", 429, undefined, rate.retryAfterSeconds);
    }

    const vaultOn =
      (await isFeatureEnabled("vault_cloud")) || (await isFeatureEnabled("phase5_vault_cloud"));
    if (!vaultOn) return deny("vault_disabled", 503);

    const { token } = await params;
    const trimmed = token?.trim() ?? "";
    if (!trimmed || !/^[A-Za-z0-9_-]{8,128}$/.test(trimmed)) {
      return deny("link_unavailable", 404);
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("vault_redeem_share_token", {
      p_token: trimmed,
    });
    if (error) return deny("redeem_failed", 400, error.message);

    const redeemed = Array.isArray(data) ? data[0] : data;
    const storagePath = String(redeemed?.storage_path ?? "");
    if (!storagePath || storagePath.includes("..") || storagePath.startsWith("/")) {
      // Unknown token, past its expiry, or out of downloads. Deliberately one
      // response for all three so this cannot be used to probe for live tokens.
      return deny("link_unavailable", 404);
    }

    const cfg = requireAdminServiceConfig();
    const service = createServiceClient(cfg.url, cfg.serviceRoleKey, {
      auth: { persistSession: false },
    });
    const { data: signed, error: signErr } = await service.storage
      .from("vault")
      .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);
    if (signErr || !signed?.signedUrl) return deny("sign_failed", 502, signErr?.message);

    return NextResponse.redirect(signed.signedUrl);
  } catch (err) {
    return deny("internal_error", 500, err);
  }
}
