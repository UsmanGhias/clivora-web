import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Data Safety - ${site.name}`,
  description: `Data safety and security practices for ${site.name} by ${site.company.name}. For Google Play Data Safety form reference.`,
  alternates: { canonical: `${site.url}/data-safety` },
};

export default function DataSafetyPage() {
  return (
    <LegalPageShell
      title="Data Safety"
      description={`Data collection and security summary for ${site.name}. Use this page as a reference when completing the Google Play Data Safety form.`}
    >
      <p>
        This page summarizes how <strong>{site.name}</strong> by{" "}
        <strong>{site.company.name}</strong> handles user data. It is intended
        to help users and app store reviewers understand our data practices.
      </p>

      <h2>Data Collection Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Data Type</th>
            <th>Collected</th>
            <th>Purpose</th>
            <th>Shared</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>Yes</td>
            <td>Account creation, business profile</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Email address</td>
            <td>Yes</td>
            <td>Account authentication, support</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Password</td>
            <td>Yes (hashed)</td>
            <td>Account security</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Photos</td>
            <td>Yes (optional)</td>
            <td>Profile photo, business logo</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Business contact data</td>
            <td>Yes (user-entered)</td>
            <td>CRM functionality</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Financial info</td>
            <td>Yes (user-entered)</td>
            <td>Invoicing, expenses, reports</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Purchase history</td>
            <td>Yes</td>
            <td>Pro subscription via Google Play</td>
            <td>Google Play only</td>
          </tr>
          <tr>
            <td>Device identifiers</td>
            <td>No</td>
            <td> - </td>
            <td> - </td>
          </tr>
          <tr>
            <td>Location</td>
            <td>No</td>
            <td> - </td>
            <td> - </td>
          </tr>
        </tbody>
      </table>

      <h2>Data Storage</h2>
      <ul>
        <li>
          <strong>Local storage:</strong> All business data is stored on your
          device using SQLite
        </li>
        <li>
          <strong>Encryption:</strong> Data is protected by your device&apos;s
          operating system encryption
        </li>
        <li>
          <strong>Cloud:</strong> No cloud backup in current version; data does
          not leave your device unless you enable future sync features
        </li>
      </ul>

      <h2>Data Security Practices</h2>
      <ul>
        <li>Passwords are hashed using SHA-256 before storage</li>
        <li>No plaintext password storage</li>
        <li>Session tokens stored in device secure preferences</li>
        <li>No third-party analytics SDKs in the mobile app</li>
        <li>HTTPS for all network communications</li>
      </ul>

      <h2>Permissions Used</h2>
      <table>
        <thead>
          <tr>
            <th>Permission</th>
            <th>Why We Need It</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Internet</td>
            <td>App updates, subscription billing, future sync</td>
          </tr>
          <tr>
            <td>Camera</td>
            <td>Take profile photos and business logos</td>
          </tr>
          <tr>
            <td>Read Media Images</td>
            <td>Select images from gallery for profile/branding</td>
          </tr>
        </tbody>
      </table>

      <h2>Data Deletion</h2>
      <p>
        Users can delete all data by deleting their account in-app or
        uninstalling the application. See our{" "}
        <a href="/delete-account">Account Deletion</a> page for details.
      </p>

      <h2>Children</h2>
      <p>
        {site.name} is not directed at children under 13. We do not knowingly
        collect data from children.
      </p>

      <h2>Related Policies</h2>
      <ul>
        <li>
          <a href="/privacy">Privacy Policy</a>
        </li>
        <li>
          <a href="/terms">Terms of Service</a>
        </li>
        <li>
          <a href="/delete-account">Account Deletion</a>
        </li>
      </ul>

      <h2>Contact</h2>
      <p>
        Data safety inquiries:{" "}
        <a href={`mailto:${site.company.privacyEmail}`}>
          {site.company.privacyEmail}
        </a>
      </p>
    </LegalPageShell>
  );
}
