import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPublicSiteUrl } from "@/lib/site-url";

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
    if (stateRaw) {
      const state = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf8")) as {
        uid?: string;
      };
      if (state.uid && state.uid !== user.id) {
        throw new Error("OAuth state mismatch");
      }
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

    await supabase.auth.updateUser({
      data: {
        google_calendar_connected: true,
        google_calendar_scope: tokens.scope || "",
        google_calendar_refresh: tokens.refresh_token || null,
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
