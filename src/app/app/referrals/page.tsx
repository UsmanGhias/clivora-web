"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Gift, Share2, Sparkles, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
    <div className="space-y-6 pb-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Refer & earn</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-navy sm:text-3xl">
          Grow CLIVORA with friends
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary">
          Share your invite code. When they subscribe to Pro or Pro Plus, you earn bonus Pro days.
        </p>
      </div>

      {loading && <p className="text-sm text-text-secondary">Loading…</p>}

      {!loading && stats && (
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-slate-900 to-teal-950 p-6 text-white shadow-lg sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-teal-400/20 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-100">
                <Gift className="h-3.5 w-3.5" />
                Invite program
              </span>
              <p className="mt-4 text-sm text-white/70">Invite friends to CLIVORA</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">
                Earn 7 bonus Pro days when they subscribe
              </h2>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 font-mono text-lg font-bold tracking-widest">
                  {stats.code}
                </div>
                <button
                  type="button"
                  onClick={copyCode}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
              </div>
              <button
                type="button"
                onClick={shareLink}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 py-3 text-sm font-semibold hover:bg-white/5"
              >
                <Share2 className="h-4 w-4" />
                Share invite link
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-text-muted">
                  <Users className="h-3.5 w-3.5" />
                  Referrals
                </p>
                <p className="mt-2 font-display text-3xl font-extrabold text-navy">
                  {stats.referral_count}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-text-muted">
                  <Sparkles className="h-3.5 w-3.5" />
                  Bonus days
                </p>
                <p className="mt-2 font-display text-3xl font-extrabold text-navy">
                  {stats.bonus_days_earned}
                </p>
              </div>
            </div>

            <form
              onSubmit={onApply}
              className="space-y-3 rounded-2xl border border-border bg-surface p-5 shadow-sm"
            >
              <h2 className="font-bold text-navy">Have a friend’s code?</h2>
              <p className="text-xs text-text-secondary">
                Apply once. Bonus days unlock after your paid subscription starts.
              </p>
              <input
                value={applyCode}
                onChange={(e) => setApplyCode(e.target.value.toUpperCase())}
                placeholder="CLVXXXXXXXX"
                className="w-full rounded-xl border border-border px-3 py-2.5 font-mono uppercase"
              />
              <button
                type="submit"
                className="rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white"
              >
                Apply code
              </button>
            </form>
          </div>
        </div>
      )}

      {message && <p className="text-sm font-semibold text-primary-dark">{message}</p>}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
