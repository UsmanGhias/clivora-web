/**
 * High-Converting, Spam-Proof B2B Email Templates for Clivora & CODCrafters
 * Written with high-reputation headers, clean styling, and zero spam triggers.
 */

function baseLayout(contentHtml, recipientEmail) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Clivora & CODCrafters</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" max-width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <tr>
          <td style="background-color: #090e17; padding: 24px 32px; border-bottom: 2px solid #0d9488;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td>
                  <span style="color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.02em;">CLIVORA</span>
                  <span style="color: #2dd4bf; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-left: 8px; background: rgba(45,212,191,0.15); padding: 2px 6px; border-radius: 4px;">BUSINESS OS</span>
                </td>
                <td align="right">
                  <span style="color: #94a3b8; font-size: 12px; font-weight: 500;">by CODCrafters</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Main Body -->
        <tr>
          <td style="padding: 36px 32px;">
            ${contentHtml}
          </td>
        </tr>

        <!-- Founder Signature -->
        <tr>
          <td style="padding: 0 32px 32px 32px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top: 1px solid #f1f5f9; padding-top: 20px;">
              <tr>
                <td>
                  <div style="font-weight: 700; color: #0f172a; font-size: 15px;">Usman Ghias</div>
                  <div style="color: #64748b; font-size: 13px; margin-top: 2px;">Founder & Principal Engineer, Clivora & CODCrafters</div>
                  <div style="color: #0d9488; font-size: 13px; margin-top: 4px;">
                    <a href="https://clivora.io" style="color: #0d9488; text-decoration: none; font-weight: 600;">clivora.io</a> &nbsp;|&nbsp; 
                    <a href="https://community.clivora.io" style="color: #0d9488; text-decoration: none; font-weight: 600;">community.clivora.io</a> &nbsp;|&nbsp; 
                    <a href="mailto:contact@clivora.io" style="color: #0d9488; text-decoration: none; font-weight: 600;">contact@clivora.io</a>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer / Unsubscribe -->
        <tr>
          <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; line-height: 1.5;">
            You received this tailored message because of your industry work in software engineering, tech leadership, or independent consulting.<br>
            If you prefer not to receive future updates, you can <a href="mailto:contact@clivora.io?subject=Unsubscribe%20${encodeURIComponent(recipientEmail)}" style="color: #64748b; text-decoration: underline;">unsubscribe instantly</a>.<br>
            &copy; 2026 CODCrafters · Clivora Business OS. All rights reserved.
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Segment A: Hiring Clients, Agency Founders & CTOs
// ─────────────────────────────────────────────────────────────────────────────
function renderClientPitch(lead) {
  const { name = 'there', company = 'your team', role = 'Executive' } = lead;
  
  const subject = `Scaling ${company} tech delivery (0% platform fees + enterprise engineering)`;
  
  const text = `Hi ${name},

I came across your work at ${company} and wanted to reach out directly.

I'm Usman Ghias, Founder at CODCrafters and creator of Clivora (https://clivora.io) - an operating system built to streamline how modern companies hire, manage, and invoice independent software talent.

If your team is currently scaling its technical capacity or managing custom implementations, we support businesses in two distinct ways:

1. Clivora Client Workspace: Post requirements, review pre-vetted engineers, and collaborate with zero platform fees on negotiated contracts (unlike traditional marketplaces that charge 10% to 20% markups).
2. CODCrafters Enterprise Services: Dedicated custom software engineering, Odoo 17/18 ERP implementations, AI/LLM automation pipelines, and Flutter mobile applications.

I have attached our complete Clivora Product & Engineering Case Study deck for your reference, detailing our architecture and delivery scope.

Would you be open to a brief 10-minute introductory call this week to explore whether our technical team can help accelerate your roadmap?

Best regards,
Usman Ghias
Founder & Principal Engineer
Clivora & CODCrafters
https://clivora.io | contact@clivora.io`;

  const htmlContent = `
<p style="font-size: 16px; color: #334155; margin-top: 0;">Hi ${name},</p>

<p style="font-size: 15px; color: #334155; line-height: 1.7;">
I came across your leadership at <strong>${company}</strong> and wanted to reach out directly.
</p>

<p style="font-size: 15px; color: #334155; line-height: 1.7;">
I am Usman Ghias, Founder of <strong>CODCrafters</strong> and architect of <a href="https://clivora.io" target="_blank" style="color: #0d9488; font-weight: 700; text-decoration: none;">Clivora</a>: a connected Freelancer & Client Operating System designed to eliminate fragmented tools and 20% marketplace commissions.
</p>

<div style="background-color: #f1f5f9; border-left: 4px solid #0d9488; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0;">
  <div style="font-weight: 700; color: #0f172a; font-size: 14px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">How We Support Growing Teams:</div>
  <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
    <li><strong>Clivora Client Workspace:</strong> Hire and manage skilled developers directly with $0 platform fees on contracts.</li>
    <li><strong>CODCrafters Engineering:</strong> Custom Next.js web applications, Odoo 17/18 ERP systems, and AI agent workflows.</li>
    <li><strong>Verified Full-Stack Delivery:</strong> Cross-platform mobile (Flutter) and scalable cloud backends (Supabase / PostgreSQL).</li>
  </ul>
</div>

<p style="font-size: 15px; color: #334155; line-height: 1.7;">
I have attached our <strong>Product &amp; Engineering Case Study Deck</strong> to this email, outlining our technical architecture, role-based workflows, and delivery highlights.
</p>

<div style="margin: 28px 0 20px 0;">
  <a href="https://community.clivora.io/start-a-project" target="_blank" style="background-color: #0d9488; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-block;">
    Explore CODCrafters Services &rarr;
  </a>
  <a href="https://clivora.io/for-clients" target="_blank" style="background-color: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; padding: 12px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-block; margin-left: 10px;">
    Open Client Workspace
  </a>
</div>

<p style="font-size: 15px; color: #334155; line-height: 1.7;">
Would you be open to a brief 10-minute sync this week to discuss your current technical initiatives?
</p>`;

  return {
    subject,
    text,
    html: baseLayout(htmlContent, lead.email),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Segment B: Tech Sponsors, Accelerators & Strategic Partners
// ─────────────────────────────────────────────────────────────────────────────
function renderSponsorPitch(lead) {
  const { name = 'there', company = 'your organization' } = lead;
  
  const subject = `Partnership & Sponsorship with Clivora Community Ecosystem`;
  
  const text = `Hi ${name},

I hope this email finds you well.

I'm Usman Ghias, Founder of Clivora (https://clivora.io) and CODCrafters. We have built an integrated Freelancer OS and community knowledge hub (https://community.clivora.io) serving independent software engineers, designers, and tech builders globally.

We are currently opening strategic sponsorship and ecosystem partnerships for:
1. Clivora Community & Virtual Summit 2026: Direct exposure to thousands of active tech builders and remote professionals.
2. Technology & API Integrations: Showcasing developer tools, APIs, and SaaS products directly in the Clivora OS directory.
3. Agency Referral Program: 15% recurring referral commissions for enterprise custom software and Odoo ERP implementations.

I have attached our complete Product Deck and Architectural Case Study for your review.

Would you be open to discussing how ${company} can partner with our growing ecosystem?

Best regards,
Usman Ghias
Founder, Clivora & CODCrafters
https://community.clivora.io/partners | contact@clivora.io`;

  const htmlContent = `
<p style="font-size: 16px; color: #334155; margin-top: 0;">Hi ${name},</p>

<p style="font-size: 15px; color: #334155; line-height: 1.7;">
I hope this email finds you well. I am reaching out to explore a potential strategic partnership between <strong>${company}</strong> and the <strong>Clivora Community Ecosystem</strong>.
</p>

<p style="font-size: 15px; color: #334155; line-height: 1.7;">
<a href="https://clivora.io" target="_blank" style="color: #0d9488; font-weight: 700; text-decoration: none;">Clivora</a> is a connected operating platform and knowledge network for independent developers, founders, and consultants worldwide.
</p>

<div style="background-color: #f1f5f9; border-left: 4px solid #0d9488; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0;">
  <div style="font-weight: 700; color: #0f172a; font-size: 14px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Active Partnership Tracks:</div>
  <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
    <li><strong>Ecosystem & Event Sponsorship:</strong> Keynote, workshop, and brand placement in Virtual Summit 2026.</li>
    <li><strong>Technology & API Showcase:</strong> Feature your developer APIs, cloud infrastructure, or tools to active builders.</li>
    <li><strong>Agency Referral Network:</strong> Co-branded solutions and 15% recurring commissions for custom enterprise builds.</li>
  </ul>
</div>

<p style="font-size: 15px; color: #334155; line-height: 1.7;">
Attached is our <strong>Clivora Product Overview &amp; Engineering Case Study</strong> highlighting our product scope, multi-platform architecture (Next.js + Flutter), and community roadmap.
</p>

<div style="margin: 28px 0 20px 0;">
  <a href="https://community.clivora.io/partners" target="_blank" style="background-color: #0d9488; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-block;">
    View Partner Tiers &rarr;
  </a>
  <a href="https://community.clivora.io" target="_blank" style="background-color: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; padding: 12px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-block; margin-left: 10px;">
    Visit Community Hub
  </a>
</div>

<p style="font-size: 15px; color: #334155; line-height: 1.7;">
Let me know if you have 10 minutes next week to explore alignment.
</p>`;

  return {
    subject,
    text,
    html: baseLayout(htmlContent, lead.email),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Segment C: Elite Freelancers, Senior Engineers & Consultants
// ─────────────────────────────────────────────────────────────────────────────
function renderFreelancerPitch(lead) {
  const { name = 'there', skill = 'Software Engineering' } = lead;
  
  const subject = `Zero marketplace fees on your freelance contracts (Clivora OS)`;
  
  const text = `Hi ${name},

If you're currently working with independent clients or looking for remote contracts, you know that traditional marketplaces take 10% to 20% of every deal you close.

I built Clivora (https://clivora.io) to change that.

Clivora is a complete Freelancer OS that lets you:
- Browse 700+ verified remote jobs with direct hiring (https://clivora.io/jobs)
- Keep $0 platform fees on all your contracts - clients pay you directly against your invoice
- Manage CRM, Kanban projects, time tracking, and professional PDF invoicing in one account
- Work seamlessly across web and our native Android application with offline-first synchronization

I have attached our Complete Business OS Visual Deck to give you a quick walkthrough of the interface.

You can set up your free workspace in under 60 seconds at https://clivora.io/signup.

Best regards,
Usman Ghias
Founder, Clivora & CODCrafters
https://clivora.io | hello@clivora.io`;

  const htmlContent = `
<p style="font-size: 16px; color: #334155; margin-top: 0;">Hi ${name},</p>

<p style="font-size: 15px; color: #334155; line-height: 1.7;">
If you are managing independent client contracts in <strong>${skill}</strong>, you know how frustrating it is when traditional marketplaces take 10% to 20% of your hard-earned revenue.
</p>

<p style="font-size: 15px; color: #334155; line-height: 1.7;">
I created <a href="https://clivora.io" target="_blank" style="color: #0d9488; font-weight: 700; text-decoration: none;">Clivora</a> to give independent professionals their own private operating system:
</p>

<div style="background-color: #f1f5f9; border-left: 4px solid #0d9488; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0;">
  <div style="font-weight: 700; color: #0f172a; font-size: 14px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Why Freelancers Are Switching:</div>
  <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
    <li><strong>$0 Platform Fees:</strong> Negotiate directly, deliver work, and get paid 100% of your invoice value.</li>
    <li><strong>700+ Remote Jobs:</strong> Real-time opportunities indexed across software, AI, design, and DevOps.</li>
    <li><strong>All-in-One Desk:</strong> Integrated CRM, milestone projects, timer, proposals, and branded PDF invoices.</li>
    <li><strong>Cross-Platform:</strong> Web dashboard + native Android app with offline-first synchronization.</li>
  </ul>
</div>

<p style="font-size: 15px; color: #334155; line-height: 1.7;">
Attached is our <strong>Clivora Business OS Visual Deck</strong> showcasing the unified workspace experience across web and mobile.
</p>

<div style="margin: 28px 0 20px 0;">
  <a href="https://clivora.io/signup" target="_blank" style="background-color: #0d9488; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-block;">
    Open Free Workspace &rarr;
  </a>
  <a href="https://clivora.io/jobs" target="_blank" style="background-color: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; padding: 12px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-block; margin-left: 10px;">
    Browse 700+ Remote Jobs
  </a>
</div>

<p style="font-size: 15px; color: #334155; line-height: 1.7;">
Feel free to reach out directly if you have any feedback or feature requests!
</p>`;

  return {
    subject,
    text,
    html: baseLayout(htmlContent, lead.email),
  };
}

module.exports = {
  renderClientPitch,
  renderSponsorPitch,
  renderFreelancerPitch,
};
