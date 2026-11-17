"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ArrowRight, ShieldCheck, UserPlus, Sparkles } from "lucide-react";
import { site } from "@/lib/site";

interface BringYourClientBannerProps {
  userId: string;
  userName?: string | null;
}

export function BringYourClientBanner({ userId }: BringYourClientBannerProps) {
  const [copied, setCopied] = useState(false);

  // Direct referral invite link for clients
  const inviteUrl = `${site.url}/signup?role=client&ref=${userId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-teal-500/30 bg-gradient-to-br from-navy via-[#0c1d2e] to-[#063337] p-5 text-white shadow-md sm:p-6">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-teal-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-emerald-500/15 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Column: Headline and Value Proposition */}
        <div className="max-w-2xl space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-400/30">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              0% Deal Fee · Keep 100%
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-200/80">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-300" />
              Upwork Alternative
            </span>
          </div>

          <h3 className="font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            Bring your external clients to Clivora
          </h3>

          <p className="text-sm leading-relaxed text-slate-300">
            Never surrender 10% to 20% to legacy marketplaces. Move your existing or off-platform clients to Clivora with protected milestone escrow, custom-branded client portals, and $0 platform take rate.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs font-medium text-teal-100/90">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>$0 fee on milestone contracts</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Dedicated client login portal</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Direct invoice settlement</span>
            </div>
          </div>
        </div>

        {/* Right Column: Fast Action & Copy Link */}
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-teal-500/20 px-4 py-2 text-xs font-bold text-teal-200 ring-1 ring-teal-400/40 hover:bg-teal-500/30 transition cursor-pointer"
              title="Copy your client invite link"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-300" />
                  <span className="text-emerald-300">Invite Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-teal-300" />
                  <span>Copy Invite Link</span>
                </>
              )}
            </button>

            <Link
              href="/app/clients"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-navy shadow-sm hover:bg-slate-100 transition"
            >
              <UserPlus className="h-4 w-4 text-navy" />
              <span>Add Client in CRM</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <Link
              href="/compare/upwork"
              className="inline-flex items-center gap-1 text-teal-300 hover:text-white transition underline underline-offset-2"
            >
              <span>See Upwork fee comparison</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
