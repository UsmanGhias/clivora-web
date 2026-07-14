import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Account & Data Deletion - ${site.name}`,
  description: `How to delete your ${site.name} account and all associated data.`,
};

export default function DeleteAccountPage() {
  return (
    <LegalPageShell
      title="Account & Data Deletion"
      description={`Learn how to delete your ${site.name} account and remove all your data. Required for Google Play compliance.`}
    >
      <p>
        At <strong>{site.company.name}</strong>, we respect your right to
        control your data. This page explains how to delete your {site.name}{" "}
        account and all associated information.
      </p>

      <h2>Option 1: Delete Within the App</h2>
      <p>You can delete your account directly from the {site.name} app:</p>
      <ol>
        <li>Open {site.name} on your device</li>
        <li>Go to <strong>More</strong> → <strong>Profile</strong></li>
        <li>Scroll to <strong>Account Settings</strong></li>
        <li>Tap <strong>Delete Account</strong></li>
        <li>Confirm your decision when prompted</li>
      </ol>
      <p>
        This permanently removes your account, profile, and all business data
        (customers, projects, invoices, tasks, expenses, and notes) from your
        device.
      </p>

      <h2>Option 2: Uninstall the App</h2>
      <p>
        Since {site.name} stores all data locally on your device, uninstalling
        the app removes all stored data:
      </p>
      <ol>
        <li>Go to your device <strong>Settings</strong></li>
        <li>Navigate to <strong>Apps</strong> → <strong>{site.name}</strong></li>
        <li>Tap <strong>Uninstall</strong></li>
      </ol>
      <p>
        This deletes the app and all locally stored SQLite database files and
        preferences.
      </p>

      <h2>Option 3: Request Deletion by Email</h2>
      <p>
        If you cannot access the app, email us to request account and data
        deletion:
      </p>
      <ul>
        <li>
          Send an email to{" "}
          <a href={`mailto:${site.company.privacyEmail}?subject=Account%20Deletion%20Request`}>
            {site.company.privacyEmail}
          </a>
        </li>
        <li>Subject line: &quot;Account Deletion Request&quot;</li>
        <li>Include the email address associated with your account</li>
        <li>We will process your request within 30 days</li>
      </ul>

      <h2>What Gets Deleted</h2>
      <p>When you delete your account, the following data is permanently removed:</p>
      <ul>
        <li>User account (name, email, password hash)</li>
        <li>Profile photo and business logo</li>
        <li>All customers and client records</li>
        <li>All projects and associated data</li>
        <li>All invoices and payment records</li>
        <li>All tasks, expenses, and notes</li>
        <li>Business profile and invoice branding settings</li>
        <li>App preferences and session data</li>
      </ul>

      <h2>What May Be Retained</h2>
      <ul>
        <li>
          <strong>Subscription records</strong> - Google Play maintains billing
          history; cancel your subscription in Google Play before deleting
        </li>
        <li>
          <strong>Support correspondence</strong> - Emails to our support team
          may be retained for up to 2 years for legal compliance
        </li>
      </ul>

      <h2>Pro Subscription Cancellation</h2>
      <p>
        Before deleting your account, cancel any active Pro subscription to
        avoid future charges:
      </p>
      <ol>
        <li>Open Google Play Store</li>
        <li>Go to <strong>Subscriptions</strong></li>
        <li>Find <strong>{site.name} Pro</strong></li>
        <li>Tap <strong>Cancel subscription</strong></li>
      </ol>

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
