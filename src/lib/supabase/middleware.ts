import { createServerClient } from "@supabase/ssr/dist/module/createServerClient";
import type { CookieOptions } from "@supabase/ssr/dist/module/types";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Never let bad keys crash the Node worker (Hostinger returns platform 503).
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_ANON_KEY.startsWith("eyJ")) {
    console.error(
      "[clivora] Invalid SUPABASE env. Use legacy JWT anon key (eyJ...), not sb_publishable_.",
    );
    return NextResponse.next({ request });
  }

  try {
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;
    const isApp = path.startsWith("/app") || path.startsWith("/connect/manage");
    const isAdminSubRoute = path.startsWith("/admin/");
    const isAdminArea = path === "/admin" || isAdminSubRoute;
    const isAuthPage =
      path === "/login" ||
      path === "/signup" ||
      path.startsWith("/auth/reset-password");

    if (isApp && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }

    if (isAdminSubRoute && !user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (isAdminArea && user) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role, account_type, is_blocked, is_restricted")
        .eq("id", user.id)
        .maybeSingle();
      // Only bounce on definitive non-admin / blocked - not on transient query errors.
      if (!error) {
        if (
          (profile?.role !== "admin" && profile?.account_type !== "admin") ||
          profile?.is_blocked === true ||
          profile?.is_restricted === true
        ) {
          const url = request.nextUrl.clone();
          url.pathname = "/app";
          url.search = "";
          url.searchParams.set("error", "admin_required");
          return NextResponse.redirect(url);
        }
      }
    }

    if (isApp && user) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_blocked")
        .eq("id", user.id)
        .maybeSingle();
      if (!error && profile?.is_blocked === true) {
        return NextResponse.redirect(new URL("/blocked", request.url));
      }
    }

    if (user && isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/app";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (err) {
    console.error("[clivora] middleware session error:", err);
    return NextResponse.next({ request });
  }
}
