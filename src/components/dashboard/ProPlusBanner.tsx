import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProPlusBanner({ isClient, isPlus }: { isClient: boolean; isPlus: boolean }) {
  if (isPlus) {
    return (
      <div
        className={cn(
          "flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between",
          isClient
            ? "border-client-accent/25 bg-gradient-to-r from-client-surface to-white"
            : "border-primary/25 bg-gradient-to-r from-primary/5 to-white",
        )}
      >
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white",
              isClient ? "bg-client-accent" : "bg-primary",
            )}
          >
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display font-bold text-navy">Unlock more with Pro Plus</p>
            <p className="mt-1 text-sm text-text-secondary">
              Get featured, unlimited proposals, advanced analytics and more.
            </p>
          </div>
        </div>
        <Link
          href="/pro?plan=pro_plus"
          className={cn(
            "inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white",
            isClient ? "bg-client-accent hover:bg-client-header" : "bg-primary hover:bg-primary-dark",
          )}
        >
          Manage plan
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between",
        isClient
          ? "border-client-accent/25 bg-gradient-to-r from-client-surface to-white"
          : "border-primary/25 bg-gradient-to-r from-primary/5 to-white",
      )}
    >
      <div>
        <p className="font-display font-bold text-navy">Upgrade to Pro Plus</p>
        <p className="mt-1 text-sm text-text-secondary">
          100 Connect credits/month, featured listings, and $0 platform fees on your deals.
        </p>
      </div>
      <Link
        href="/pro?plan=pro_plus"
        className={cn(
          "inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white",
          isClient ? "bg-client-accent" : "bg-primary",
        )}
      >
        Upgrade now
      </Link>
    </div>
  );
}
