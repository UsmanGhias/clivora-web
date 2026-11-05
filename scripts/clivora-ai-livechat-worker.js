/**
 * Clivora AI Autonomous Live Chat Engine (v2.1)
 * Integrates Google Gemini with Odoo Live Chat & CRM
 * Features:
 * - Brand Voice: Speaks as "Team Clivora" with helpful, professional tone
 * - Per-User Query Limiter: Max 12 queries per visitor session
 * - Multi-Key Rotation: Supports an array of Gemini keys with automatic failover
 * - Automatic CRM lead capture when visitors share contact info
 * - Zero em dashes invariant
 */

const ODOO_URL = process.env.ODOO_MAIN_URL || "https://clivora.odoo.com";
const ODOO_DB = process.env.ODOO_MAIN_DB || "clivora";
const ODOO_KEY = process.env.ODOO_MAIN_API_KEY || "";
const ODOO_UID = parseInt(process.env.ODOO_MAIN_UID || "2", 10);

// Load environment variables from .env.local if present
try {
  const fs = require("fs");
  const path = require("path");
  const envPath = path.resolve(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [k, ...v] = trimmed.split("=");
        const keyName = k.trim();
        if (!process.env[keyName]) {
          process.env[keyName] = v.join("=").replace(/^["']|["']$/g, "").trim();
        }
      }
    }
  }
} catch {
  // Continue
}

const RAW_KEYS = (process.env.GEMINI_API_KEYS || "").split(",").map(k => k.trim()).filter(Boolean);
const DEFAULT_KEYS = [
  process.env.GEMINI_API_KEY || "",
  process.env.GEMINI_FALLBACK_API_KEY || "",
  process.env.GEMINI_TERTIARY_API_KEY || "",
].filter(Boolean);
const GEMINI_KEYS = Array.from(new Set([...RAW_KEYS, ...DEFAULT_KEYS])).filter(Boolean);


const MODELS = [
  process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3-flash-preview"
];

let currentKeyIndex = 0;

function getNextGeminiKey() {
  if (GEMINI_KEYS.length === 0) return null;
  const key = GEMINI_KEYS[currentKeyIndex % GEMINI_KEYS.length];
  currentKeyIndex++;
  return key;
}

// Session query limit per channel
const MAX_QUERIES_PER_USER = 12;
const channelQueryCounts = new Map();

const SYSTEM_PROMPT = `You are Clivora AI, the official intelligent assistant for Clivora (https://clivora.io).
You speak warmly, directly, and professionally as "Team Clivora" or "our team".
Founder & Lead Architect: Usman Ghias (Portfolio: https://usmanghias.co.uk).

Core Knowledge:
- Clivora is the zero-commission freelance operating system and remote job marketplace.
- Platform fee is $0 forever. Freelancers keep 100% of their earnings with zero commission cut.
- Over 7,150+ verified remote jobs are live at https://clivora.io/jobs.
- Features: Milestone escrow contracts, sequential tax invoices, client CRM, timesheets, and Android app (Flutter v5.3.19).
- Contractor Profiles: Freelancers set up profiles, tech stacks, and rates at https://clivora.io/connect/apply.
- Hiring Clients: Employers post roles for free and hire contractors directly at https://clivora.io/for-clients.
- Parent Agency & Custom Development: CODCrafters (https://codcrafters.org), building custom Web (Next.js), Mobile (Flutter), Odoo ERP, and AI bots.
- Community Forum: community.clivora.io.

Rules:
- Speak as "Team Clivora" or "our team". Do not mention individual founder names unless directly asked about leadership.
- NEVER use em dashes (—) or en dashes (–). Use standard hyphens (-), colons (:), commas (,), or parentheses.
- Answer ANY technical, coding, or platform question directly and thoroughly with clean code examples where appropriate.
- Do NOT demand an email address on routine questions. Answer their questions first.
- If the visitor wants custom software, direct consultation, or to hire engineers, provide helpful details and invite them to share their email so Team Clivora can follow up directly.`;

async function rpc(model, method, args, kwargs = {}) {
  const res = await fetch(ODOO_URL + "/jsonrpc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: { service: "object", method: "execute_kw", args: [ODOO_DB, ODOO_UID, ODOO_KEY, model, method, args, kwargs] },
      id: Date.now()
    })
  });
  const json = await res.json();
  if (json.error) {
    const msg = json.error.data?.message || json.error.message || "Odoo error";
    throw new Error(model + "." + method + ": " + msg);
  }
  return json.result;
}

function sanitizeDashes(text) {
  if (!text) return "";
  return text.replace(/[\u2014\u2013]/g, "-");
}

async function callGemini(question) {
  for (let attempt = 0; attempt < GEMINI_KEYS.length; attempt++) {
    const key = getNextGeminiKey();
    for (const model of MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: "Instructions: " + SYSTEM_PROMPT }] },
              { role: "model", parts: [{ text: "Understood. I will respond as Team Clivora with high accuracy and zero em dashes." }] },
              { role: "user", parts: [{ text: question }] }
            ],
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.5
            }
          })
        });

        if (!res.ok) {
          continue;
        }

        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return sanitizeDashes(text.trim());
      } catch (err) {
        // try next model / key
      }
    }
  }

  return "Clivora offers $0 platform fees and 7,150+ live verified remote jobs at clivora.io/jobs. How can Team Clivora assist with your projects or engineering needs?";
}

function stripHtml(html) {
  return (html || "").replace(/<[^>]*>?/gm, "").trim();
}

async function processActiveLivechats() {
  const channels = await rpc("discuss.channel", "search_read", [
    [["channel_type", "=", "livechat"]],
    ["id", "name", "write_date"]
  ], { limit: 10, order: "id desc" });

  for (const ch of channels) {
    const msgs = await rpc("mail.message", "search_read", [
      [["model", "=", "discuss.channel"], ["res_id", "=", ch.id]],
      ["id", "author_id", "body", "create_date"]
    ], { limit: 2, order: "id desc" });

    if (!msgs || msgs.length === 0) continue;

    const lastMsg = msgs[0];
    const cleanBody = stripHtml(lastMsg.body);

    const isFromVisitor = !lastMsg.author_id || (Array.isArray(lastMsg.author_id) && lastMsg.author_id[0] !== ODOO_UID);

    if (isFromVisitor && cleanBody && !cleanBody.startsWith("🤖")) {
      const currentCount = channelQueryCounts.get(ch.id) || 0;

      if (currentCount >= MAX_QUERIES_PER_USER) {
        console.log(`[Channel ${ch.id}] Session limit reached (${currentCount}/${MAX_QUERIES_PER_USER}).`);
        await rpc("discuss.channel", "message_post", [[ch.id]], {
          body: `<p>🤖 <strong>Clivora AI</strong>: For direct assistance or custom enterprise engineering, feel free to email contact@clivora.io or share your email here so Team Clivora can follow up.</p>`,
          message_type: "comment",
          subtype_xmlid: "mail.mt_comment"
        });
        continue;
      }

      channelQueryCounts.set(ch.id, currentCount + 1);
      console.log(`[Channel ${ch.id}] Visitor query #${currentCount + 1}: "${cleanBody}"`);

      const aiReply = await callGemini(cleanBody);
      console.log(`[Channel ${ch.id}] Clivora AI Replied: "${aiReply}"`);

      await rpc("discuss.channel", "message_post", [[ch.id]], {
        body: `<p>🤖 <strong>Clivora AI</strong>: ${aiReply}</p>`,
        message_type: "comment",
        subtype_xmlid: "mail.mt_comment"
      });

      // Auto lead capture ONLY if user provided an email
      const emailMatch = cleanBody.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        try {
          await rpc("crm.lead", "create", [{
            name: `Livechat Lead: ${cleanBody.slice(0, 50)}`,
            email_from: emailMatch[0],
            partner_name: emailMatch[0].split("@")[0],
            contact_name: emailMatch[0].split("@")[0],
            description: `<p>Captured from livechat channel ${ch.id} (${ch.name}).</p><p><strong>Inquiry:</strong> ${cleanBody}</p><p><strong>Clivora AI response:</strong> ${aiReply}</p>`,
            stage_id: 1 // New
          }]);
          console.log(`[CRM] Auto-created lead for ${emailMatch[0]}`);
        } catch (err) {
          console.warn("[CRM] Lead error:", err.message);
        }
      }
    }
  }
}

async function run() {
  console.log("=== CLIVORA AI LIVECHAT WORKER INITIALIZED ===");
  console.log("Connected to Odoo:", ODOO_URL);
  console.log("Active Gemini Key Pool Size:", GEMINI_KEYS.length);
  console.log("Models:", MODELS.join(", "));
  console.log("Max Questions Per Visitor Session:", MAX_QUERIES_PER_USER);
  await processActiveLivechats();
  console.log("=== CYCLE COMPLETE ===");
}

if (require.main === module) {
  run().catch(console.error);
}

module.exports = { processActiveLivechats, callGemini };
