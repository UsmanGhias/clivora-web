import { Suspense } from "react";
import ProCheckout from "./pro-checkout";

export const metadata = {
  title: "CLIVORA Pro Plus - Subscribe",
  description: "Upgrade to CLIVORA Pro or Pro Plus. Pay from Pakistan or worldwide.",
};

export default function ProPage() {
  return (
    <div className="bg-white text-slate-900 [&_input]:text-slate-900 [&_select]:text-slate-900 [&_textarea]:text-slate-900 [&_option]:text-slate-900">
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
            Loading checkout…
          </div>
        }
      >
        <ProCheckout />
      </Suspense>
    </div>
  );
}
