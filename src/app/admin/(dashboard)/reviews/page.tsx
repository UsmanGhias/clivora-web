"use client";

import { useMemo, useState } from "react";
import { Star, Trash2, CheckCircle2, ShieldAlert, MessageSquare, Edit3 } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminDataProvider";
import {
  AdminPageHeader,
  KpiGrid,
  FilterBar,
  AdminTable,
  StatusPill,
  relative,
  ErrorBanner,
} from "@/components/admin/ui";

export default function AdminReviewsPage() {
  const { data, loading, refresh } = useAdminData();
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editModal, setEditModal] = useState<Record<string, unknown> | null>(null);

  const reviews = useMemo(() => data?.reviews ?? [], [data?.reviews]);

  const kpis = useMemo(() => {
    const total = reviews.length;
    const verified = reviews.filter((r) => r.verified === true).length;
    const fiveStar = reviews.filter((r) => Number(r.rating) >= 5).length;
    const lowRating = reviews.filter((r) => Number(r.rating) <= 2).length;
    return { total, verified, fiveStar, lowRating };
  }, [reviews]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reviews.filter((r) => {
      const rating = Number(r.rating || 0);
      const isVerified = r.verified === true;
      if (activeTab === "verified" && !isVerified) return false;
      if (activeTab === "5star" && rating < 5) return false;
      if (activeTab === "low" && rating > 2) return false;
      if (!q) return true;
      const hay = `${String(r.title || "")} ${String(r.comment || "")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [reviews, activeTab, query]);

  async function deleteReview(reviewId: string) {
    if (!confirm("Permanently delete this review? This action cannot be undone.")) return;
    setBusyId(reviewId);
    try {
      const res = await fetch("/api/admin/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_review", reviewId }),
      });
      if (!res.ok) throw new Error("Failed to delete review");
      await refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Deletion failed");
    } finally {
      setBusyId(null);
    }
  }

  async function saveReviewEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editModal) return;
    setBusyId(String(editModal.id));
    try {
      const res = await fetch("/api/admin/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_review",
          reviewId: editModal.id,
          rating: Number(editModal.rating),
          title: String(editModal.title || ""),
          comment: String(editModal.comment || ""),
          verified: Boolean(editModal.verified),
        }),
      });
      if (!res.ok) throw new Error("Failed to update review");
      setEditModal(null);
      await refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {data?.warning && <ErrorBanner message={data.warning} />}

      <AdminPageHeader
        title="Reviews & Ratings"
        subtitle="Moderate client feedback, adjust verified statuses, or remove malicious reviews."
      />

      <KpiGrid
        items={[
          {
            label: "Total Reviews",
            value: kpis.total,
            icon: <MessageSquare className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          {
            label: "Verified Feedback",
            value: kpis.verified,
            icon: <CheckCircle2 className="h-4 w-4" />,
            iconBg: "bg-blue-50 text-blue-600",
          },
          {
            label: "5★ Ratings",
            value: kpis.fiveStar,
            icon: <Star className="h-4 w-4" />,
            iconBg: "bg-amber-50 text-amber-600",
          },
          {
            label: "Flagged / Low Ratings",
            value: kpis.lowRating,
            icon: <ShieldAlert className="h-4 w-4" />,
            iconBg: "bg-rose-50 text-rose-600",
          },
        ]}
      />

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <FilterBar
          searchPlaceholder="Search by review text or title…"
          searchValue={query}
          onSearchChange={setQuery}
          tabs={[
            { id: "all", label: "All Reviews", count: reviews.length },
            { id: "verified", label: "Verified Only", count: kpis.verified },
            { id: "5star", label: "5-Star", count: kpis.fiveStar },
            { id: "low", label: "Low Ratings (<=2★)", count: kpis.lowRating },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onReset={() => {
            setActiveTab("all");
            setQuery("");
          }}
        />

        {!data && loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Loading reviews…
          </div>
        ) : (
          <AdminTable
            headers={["Rating", "Review Details", "Verified", "Created", "Actions"]}
            footer={
              <span>
                Showing {filtered.length} of {reviews.length} reviews
              </span>
            }
          >
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-sm text-slate-500">
                  No reviews found matching the filters.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={String(r.id)} className="hover:bg-slate-50/80">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{Number(r.rating || 5).toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="max-w-md">
                      <p className="font-semibold text-slate-900">{String(r.title || "Untitled Review")}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">
                        {String(r.comment || "No comment provided.")}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <StatusPill status={r.verified ? "active" : "pending"} />
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-500">
                    {relative(String(r.created_at || ""))}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditModal({ ...r })}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={busyId === String(r.id)}
                        onClick={() => void deleteReview(String(r.id))}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </AdminTable>
        )}
      </div>

      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Edit Review</h3>
              <button
                type="button"
                onClick={() => setEditModal(null)}
                className="text-sm font-semibold text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={saveReviewEdit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700">Rating (1 to 5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  value={Number(editModal.rating || 5)}
                  onChange={(e) => setEditModal({ ...editModal, rating: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Review Title</label>
                <input
                  type="text"
                  value={String(editModal.title || "")}
                  onChange={(e) => setEditModal({ ...editModal, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Comment</label>
                <textarea
                  rows={4}
                  value={String(editModal.comment || "")}
                  onChange={(e) => setEditModal({ ...editModal, comment: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="verified-toggle"
                  checked={Boolean(editModal.verified)}
                  onChange={(e) => setEditModal({ ...editModal, verified: e.target.checked })}
                  className="rounded border-slate-300 text-teal-600"
                />
                <label htmlFor="verified-toggle" className="text-xs font-bold text-slate-700">
                  Mark as Verified Review
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModal(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyId === String(editModal.id)}
                  className="rounded-xl bg-navy px-5 py-2 text-sm font-bold text-white hover:bg-navy/90 disabled:opacity-50"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
