import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  listMyConnectRequests,
  listPublicConnectNeeds,
  listPublicConnectProfiles,
} from "@/lib/connect";
import {
  getProfile,
  isBlocked,
  isClientAccount,
  isProPlus,
  isRestricted,
} from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingJsonLd } from "@/components/marketing/MarketingJsonLd";
import { ConnectMarketingHero } from "@/components/connect/ConnectMarketingHero";
import { ConnectBoard } from "@/components/connect/ConnectBoard";
import { Lock, ShieldCheck, Building2 } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "CLIVORA Connect - Private marketplace",
  description:
    "Hire freelancers and find clients on CLIVORA Connect. Private contact until mutual accept, then continue in the same CRM. Browse free.",
  alternates: { canonical: `${site.url}/connect` },
  keywords: [
    "Clivora Connect",
    "freelancer platform",
    "hire freelancers",
    "freelance marketplace",
  ],
};

export default async function ConnectPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const profile = await getProfile();
  if (profile && isBlocked(profile)) redirect("/blocked");
  const sp = searchParams ? await searchParams : undefined;
  const tabParam = String(sp?.tab ?? "").toLowerCase();
  const defaultTab =
    tabParam === "jobs" || tabParam === "talent" || tabParam === "inbox"
      ? (tabParam as "jobs" | "talent" | "inbox")
      : "talent";
  let profiles: Awaited<ReturnType<typeof listPublicConnectProfiles>> = [];
  let needs: Awaited<ReturnType<typeof listPublicConnectNeeds>> = [];
  let requests: Awaited<ReturnType<typeof listMyConnectRequests>> = [];
  let loadError: string | null = null;
  try {
    [profiles, needs, requests] = await Promise.all([
      listPublicConnectProfiles(),
      listPublicConnectNeeds(),
      listMyConnectRequests(),
    ]);
  } catch {
    loadError = "Could not load Connect right now. Refresh to try again.";
  }
  const signedIn = !!profile;
  const plus = isProPlus(profile);
  const client = isClientAccount(profile);
  const restricted = isRestricted(profile);
  let savedBookmarkIds: string[] = [];
  if (profile) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("freelancer_bookmarks")
        .select("target_id")
        .eq("user_id", profile.id)
        .in("target_type", ["freelancer", "job"])
        .limit(500);
      savedBookmarkIds = (data ?? []).map((row) => String(row.target_id));
    } catch {
      savedBookmarkIds = [];
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-navy antialiased">
      <MarketingJsonLd />
      <MarketingNav />
      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 lg:px-8 lg:py-12">
        <ConnectMarketingHero signedIn={signedIn} isClient={client} />

        {restricted && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Your account is restricted - browsing works, posting/contact is paused. Contact support
            if this is unexpected.
          </p>
        )}

        <div id="board" className="scroll-mt-24">
          <Suspense fallback={<div className="rounded-2xl border border-border bg-surface p-8 text-sm text-text-secondary">Loading Connect…</div>}>
            <ConnectBoard
              profiles={profiles}
              needs={needs}
              requests={requests}
              signedIn={signedIn}
              isProPlus={plus}
              isClient={client}
              isRestricted={restricted}
              myUserId={profile?.id}
              accent={client ? "slate" : "teal"}
              defaultTab={defaultTab}
              loadError={loadError}
              savedBookmarkIds={savedBookmarkIds}
            />
          </Suspense>
        </div>

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-3">
          <div>
            <Lock className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm font-bold text-navy">How Connect works</p>
            <p className="mt-1 text-sm text-slate-500">
              Both sides must accept a request before contact details unlock.
            </p>
          </div>
          <div>
            <ShieldCheck className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm font-bold text-navy">Why professionals love it</p>
            <p className="mt-1 text-sm text-slate-500">
              Zero fees on negotiated rates, privacy by default, and full control.
            </p>
          </div>
          <div>
            <Building2 className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm font-bold text-navy">Need a team workspace?</p>
            <p className="mt-1 text-sm text-slate-500">
              Start free on CLIVORA, then grow into Pro tools when you need them.{" "}
              <Link href="/contact" className="font-semibold text-primary hover:underline">
                Contact sales
              </Link>
            </p>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
