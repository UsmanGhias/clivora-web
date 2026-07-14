import type { Metadata } from "next";
import { AdminMfaGate } from "@/components/admin/AdminMfaGate";
import { requireAdmin, AdminAuthError } from "@/lib/admin-auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CLIVORA Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch (err) {
    // No session → show admin page login form (children)
    if (err instanceof AdminAuthError && err.status === 401) {
      return (
        <div className="min-h-screen bg-white text-slate-900 antialiased [&_input]:text-slate-900 [&_input]:placeholder:text-slate-400">
          {children}
        </div>
      );
    }
    // Signed in but not admin
    if (err instanceof AdminAuthError && err.status === 403) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
          <div className="max-w-md rounded-2xl border border-white/10 bg-slate-900 p-8 text-center">
            <h1 className="text-xl font-bold">Admin access required</h1>
            <p className="mt-3 text-sm text-slate-300">
              Your account is signed in but does not have the admin role. Ask a workspace owner to
              grant admin access, or sign in with an authorized operator account.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/login?next=/admin"
                className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white"
              >
                Sign in with another account
              </Link>
              <Link href="/app" className="text-sm text-slate-400 hover:text-white">
                Back to app →
              </Link>
            </div>
          </div>
        </div>
      );
    }
    // Fallback
    return (
      <div className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased [&_input]:text-slate-900 [&_input]:placeholder:text-slate-400">
      <AdminMfaGate>{children}</AdminMfaGate>
    </div>
  );
}
