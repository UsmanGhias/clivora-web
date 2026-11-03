/**
 * Clivora AI Autonomous Live Chat Engine (v2.0)
 * Integrates Google Gemini with Odoo Live Chat & CRM
 * Features:
 * - Brand Voice: Speaks as "Team Clivora" with helpful, professional tone
 * - Per-User Query Limiter: Max 8 queries per visitor session to protect free tier
 * - Multi-Key Rotation: Supports an array of Gemini keys with automatic failover
 * - Automatic CRM lead capture when visitors share contact info
 * - Strict token budget (max 150 tokens) to stay within Google free limits
 * - Zero em dashes invariant
 */

const ODOO_URL = process.env.ODOO_MAIN_URL || "https://clivora.odoo.com";
const ODOO_DB = process.env.ODOO_MAIN_DB || "clivora";
const ODOO_KEY = process.env.ODOO_MAIN_API_KEY || "";
const ODOO_UID = parseInt(process.env.ODOO_MAIN_UID || "2", 10);

// Pool of Gemini API keys. User can pass comma-separated keys in GEMINI_API_KEYS
const RAW_KEYS = (process.env.GEMINI_API_KEYS || "").split(",").map(k => k.trim()).filter(Boolean);
const DEFAULT_KEYS = [
  process.env.GEMINI_API_KEY || "",
  process.env.GEMINI_FALLBACK_API_KEY || "",
  process.env.GEMINI_TERTIARY_API_KEY || "",
].filter(Boolean);
const GEMINI_KEYS = Array.from(new Set([...RAW_KEYS, ...DEFAULT_KEYS])).filter(Boolean);

let currentKeyIndex = 0;

function getNextGeminiKey() {
  if (GEMINI_KEYS.length === 0) return null;
  const key = GEMINI_KEYS[currentKeyIndex % GEMINI_KEYS.length];
  currentKeyIndex++;
  return key;
}

// Session query limit per channel to prevent API abuse and stay 100% free
const MAX_QUERIES_PER_USER = 8;
const channelQueryCounts = new Map();

const SYSTEM_PROMPT = `You are Clivora AI, the official intelligent assistant for Clivora (clivora.io).
Always speak warmly and professionally as "Team Clivora" or "our team".

Core Knowledge:
- Clivora is the zero-fee freelance operating system and remote job marketplace.
- Platform fee is $0 forever. Freelancers keep 100% of their earnings.
- Over 1,270+ verified remote jobs are live at clivora.io/jobs.
- Features: Escrow milestone contracts, free invoicing, client CRM, timesheets, and Android app (Flutter v5.3.19).
- Parent Agency & Custom Development: CODCrafters (codcrafters.org), building custom Web (Next.js), Mobile (Flutter), Odoo ERP, and AI bots.
- Community Forum: community.clivora.io.

Rules:
- Speak as "Team Clivora" or "our team". Do not mention individual founder names unless directly asked about leadership.
- NEVER use em dashes (—) or en dashes (–). Use standard hyphens (-), colons (:), commas (,), or parentheses.
- Keep responses concise, friendly, and under 3 sentences.
- If the visitor wants custom software or a direct consultation, invite them to share their email so Team Clivora can follow up.`;

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
  // Try all available keys in the pool if needed
  for (let attempt = 0; attempt < GEMINI_KEYS.length; attempt++) {
    const key = getNextGeminiKey();
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: "Instructions: " + SYSTEM_PROMPT }] },
            { role: "model", parts: [{ text: "Understood. I will respond as Team Clivora with zero em dashes within token limits." }] },
            { role: "user", parts: [{ text: question }] }
          ],
          generationConfig: {
            maxOutputTokens: 150,
            temperature: 0.6
          }
        })
      });

      if (!res.ok) {
        console.warn(`Gemini key returned HTTP ${res.status}, rotating key...`);
        continue;
      }

      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return sanitizeDashes(text.trim());
    } catch (err) {
      console.warn("Gemini call error, rotating key:", err.message);
    }
  }

  return "Clivora offers $0 platform fees and 1,270+ live verified remote jobs at clivora.io/jobs. Please leave your email and Team Clivora will follow up with you promptly.";
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

      // Rate limit check: max 8 questions per conversation
      if (currentCount >= MAX_QUERIES_PER_USER) {
        console.log(`[Channel ${ch.id}] Session limit reached (${currentCount}/${MAX_QUERIES_PER_USER}). Sending rate-limit notice.`);
        await rpc("discuss.channel", "message_post", [[ch.id]], {
          body: `<p>🤖 <strong>Clivora AI</strong>: You have reached the maximum free question limit for this live session. To discuss your project further or get direct assistance, please share your email address or write to us at contact@clivora.io, and Team Clivora will be delighted to connect with you!</p>`,
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

      // Auto lead capture
      const emailMatch = cleanBody.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        try {
          await rpc("crm.lead", "create", [{
            name: `Livechat Lead: ${ch.name}`,
            email_from: emailMatch[0],
            description: `Captured from livechat in channel ${ch.id}.\nInquiry: ${cleanBody}\nClivora AI response: ${aiReply}`
          }]);
          console.log(`[CRM] Auto-created lead for ${emailMatch[0]}`);
        } catch {
          // Ignore duplicates
        }
      }
    }
  }
}

async function run() {
  console.log("=== CLIVORA AI LIVECHAT WORKER INITIALIZED ===");
  console.log("Connected to Odoo:", ODOO_URL);
  console.log("Active Gemini Key Pool Size:", GEMINI_KEYS.length);
  console.log("Max Questions Per Visitor Session:", MAX_QUERIES_PER_USER);
  await processActiveLivechats();
  console.log("=== CYCLE COMPLETE ===");
}

if (require.main === module) {
  run().catch(console.error);
}

module.exports = { processActiveLivechats, callGemini };
