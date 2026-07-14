import { ClientDashMock } from "./ClientDashMock";
import { FreelancerDashMock } from "./FreelancerDashMock";

/** Side-by-side freelancer + client portals (ALL-IN-ONE section center). */
export function DualPortalMock({ focus = "both" }: { focus?: "freelancer" | "client" | "both" }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <div
        className={
          focus === "client"
            ? "hidden lg:block lg:opacity-55 lg:saturate-[0.85] lg:scale-[0.98] transition duration-300"
            : "transition duration-300"
        }
      >
        <FreelancerDashMock compact />
      </div>
      <div
        className={
          focus === "freelancer"
            ? "hidden lg:block lg:opacity-55 lg:saturate-[0.85] lg:scale-[0.98] transition duration-300"
            : "transition duration-300"
        }
      >
        <ClientDashMock compact />
      </div>
    </div>
  );
}
