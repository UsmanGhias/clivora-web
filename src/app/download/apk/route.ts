import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const APK_DOWNLOAD_URL =
  "https://github.com/UsmanGhias/clivora/releases/download/v5.6.2-open-source/clivora-5.6.2.apk";

export async function GET() {
  return NextResponse.redirect(APK_DOWNLOAD_URL, {
    status: 302,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
