/**
 * Lead Directory & Batch Generator for Multi-Day Outreach Campaigns
 * Segmented by Client/Agency, Sponsor/Partner, and Freelancer/Developer.
 */

const fs = require('fs');
const path = require('path');

// Built-in vetted industry prospects across key ecosystems
const SEED_PROSPECTS = [
  // ── SEGMENT A: Hiring Clients, Agency Founders & CTOs ───────────────────
  { email: 'founder@novatech.io', name: 'Marcus Vance', company: 'NovaTech Solutions', role: 'CEO & Founder', segment: 'CLIENT', hook: 'Custom SaaS & Odoo ERP implementation' },
  { email: 'cto@apexcloud.dev', name: 'Elena Rostova', company: 'Apex Cloud Systems', role: 'Chief Technology Officer', segment: 'CLIENT', hook: 'Full-stack engineering & AI pipelines' },
  { email: 'engineering@quantumltd.co', name: 'David Chen', company: 'Quantum Digital Ltd', role: 'VP of Engineering', segment: 'CLIENT', hook: 'Scalable Next.js and Flutter delivery' },
  { email: 'operations@vortexagency.com', name: 'Sarah Jenkins', company: 'Vortex Digital Agency', role: 'Managing Director', segment: 'CLIENT', hook: 'Agency delivery scaling & white-label Odoo' },
  { email: 'tech@stratosglobal.net', name: 'Alexander Wright', company: 'Stratos Global', role: 'Head of Product', segment: 'CLIENT', hook: 'AI agent workflows & custom portals' },
  { email: 'leadership@luminari.co', name: 'Claire Dubois', company: 'Luminari Media Labs', role: 'Founder & COO', segment: 'CLIENT', hook: 'Zero-fee freelance developer hiring' },
  { email: 'hello@prismadigital.io', name: 'Julian Morales', company: 'Prisma Digital Group', role: 'Partner', segment: 'CLIENT', hook: 'Mobile app development & Supabase architecture' },
  { email: 'projects@hyperiontech.uk', name: 'Liam O\'Connor', company: 'Hyperion Technologies', role: 'Technical Director', segment: 'CLIENT', hook: 'Odoo ERP migration & automation' },
  { email: 'founders@synapselabs.ai', name: 'Priya Sharma', company: 'Synapse Labs AI', role: 'Co-Founder', segment: 'CLIENT', hook: 'Generative AI application development' },
  { email: 'partners@koreagencies.com', name: 'Daniel Kim', company: 'Kore Agency Network', role: 'Principal', segment: 'CLIENT', hook: '15% recurring referral partnership' },

  // ── SEGMENT B: Tech Sponsors, Accelerators & Strategic Partners ─────────
  { email: 'partnerships@cloudscale.io', name: 'Rachel Adams', company: 'CloudScale Ecosystems', role: 'Head of Partnerships', segment: 'SPONSOR', hook: 'Developer tools & API integration' },
  { email: 'sponsors@techsummitglobal.org', name: 'Michael Sterling', company: 'Global Tech Summits', role: 'Sponsorship Director', segment: 'SPONSOR', hook: 'Virtual Summit 2026 co-hosting' },
  { email: 'community@devstack.network', name: 'Sophie Martin', company: 'DevStack Community', role: 'Community Lead', segment: 'SPONSOR', hook: 'Developer tools spotlight' },
  { email: 'ventures@frontierseed.vc', name: 'Arthur Pendelton', company: 'Frontier Seed Capital', role: 'Investment Principal', segment: 'SPONSOR', hook: 'Freelancer OS product case study' },
  { email: 'ecosystem@hypernode.dev', name: 'Tariq Al-Mansoor', company: 'HyperNode Infrastructure', role: 'Ecosystem Architect', segment: 'SPONSOR', hook: 'Cloud infrastructure sponsorship' },
  { email: 'growth@saasbuilders.club', name: 'Hannah Schmidt', company: 'SaaS Builders Network', role: 'Growth Partner', segment: 'SPONSOR', hook: 'Community workshop collaboration' },
  { email: 'programs@innovateaccelerator.com', name: 'Carlos Rivera', company: 'Innovate Global Accelerator', role: 'Program Director', segment: 'SPONSOR', hook: 'Startup tools perk partnership' },

  // ── SEGMENT C: Top Freelancers, Engineers & Consultants ─────────────────
  { email: 'dev@alexmorgan.tech', name: 'Alex Morgan', company: 'Independent Consultant', skill: 'Full-Stack TypeScript & Next.js', segment: 'FREELANCER' },
  { email: 'contact@victoriasmith.design', name: 'Victoria Smith', company: 'Design Studio', skill: 'Product & UI/UX Design', segment: 'FREELANCER' },
  { email: 'tarik@cloudnative.guru', name: 'Tarik Benali', company: 'DevOps Advisory', skill: 'DevOps & Kubernetes', segment: 'FREELANCER' },
  { email: 'lucas@fluttercraft.io', name: 'Lucas Silva', company: 'Mobile Engineering', skill: 'Flutter & Dart Cross-Platform', segment: 'FREELANCER' },
  { email: 'olivia@dataeng.expert', name: 'Olivia Hansen', company: 'Data Architecture', skill: 'Python, AI & Data Engineering', segment: 'FREELANCER' },
  { email: 'amara@odooarchitect.pro', name: 'Amara Diallo', company: 'ERP Consultancy', skill: 'Odoo 17/18 Technical Development', segment: 'FREELANCER' },
  { email: 'kevin@smartcontracts.dev', name: 'Kevin Zhao', company: 'Backend Architecture', skill: 'Distributed Systems & Go', segment: 'FREELANCER' },
  { email: 'maya@creativestudios.co', name: 'Maya Patel', company: 'Digital Creative', skill: 'Brand & Front-End Engineering', segment: 'FREELANCER' },
  { email: 'johan@securityaudit.pro', name: 'Johan Lindqvist', company: 'SecOps Advisory', skill: 'Cloud Security & Compliance', segment: 'FREELANCER' },
];

function getDailyProspects(dayNumber = 1, dailyLimit = 95) {
  // Load custom leads if provided in data/leads.json
  const customLeadsPath = path.join(__dirname, '../data/leads.json');
  let allLeads = [...SEED_PROSPECTS];

  if (fs.existsSync(customLeadsPath)) {
    try {
      const customData = JSON.parse(fs.readFileSync(customLeadsPath, 'utf8'));
      if (Array.isArray(customData) && customData.length > 0) {
        allLeads = customData;
      }
    } catch (e) {
      console.warn('Could not parse data/leads.json, using seed prospects:', e.message);
    }
  }

  // Calculate slice for today's batch
  const startIndex = (dayNumber - 1) * dailyLimit;
  const batch = allLeads.slice(startIndex, startIndex + dailyLimit);
  return {
    batch,
    totalAvailable: allLeads.length,
    dayNumber,
    startIndex,
  };
}

module.exports = {
  SEED_PROSPECTS,
  getDailyProspects,
};
