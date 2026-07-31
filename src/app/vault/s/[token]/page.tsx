import { createClient } from "@/lib/supabase/server";
import { isFeatureEnabled } from "@/lib/feature-flags";
import Link from "next/link";

export default async function VaultSharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const vaultOn =
    (await isFeatureEnabled("vault_cloud")) || (await isFeatureEnabled("phase5_vault_cloud"));

  if (!vaultOn) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-extrabold">Vault share unavailable</h1>
        <p className="mt-2 text-sm text-slate-600">Cloud vault sharing is not enabled.</p>
      </main>
    );
  }

  const supabase = await createClient();
  const { data: rows, error } = await supabase.rpc("vault_lookup_share_by_token", {
    p_token: token,
  });
  const link = Array.isArray(rows) ? rows[0] : rows;

  if (error || !link) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-extrabold">Link not found</h1>
        <p className="mt-2 text-sm text-slate-600">This vault share token is invalid or expired.</p>
        <Link href="/" className="mt-6 inline-block text-sm font-bold text-primary underline">
          Back to CLIVORA
        </Link>
      </main>
    );
  }

  const expired = link.expires_at && new Date(link.expires_at).getTime() < Date.now();
  const maxed =
    typeof link.max_downloads === "number" &&
    typeof link.download_count === "number" &&
    link.max_downloads > 0 &&
    link.download_count >= link.max_downloads;

  if (expired || maxed) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-extrabold">Link expired</h1>
        <p className="mt-2 text-sm text-slate-600">
          Ask the owner to create a new share link.
        </p>
      </main>
    );
  }

  let signedUrl: string | null = null;
  if (link.storage_path) {
    const { data: signed } = await supabase.storage
      .from("vault")
      .createSignedUrl(link.storage_path, 60 * 15);
    signedUrl = signed?.signedUrl ?? null;
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-xl font-extrabold">Shared vault file</h1>
      <p className="mt-2 text-sm text-slate-600">{link.file_name || "File"}</p>
      {link.expires_at ? (
        <p className="mt-1 text-xs text-slate-500">
          Expires {new Date(link.expires_at).toLocaleString()}
        </p>
      ) : null}
      {signedUrl ? (
        <a
          href={signedUrl}
          className="mt-6 inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white"
        >
          Download
        </a>
      ) : (
        <p className="mt-6 text-sm text-amber-800">
          File metadata is available, but a download URL could not be created. Confirm the vault
          storage bucket and path.
        </p>
      )}
    </main>
  );
}
