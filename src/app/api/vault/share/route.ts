import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function randomToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const body = (await req.json()) as {
      file_path?: string;
      file_id?: string;
      expires_in_hours?: number;
    };

    const { file_path, file_id, expires_in_hours = 72 } = body;
    if (!file_path && !file_id) {
      return NextResponse.json({ error: "file_path or file_id required" }, { status: 400 });
    }

    const token = randomToken();
    const expiresAt = new Date(Date.now() + expires_in_hours * 3600 * 1000).toISOString();

    const { data, error } = await supabase
      .from("vault_share_links")
      .insert({
        owner_uid: user.id,
        file_path: file_path ?? null,
        file_id: file_id ?? null,
        token,
        expires_at: expiresAt,
      })
      .select("id, token, expires_at")
      .single();

    if (error) throw error;

    const origin = req.headers.get("origin") ?? "https://clivora.codcrafters.org";
    const shareUrl = `${origin}/vault/s/${token}`;

    return NextResponse.json({ id: data.id, token: data.token, expires_at: data.expires_at, url: shareUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Share failed" },
      { status: 500 },
    );
  }
}
