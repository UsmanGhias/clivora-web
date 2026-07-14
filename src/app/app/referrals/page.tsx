"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SubPageChrome } from "@/components/app/SubPageChrome";

type Stats = {
  code: string;
  referral_count: number;
  bonus_days_earned: number;
};

export default function ReferralsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [applyCode, setApplyCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login?next=/app/referrals");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("account_type, name")
        .eq("id", user.id)
        .maybeSingle();
      setIsClient((profile?.account_type ?? "").toLowerCase() === "client");

      let { data: row } = await supabase
        .from("referral_codes")
        .select("code, referral_count, bonus_days_earned")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!row) {
        const code = `CLV${user.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
        const { data: created, error: upsertErr } = await supabase
          .from("referral_codes")
          .upsert(
            {
              user_id: user.id,
              code,
              referral_count: 0,
              bonus_days_earned: 0,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          )
          .select("code, referral_count, bonus_days_earned")
          .maybeSingle();
        if (upsertErr) {
          setError(upsertErr.message);
        } else {
          row = created;
        }
      }

      if (row) {
        setStats({
          code: row.code,
          referral_count: Number(row.referral_count ?? 0),
          bonus_days_earned: Number(row.bonus_days_earned ?? 0),
        });
      }
      setLoading(false);
    })();
  }, [router, supabase]);

  async function copyCode() {
    if (!stats?.code) return;
    await navigator.clipboard.writeText(stats.code);
    setMessage("Referral code copied");
  }

  async function shareLink() {
    if (!stats?.code) return;
    const url = `https://clivora.codcrafters.org/pro?ref=${encodeURIComponent(stats.code)}`;
    if (navigator.share) {
      await navigator.share({
        title: "Join CLIVORA",
        text: `Use my CLIVORA code ${stats.code} when you upgrade.`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      setMessage("Share link copied");
    }
  }

  async function onApply(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const code = applyCode.trim().toUpperCase();
    if (!code) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: found } = await supabase
      .from("referral_codes")
      .select("user_id, code")
      .eq("code", code)
      .maybeSingle();
    if (!found) {
      setError("Code not found");
      return;
    }
    if (found.user_id === user.id) {
      setError("You cannot apply your own code");
      return;
    }

    const { error: err } = await supabase.from("referral_redemptions").insert({
      referrer_user_id: found.user_id,
      referred_user_id: user.id,
      referral_code: code,
    });
    if (err) {
      setError(err.message.includes("duplicate") ? "You already applied a referral code" : err.message);
      return;
    }
    setMessage(`Applied ${code}. Bonus days unlock when you subscribe.`);
    setApplyCode("");
  }

  return (
    <SubPageChrome
      isClient={isClient}
      backHref="/app/hub"
      backLabel="Hub"
      crumbs={[
        { label: "App", href: "/app" },
        { label: "Hub", href: "/app/hub" },
        { label: "Referrals" },
      ]}
      title="Refer & Earn"
    >
      <div className="mx-auto max-w-lg space-y-5">
        {loading && <p className="text-sm text-text-secondary">Loading…</p>}
        {!loading && stats && (
          <>
            <div className="rounded-2xl bg-navy p-5 text-white">
              <p className="text-sm text-white/70">Invite friends to CLIVORA</p>
              <p className="mt-1 text-lg font-extrabold">
                Earn 7 bonus Pro days when they subscribe
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 rounded-xl bg-white/10 px-4 py-3 font-mono text-lg font-bold tracking-widest">
                  {stats.code}
                </div>
                <button
                  type="button"
                  onClick={copyCode}
                  className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold"
                >
                  Copy
                </button>
              </div>
              <button
                type="button"
                onClick={shareLink}
                className="mt-3 w-full rounded-xl border border-white/20 py-2.5 text-sm font-semibold"
              >
                Share invite link
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-xs font-semibold uppercase text-text-muted">Referrals</p>
                <p className="mt-1 text-2xl font-extrabold text-navy">{stats.referral_count}</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-xs font-semibold uppercase text-text-muted">Bonus days</p>
                <p className="mt-1 text-2xl font-extrabold text-navy">{stats.bonus_days_earned}</p>
              </div>
            </div>

            <form onSubmit={onApply} className="space-y-3 rounded-2xl border border-border bg-surface p-5">
              <h2 className="font-bold text-navy">Have a friend’s code?</h2>
              <input
                value={applyCode}
                onChange={(e) => setApplyCode(e.target.value.toUpperCase())}
                placeholder="CLVXXXXXXXX"
                className="w-full rounded-xl border border-border px-3 py-2 font-mono uppercase"
              />
              <button
                type="submit"
                className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white"
              >
                Apply code
              </button>
            </form>
          </>
        )}
        {message && <p className="text-sm font-semibold text-primary-dark">{message}</p>}
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    </SubPageChrome>
  );
}
