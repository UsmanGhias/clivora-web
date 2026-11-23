import Link from "next/link";
import { ShieldCheck, CheckCircle2, ArrowRight, Briefcase } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { site } from "@/lib/site";

type InvoiceShare = {
  invoice_number: string | null;
  total: number | null;
  currency: string | null;
  status: string | null;
  due_date: string | null;
  payment_method: string | null;
};

// Guest lookup goes through invoice_share_by_token, not a table read. A table
// read here would be authorised by RLS before the token filter is applied, so
// the filter would be advisory only and any anon caller could enumerate every
// shared invoice. The function takes the token as an argument and returns at
// most the one matching row, display columns only.
async function loadShare(token: string): Promise<InvoiceShare | null> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.rpc("invoice_share_by_token", {
    p_token: token,
  });

  if (error) return null;
  const row = Array.isArray(data) ? data[0] : data;
  return (row as InvoiceShare) ?? null;
}

export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolved = await params;
  const share = await loadShare(resolved.token);

  if (!share) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900 flex items-center justify-center">
        <div className="mx-auto max-w-lg w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-navy">Invoice not found</h1>
          <p className="mt-3 text-sm text-slate-600">
            This public invoice link is invalid, has expired, or was revoked by the contractor.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 underline"
            >
              Back to Clivora Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const due = share.due_date
    ? new Date(share.due_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-";
  const total = Number(share.total ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const isPaid = (share.status || "").toLowerCase() === "paid";

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12 text-slate-900 antialiased">
      <div className="mx-auto max-w-lg space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="font-display text-lg font-extrabold tracking-tight text-navy">
              CLIVORA
            </span>
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800">
              0% Fee OS
            </span>
          </Link>
          <span className="text-xs text-slate-500">Verified Client Invoice</span>
        </div>

        {/* Invoice Summary Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Invoice Number
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy">
                {share.invoice_number || "INV-001"}
              </h1>
            </div>
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ${
                isPaid
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-900"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isPaid ? "bg-emerald-600" : "bg-amber-600"
                }`}
              />
              <span>{(share.status || "pending").replaceAll("_", " ")}</span>
            </div>
          </div>

          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 pb-3">
              <dt className="text-slate-500">Total Due</dt>
              <dd className="font-display text-2xl font-extrabold text-navy">
                {share.currency || "USD"} {total}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 pb-3">
              <dt className="text-slate-500">Payment Due Date</dt>
              <dd className="font-semibold text-slate-800">{due}</dd>
            </div>
            {share.payment_method ? (
              <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 pb-3">
                <dt className="text-slate-500">Payment Settlement Rail</dt>
                <dd className="font-semibold text-slate-800">{share.payment_method}</dd>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-4 pt-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 text-teal-800 font-semibold">
                <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
                <span>Client Marketplace Surcharge:</span>
              </span>
              <span className="font-bold text-teal-800">$0.00 (0% added markup)</span>
            </div>
          </dl>
        </div>

        {/* Client Conversion Card (Turn Paying Clients into Clivora Users) */}
        <div className="overflow-hidden rounded-3xl border border-teal-200/80 bg-gradient-to-br from-white via-teal-50/20 to-teal-100/30 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-teal-700 shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900">
              Hiring or Managing Independent Talent?
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-slate-600">
            Unlike Upwork or Fiverr, Clivora charges <strong>$0 in client transaction fees</strong> and imposes
            zero non-circumvention lockouts. Manage contractor milestones, timesheets, and direct invoices in one place.
          </p>

          <div className="grid gap-2.5 sm:grid-cols-2 pt-1">
            <Link
              href="/start-a-project"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-navy px-4 py-2.5 text-xs font-bold text-white transition hover:bg-navy/90 text-center"
            >
              <span>Post a Project Free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/signup?role=client"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-navy transition hover:bg-slate-50 text-center"
            >
              <span>Create Client Workspace</span>
            </Link>
          </div>
        </div>

        {/* Security and Trust Footer */}
        <div className="text-center text-xs text-slate-400">
          <p>
            Powered by{" "}
            <Link href="/" className="font-semibold text-slate-600 hover:text-navy underline">
              Clivora
            </Link>{" "}
            · The Open-Source Freelancer &amp; Client Operating System
          </p>
        </div>
      </div>
    </main>
  );
}
