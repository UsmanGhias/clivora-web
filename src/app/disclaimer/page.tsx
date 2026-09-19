import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Disclaimer - ${site.name}`,
  description:
    "Official legal, earnings, and platform intermediary disclaimer for the Clivora Freelancer OS website and applications.",
  alternates: { canonical: `${site.url}/disclaimer` },
};

export default function DisclaimerPage() {
  return (
    <LegalPageShell
      title="Platform Disclaimer"
      description={`Legal notices, earnings clarifications, and software intermediary terms for ${site.name}.`}
      lastUpdated="September 13, 2026"
    >
      <p>
        Please read this disclaimer carefully before using the <strong>{site.name}</strong>{" "}
        platform, website at <Link href="/">{site.url.replace("https://", "")}</Link>, or our
        mobile applications. By accessing or using our services, you agree to the notices and
        terms outlined below.
      </p>

      <h2>1. General Information Only</h2>
      <p>
        The content, tools, documentation, and materials provided on {site.name} are for general
        business administration, project coordination, and educational purposes. While we strive
        for accuracy and continuous platform reliability, information is provided on an &quot;as is&quot;
        and &quot;as available&quot; basis without warranties of any kind.
      </p>

      <h2>2. Freelance Earnings &amp; Business Results Disclaimer</h2>
      <p>
        {site.name} provides a Business Operating System (OS) comprising private Connect hiring,
        CRM, project boards, timesheets, and invoicing tools. We do not guarantee, represent, or
        warrant that using {site.name} will result in specific client acquisitions, billable hours,
        earnings, profit levels, or business success.
      </p>
      <p>
        Any case studies, earnings calculators, or testimonials referenced on our website or marketing
        materials reflect individual experiences and do not constitute a guarantee of future
        performance. Your results depend on your professional skills, market demand, work quality,
        and direct client relationships.
      </p>

      <h2>3. Non-Custodial &amp; $0 Fee Intermediary Notice</h2>
      <p>
        {site.name} maintains a <strong>$0 platform fee policy</strong> on negotiated deals between
        freelancers and clients. Payment transactions against invoices are settled directly between
        clients and freelancers via their chosen third-party payment providers (such as Stripe,
        Google Play, or direct bank transfer).
      </p>
      <p>
        {site.name} is not a bank, escrow agent, money transmitter, or licensed fiduciary. We do not
        hold client funds in custody or arbitrate contractual disputes outside of documented platform
        reporting mechanisms.
      </p>

      <h2>4. No Professional, Legal, or Financial Advice</h2>
      <p>
        Invoice templates, proposal drafting tools, timesheet calculators, and AI-assisted workflows
        available within {site.name} are administrative aids. They do not constitute formal legal,
        accounting, tax, or professional advisory services.
      </p>
      <p>
        Users are responsible for ensuring that their contracts, invoices, tax withholdings, and client
        agreements comply with applicable local, state, and international laws. For specific legal or
        tax matters, consult a qualified attorney or certified accountant.
      </p>

      <h2>5. External Links &amp; Third-Party Services</h2>
      <p>
        Our website and apps may contain links to external websites, client portfolios, community
        forums, and third-party tools that are not operated or controlled by {site.company.name}.
        We are not responsible for the content, privacy policies, or practices of third-party
        websites or services.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by applicable law, {site.company.name}, its founder Usman Ghias,
        directors, and affiliates shall not be liable for any indirect, incidental, special, or
        consequential damages resulting from the use or inability to use the platform, including lost
        profits, data loss, or business interruption.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        If you have questions regarding this disclaimer or our platform policies, contact us at:
      </p>
      <ul>
        <li>
          <strong>Company:</strong> {site.company.name}
        </li>
        <li>
          <strong>Founder &amp; Lead Systems Architect:</strong> Usman Ghias
        </li>
        <li>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${site.company.email}`}>{site.company.email}</a>
        </li>
        <li>
          <strong>Support:</strong> <Link href="/support">Support Desk</Link>
        </li>
        <li>
          <strong>Contact Form:</strong> <Link href="/contact">Contact Page</Link>
        </li>
      </ul>
    </LegalPageShell>
  );
}
