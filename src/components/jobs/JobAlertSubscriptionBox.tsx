"use client";

import React, { useState } from "react";
import { Bell, Check, Loader2, Mail, ShieldCheck } from "lucide-react";

export function JobAlertSubscriptionBox() {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/jobs/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, category }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Subscription failed");
      }

      setSubscribed(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (subscribed) {
    return (
      <div className="rounded-3xl border border-teal-200 bg-teal-50/70 p-6 sm:p-8 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-lg font-bold text-navy">
          You are subscribed to Daily Job Alerts
        </h3>
        <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-600">
          We will notify <strong className="text-teal-900">{email}</strong> whenever verified remote contracts and engineering roles
          are posted. Zero proposal tokens or bidding fees required.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/60 to-teal-50/30 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-800">
            <Bell className="h-3.5 w-3.5 text-teal-600" />
            <span>Never Miss a High-Paying Role</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-navy">
            Subscribe to Daily Remote Job Alerts ($0 Fee)
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            Get newly indexed tech, engineering, and design roles sent straight to your inbox every morning.
            Apply directly without paying for connects or bidding tokens.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full lg:max-w-md space-y-3">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-2 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <select
                aria-label="Select Job Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-navy focus:border-teal-600 focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="software-development">Software Eng</option>
                <option value="design">Design &amp; UI/UX</option>
                <option value="devops-sysadmin">DevOps &amp; Cloud</option>
                <option value="product">Product &amp; Scrum</option>
                <option value="marketing">Marketing &amp; Growth</option>
              </select>
            </div>

            <div className="relative sm:col-span-7">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs font-medium text-navy placeholder-slate-400 focus:border-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              <span>Zero spam · One-click unsubscribe</span>
            </span>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-navy px-5 py-2.5 text-xs font-bold text-white transition hover:bg-navy/90 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{loading ? "Subscribing..." : "Subscribe Free"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
