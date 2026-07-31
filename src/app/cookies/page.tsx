import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Cookie Policy - ${site.name}`,
  description: `Cookie and tracking policy for ${site.company.url}.`,
};

export default function CookiesPage() {
  return (
    <LegalPageShell
      title="Cookie Policy"
      description={`How ${site.company.name} uses cookies and similar technologies on ${site.company.url}.`}
    >
      <p>
        This Cookie Policy explains how <strong>{site.company.name}</strong>{" "}
        uses cookies and similar tracking technologies on our website at{" "}
        <a href={site.company.url}>{site.company.url}</a> and within the{" "}
        {site.name} mobile application.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a
        website. They help websites remember your preferences and improve your
        experience.
      </p>

      <h2>2. Cookies We Use</h2>
      <h3>Website (clivora.io)</h3>
      <table>
        <thead>
          <tr>
            <th>Cookie Type</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Essential</td>
            <td>Required for basic site functionality and security</td>
            <td>Session</td>
          </tr>
          <tr>
            <td>Analytics (optional)</td>
            <td>Understand how visitors use our website to improve content</td>
            <td>Up to 1 year</td>
          </tr>
          <tr>
            <td>Preference</td>
            <td>Remember your language and display settings</td>
            <td>Up to 1 year</td>
          </tr>
        </tbody>
      </table>

      <h3>Mobile App</h3>
      <p>
        The {site.name} mobile app does not use browser cookies. It uses
        on-device storage (SharedPreferences and SQLite) to save your session,
        preferences, and business data locally.
      </p>

      <h2>3. Third-Party Cookies</h2>
      <p>We may use third-party services that set their own cookies:</p>
      <ul>
        <li>
          <strong>Vercel Analytics</strong> - Website performance and visitor
          analytics (if enabled)
        </li>
        <li>
          <strong>Google Play</strong> - Subscription and payment processing
          within the mobile app
        </li>
      </ul>
      <p>
        These third parties have their own privacy policies governing cookie
        use.
      </p>

      <h2>4. Managing Cookies</h2>
      <p>You can control cookies through your browser settings:</p>
      <ul>
        <li>Block all cookies (may affect site functionality)</li>
        <li>Delete existing cookies from your browser</li>
        <li>Set your browser to notify you before accepting cookies</li>
      </ul>
      <p>
        For mobile app data, you can clear app data through your device
        Settings → Apps → {site.name} → Clear Data.
      </p>

      <h2>5. Do Not Track</h2>
      <p>
        Our website does not currently respond to &quot;Do Not Track&quot; browser
        signals. You can manage tracking through cookie settings as described
        above.
      </p>

      <h2>6. Updates</h2>
      <p>
        We may update this Cookie Policy periodically. Check this page for the
        latest version.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about cookies? Email{" "}
        <a href={`mailto:${site.company.privacyEmail}`}>
          {site.company.privacyEmail}
        </a>
        .
      </p>
    </LegalPageShell>
  );
}
