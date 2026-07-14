import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy Policy - ${site.name}`,
  description: `Privacy Policy for ${site.name} by ${site.company.name}. Learn how we collect, use, and protect your data.`,
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      description={`This Privacy Policy describes how ${site.company.name} ("we", "us", or "our") collects, uses, and protects your information when you use the ${site.name} mobile application.`}
    >
      <p>
        <strong>{site.company.name}</strong> operates the {site.name} mobile
        application (package: <code>{site.appPackage}</code>). This page
        informs you of our policies regarding the collection, use, and disclosure
        of personal data when you use our Service.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>Account Information</h3>
      <p>When you create an account, we collect:</p>
      <ul>
        <li>Full name</li>
        <li>Email address</li>
        <li>Password (stored securely using SHA-256 hashing on your device)</li>
        <li>Profile photo (optional, selected by you from your device)</li>
      </ul>

      <h3>Business Data You Enter</h3>
      <p>
        {site.name} is a business management app. You may enter the following
        data, which is stored locally on your device:
      </p>
      <ul>
        <li>Customer and client information (names, emails, phone numbers, addresses)</li>
        <li>Project details (budgets, deadlines, descriptions)</li>
        <li>Invoices and payment records</li>
        <li>Tasks, expenses, and notes</li>
        <li>Business profile information (business name, logo, branding preferences)</li>
      </ul>

      <h3>Device Permissions</h3>
      <p>The app may request the following permissions:</p>
      <ul>
        <li>
          <strong>Camera</strong> - To capture profile photos and business logos
        </li>
        <li>
          <strong>Photos/Media</strong> - To select images from your gallery for
          profile and invoice branding
        </li>
        <li>
          <strong>Internet</strong> - For app updates, subscription billing, and
          future cloud sync features
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide and maintain the {site.name} service</li>
        <li>Authenticate your account and secure your data</li>
        <li>Display your business dashboard, reports, and notifications</li>
        <li>Process subscription payments through Google Play Billing (Pro plan)</li>
        <li>Send follow-up reminders for overdue invoices and tasks (on-device)</li>
        <li>Improve our app and develop new features</li>
      </ul>

      <h2>3. Data Storage</h2>
      <p>
        <strong>Local-first storage:</strong> Currently, all your business data
        is stored locally on your device using SQLite. We do not transmit your
        business data (customers, invoices, projects, etc.) to external servers
        unless you explicitly enable a future cloud sync feature.
      </p>
      <p>
        Session preferences (such as login state) are stored using on-device
        secure storage (SharedPreferences).
      </p>

      <h2>4. Data Sharing</h2>
      <p>
        We do <strong>not</strong> sell, trade, or rent your personal
        information to third parties. We may share data only in these
        circumstances:
      </p>
      <ul>
        <li>
          <strong>Google Play Billing</strong> - Subscription transactions are
          processed by Google; we receive only purchase confirmation, not payment
          card details
        </li>
        <li>
          <strong>Legal requirements</strong> - If required by law or to
          protect our rights
        </li>
        <li>
          <strong>With your consent</strong> - When you explicitly authorize
          sharing (e.g., future cloud backup)
        </li>
      </ul>

      <h2>5. Data Retention</h2>
      <p>
        Your data remains on your device until you delete it within the app or
        uninstall the application. Uninstalling {site.name} removes all locally
        stored data from your device.
      </p>
      <p>
        To request account deletion, see our{" "}
        <a href="/delete-account">Account Deletion</a> page.
      </p>

      <h2>6. Your Rights</h2>
      <p>Depending on your location, you may have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Correct inaccurate data within the app settings</li>
        <li>Delete your account and all associated data</li>
        <li>Export your business data (available in Pro plan)</li>
        <li>Withdraw consent for optional features</li>
      </ul>

      <h2>7. Children&apos;s Privacy</h2>
      <p>
        {site.name} is not intended for children under 13 years of age. We do
        not knowingly collect personal information from children. If you believe
        a child has provided us with personal data, please contact us
        immediately.
      </p>

      <h2>8. Security</h2>
      <p>
        We implement appropriate technical measures including password hashing,
        local database encryption at the OS level, and secure session management.
        However, no method of electronic storage is 100% secure.
      </p>

      <h2>9. International Users</h2>
      <p>
        {site.name} is operated by {site.company.name}. If you access the app
        from outside your country, your data is processed according to this
        policy and applicable local laws.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you
        of significant changes through the app or via email. Continued use after
        changes constitutes acceptance.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        For privacy-related questions or requests, contact us at:
      </p>
      <ul>
        <li>
          Email:{" "}
          <a href={`mailto:${site.company.privacyEmail}`}>
            {site.company.privacyEmail}
          </a>
        </li>
        <li>
          Website:{" "}
          <a href={site.company.url}>{site.company.url}</a>
        </li>
        <li>
          Company: {site.company.name}
        </li>
      </ul>
    </LegalPageShell>
  );
}
