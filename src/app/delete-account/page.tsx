import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Account & Data Deletion - ${site.name}`,
  description: `How to delete your ${site.name} account and associated data on web and Android.`,
};

export default function DeleteAccountPage() {
  return (
    <LegalPageShell
      title="Account & Data Deletion"
      description={`Learn how to delete your ${site.name} account on the web app and Android. Required for Google Play compliance.`}
    >
      <p>
        At <strong>{site.company.name}</strong>, we respect your right to
        control your data. This page covers deletion for both the{" "}
        <strong>{site.name} web app</strong> and the <strong>Android app</strong>.
      </p>

      <h2>Option 1: Delete in the Android app</h2>
      <ol>
        <li>Open {site.name} on your device</li>
        <li>Go to <strong>More</strong> → <strong>Profile</strong></li>
        <li>Scroll to <strong>Account Settings</strong></li>
        <li>Tap <strong>Delete Account</strong></li>
        <li>Confirm with your account email when prompted</li>
      </ol>
      <p>
        This requests cloud account deletion (your profile is marked for deletion and
        restricted), clears local device data, and signs you out.
      </p>

      <h2>Option 2: Delete via the web app</h2>
      <ol>
        <li>
          Sign in at{" "}
          <a href={`${site.url}/login`}>{site.url.replace(/^https?:\/\//, "")}/login</a>
        </li>
        <li>Open <strong>Settings</strong> (or Profile) in the authenticated app</li>
        <li>Choose <strong>Delete Account</strong> and confirm your email</li>
        <li>
          Or email{" "}
          <a href={`mailto:${site.company.privacyEmail}?subject=Account%20Deletion%20Request`}>
            {site.company.privacyEmail}
          </a>{" "}
          with subject &quot;Account Deletion Request&quot; and the email on the account
        </li>
      </ol>
      <p>
        Cloud deletion uses the same <code>request_account_deletion</code> server flow as
        Android. We process full anonymization within 30 days, subject to legal retention.
      </p>

      <h2>Option 3: Uninstall Android only</h2>
      <p>
        Uninstalling removes local SQLite data on that device. It does{" "}
        <strong>not</strong> delete your cloud account. Use Option 1 or email support to
        delete the cloud account.
      </p>

      <h2>What gets deleted</h2>
      <ul>
        <li>User account identity (name, email linkage after anonymization window)</li>
        <li>Profile photo and business branding</li>
        <li>CRM customers, projects, invoices, tasks, expenses, and notes you own</li>
        <li>Connect profile visibility and pending requests where policy allows</li>
        <li>App preferences and sessions</li>
      </ul>

      <h2>What may be retained</h2>
      <ul>
        <li>
          <strong>Subscription records</strong> — Google Play / billing providers keep
          their own history; cancel subscriptions before deleting
        </li>
        <li>
          <strong>Support correspondence</strong> — may be retained up to 2 years for
          legal compliance
        </li>
        <li>
          <strong>Fraud / abuse audit logs</strong> — limited retention where required by law
        </li>
      </ul>

      <h2>Direct payments note</h2>
      <p>
        {site.name} records invoices and payment status. It does not hold escrow or process
        card payouts for Connect deals. Cancel any external payment arrangements with
        clients separately.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about data deletion? Contact{" "}
        <a href={`mailto:${site.company.privacyEmail}`}>
          {site.company.privacyEmail}
        </a>
        .
      </p>
    </LegalPageShell>
  );
}
