"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PlatformSnapshot } from "@/lib/admin-platform-types";
import { AdminShell, type AdminBadgeCounts } from "@/components/admin/AdminShell";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

type Ctx = {
  data: PlatformSnapshot | null;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  adminName: string;
  adminEmail: string;
};

const AdminDataContext = createContext<Ctx | null>(null);

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PlatformSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminName, setAdminName] = useState("Super Admin");
  const [adminEmail, setAdminEmail] = useState("super@clivora.com");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/platform", { cache: "no-store" });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
          code?: string;
        };
        if (res.status === 403 && body.code === "MFA_REQUIRED") {
          setError("MFA required — complete Google Authenticator verification.");
        } else if (body.code === "AUTH_UNAVAILABLE") {
          // Don't surface broken auth banners — keep admin UI usable.
          setError("");
          setData(null);
        } else {
          setError(body.error || `Platform request failed (${res.status})`);
        }
        if (body.code !== "AUTH_UNAVAILABLE") setData(null);
        return;
      }
      const json = (await res.json()) as PlatformSnapshot;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load platform data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const supabase = createBrowserSupabaseClient();
    void supabase.auth.getUser().then(({ data: session }) => {
      const u = session.user;
      if (!u) return;
      setAdminEmail(u.email ?? "super@clivora.com");
      setAdminName(
        (u.user_metadata?.full_name as string | undefined) ||
          (u.user_metadata?.name as string | undefined) ||
          "Super Admin",
      );
    });
  }, [refresh]);

  const badges: AdminBadgeCounts = useMemo(() => data?.badges ?? {}, [data]);

  const value = useMemo(
    () => ({ data, loading, error, refresh, adminName, adminEmail }),
    [data, loading, error, refresh, adminName, adminEmail],
  );

  return (
    <AdminDataContext.Provider value={value}>
      <AdminShell
        badges={badges}
        adminName={adminName}
        adminEmail={adminEmail}
        onRefresh={() => void refresh()}
        refreshing={loading}
      >
        {children}
      </AdminShell>
    </AdminDataContext.Provider>
  );
}
