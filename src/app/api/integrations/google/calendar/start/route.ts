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
  if (!googleConfigured()) {
    return NextResponse.redirect(
      new URL("/app/meetings?calendar=google&error=not_configured", req.url),
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login?next=/app/meetings?calendar=google", req.url));
  }

  const origin = appOrigin(req);
  const redirectUri = `${origin}/api/integrations/google/calendar/callback`;
  const state = Buffer.from(
    JSON.stringify({ uid: user.id, ts: Date.now() }),
    "utf8",
  ).toString("base64url");

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: [
      "openid",
      "email",
      "https://www.googleapis.com/auth/calendar.events",
    ].join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
