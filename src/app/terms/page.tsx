import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Terms of Service - ${site.name}`,
  description: `Terms of Service for using the ${site.name} app by ${site.company.name}.`,
};

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms of Service"
      description={`Please read these Terms of Service carefully before using ${site.name}.`}
    >
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your use of the {site.name}{" "}
        mobile application operated by <strong>{site.company.name}</strong>{" "}
        (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), accessible at{" "}
        <a href={site.company.url}>{site.company.url}</a>.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By downloading, installing, or using {site.name}, you agree to be bound
        by these Terms. If you do not agree, do not use the application.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        {site.name} is a Business Operating System that provides CRM, project
        management, invoicing, expense tracking, task management, and financial
        reporting tools for freelancers and agencies. Features may vary between
        Free and Pro subscription plans.
      </p>

      <h2>3. Account Registration</h2>
      <p>
        You must provide accurate information when creating an account. You are
        responsible for maintaining the confidentiality of your credentials and
        for all activities under your account.
      </p>

      <h2>4. Subscription and Payments</h2>
      <h3>Free Plan</h3>
      <p>
        The Free plan includes limited clients, projects, and monthly invoices as
        described in the app. No payment is required.
      </p>
      <h3>Pro Plan</h3>
      <p>
        Pro subscriptions are billed through Google Play Billing at the price
        displayed in the app (currently {site.pricing.proMonthlyLabel}/month). Subscriptions
        auto-renew unless cancelled at least 24 hours before the renewal date.
        Manage or cancel subscriptions through your Google Play account settings.
      </p>
      <p>
        Refunds are handled according to Google Play&apos;s refund policies. We
        do not process refunds directly.
      </p>

      <h2>5. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the app for any unlawful purpose</li>
        <li>Attempt to reverse engineer, decompile, or hack the application</li>
        <li>Upload malicious code or interfere with app functionality</li>
        <li>Share your account credentials with unauthorized parties</li>
        <li>Use the app to store or process illegal content</li>
      </ul>

      <h2>6. Your Content</h2>
      <p>
        You retain ownership of all business data you enter into {site.name}.
        By using the app, you grant us a limited license to process your data
        solely to provide the service. We do not claim ownership of your
        customer lists, invoices, or business records.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        {site.name}, including its design, logo, code, and documentation, is
        owned by {site.company.name} and protected by copyright and trademark
        laws. You may not copy, modify, or distribute any part of the app without
        written permission.
      </p>

      <h2>8. Disclaimer of Warranties</h2>
      <p>
        {site.name} is provided &quot;as is&quot; without warranties of any kind. We do
        not guarantee uninterrupted service, error-free operation, or that the app
        will meet all your business needs. Financial calculations and reports are
        for informational purposes - consult a qualified professional for tax
        or legal advice.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, {site.company.name} shall not be
        liable for any indirect, incidental, special, or consequential damages
        arising from your use of {site.name}, including loss of data, revenue,
        or business opportunities.
      </p>

      <h2>10. Termination</h2>
      <p>
        We may suspend or terminate your access if you violate these Terms. You
        may stop using the app at any time by uninstalling it. See our{" "}
        <a href="/delete-account">Account Deletion</a> page for data removal
        instructions.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These Terms are governed by the laws of Pakistan, without regard to
        conflict of law principles. Disputes shall be resolved in the courts of
        competent jurisdiction.
      </p>

      <h2>12. Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms. Material changes will be
        communicated via the app or email. Continued use after changes
        constitutes acceptance.
      </p>

      <h2>13. Contact</h2>
      <p>
        For questions about these Terms, contact us at{" "}
        <a href={`mailto:${site.company.legalEmail}`}>
          {site.company.legalEmail}
        </a>{" "}
        or visit <a href="/contact">our contact page</a>.
      </p>
    </LegalPageShell>
  );
}
