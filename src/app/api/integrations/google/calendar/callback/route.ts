import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPublicSiteUrl } from "@/lib/site-url";
import { verifySignedOAuthState } from "@/lib/oauth-state";
import { adminServiceHeaders, requireAdminServiceConfig } from "@/lib/admin-service";

function googleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

function appOrigin(req: Request) {
  try {
    return getPublicSiteUrl();
  } catch {
    return new URL(req.url).origin;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const stateRaw = url.searchParams.get("state");

  if (!googleConfigured()) {
    return NextResponse.redirect(
      new URL("/app/meetings?calendar=google&error=not_configured", req.url),
    );
  }
  if (error || !code) {
    return NextResponse.redirect(
      new URL(
        `/app/meetings?calendar=google&error=${encodeURIComponent(error || "missing_code")}`,
        req.url,
      ),
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login?next=/app/meetings", req.url));
  }

  try {
    const stateCheck = verifySignedOAuthState(stateRaw, user.id, "google_calendar");
    if (!stateCheck.valid) {
      throw new Error(`OAuth state validation failed: ${stateCheck.error || "unauthorized"}`);
    }

    const origin = appOrigin(req);
    const redirectUri = `${origin}/api/integrations/google/calendar/callback`;
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) {
      const detail = await tokenRes.text();
      throw new Error(detail.slice(0, 200) || "Token exchange failed");
    }
    const tokens = (await tokenRes.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      scope?: string;
    };

    if (tokens.refresh_token) {
      const cfg = requireAdminServiceConfig();
      const saveRes = await fetch(`${cfg.url}/rest/v1/user_integration_tokens?on_conflict=user_id,provider`, {
        method: "POST",
        headers: adminServiceHeaders(cfg.serviceRoleKey, "resolution=merge-duplicates,return=minimal"),
        body: JSON.stringify({
          user_id: user.id,
          provider: "google_calendar",
          refresh_token: tokens.refresh_token,
          scope: tokens.scope || "",
          updated_at: new Date().toISOString(),
        }),
      });
      if (!saveRes.ok) {
        throw new Error("Could not store Google Calendar token securely");
      }
    }

    await supabase.auth.updateUser({
      data: {
        google_calendar_connected: true,
        google_calendar_scope: tokens.scope || "",
        google_calendar_refresh: null,
        google_calendar_connected_at: new Date().toISOString(),
      },
    });

    return NextResponse.redirect(
      new URL("/app/meetings?calendar=google&connected=1", req.url),
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "oauth_failed";
    return NextResponse.redirect(
      new URL(`/app/meetings?calendar=google&error=${encodeURIComponent(msg.slice(0, 120))}`, req.url),
    );
  }
}
