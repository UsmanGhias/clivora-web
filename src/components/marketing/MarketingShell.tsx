import { MarketingFooter } from "./MarketingFooter";
import { MarketingNav } from "./MarketingNav";

/** Light marketing chrome — wraps public pages without changing app/admin dark shells. */
export function MarketingShell({
  children,
  navVariant = "light",
}: {
  children: React.ReactNode;
  navVariant?: "light" | "overlay";
}) {
  return (
    <div className="marketing-site min-h-screen bg-[#F8FAFC] text-navy antialiased">
      <MarketingNav variant={navVariant} />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
