import { NextResponse, type NextRequest } from "next/server";

/**
 * Temporary Hostinger recovery: pass-through middleware.
 * Full auth guard restored after site is stably 200 (see staging branch).
 * Broad/auth middleware has previously crash-looped Passenger → platform 503.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/app/:path*",
    "/login",
    "/signup",
    "/auth/reset-password",
    "/connect/manage",
    "/admin",
    "/admin/:path*",
  ],
};
