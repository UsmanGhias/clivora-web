"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, LayoutDashboard, ChevronDown } from "lucide-react";

export default function AppErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("[Clivora App Section Caught Exception]:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-slate-900">
              This section encountered a temporary issue
            </h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Your session and account data remain completely safe. You can reload this view or return to your dashboard.
            </p>

            {error?.message && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setShowDetails((prev) => !prev)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition"
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${showDetails ? "rotate-180" : ""}`}
                  />
                  <span>{showDetails ? "Hide technical details" : "Show technical details"}</span>
                </button>
                {showDetails && (
                  <pre className="mt-2 max-h-36 overflow-auto rounded-lg bg-slate-50 p-2.5 text-[11px] font-mono text-slate-700 border border-slate-200">
                    {error.message}
                    {error.digest ? `\nDigest: ${error.digest}` : ""}
                  </pre>
                )}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reload section</span>
              </button>
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Dashboard overview</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
