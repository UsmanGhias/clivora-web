import { redirect } from "next/navigation";
import { getProfile, isClientAccount } from "@/lib/profile";
import { ClientCard, ClientPageHeader, ClientPrimaryButton } from "@/components/client/ui";
import { ManageBillingButton } from "@/components/app/ManageBillingButton";
import { CreditCard } from "lucide-react";

export const metadata = { title: "Payment methods" };

export default async function PaymentMethodsPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (!isClientAccount(profile)) redirect("/app/invoices");

  return (
    <div className="space-y-6 pb-10">
      <ClientPageHeader
        title="Payment methods"
        subtitle="Manage cards and billing details used for hiring on CLIVORA."
        icon={CreditCard}
      />
      <ClientCard title="Saved methods">
        <div className="rounded-xl border border-dashed border-border bg-client-surface/40 p-6 text-center">
          <p className="font-semibold text-navy">No cards on file yet</p>
          <p className="mt-1 text-sm text-text-secondary">
            Add a payment method through Stripe billing to pay invoices faster.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <ManageBillingButton />
            <ClientPrimaryButton href="/pro?plan=pro_plus">Upgrade plan</ClientPrimaryButton>
          </div>
        </div>
      </ClientCard>
    </div>
  );
}
