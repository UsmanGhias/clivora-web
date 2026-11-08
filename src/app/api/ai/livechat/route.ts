import { NextRequest, NextResponse } from "next/server";
import { callGemini, sanitizeDashes } from "@/lib/gemini";

// Odoo 19 Configuration for direct CRM Lead ingestion
const ODOO_URL = process.env.ODOO_MAIN_URL || "https://clivora.odoo.com";
const ODOO_DB = process.env.ODOO_MAIN_DB || "clivora";
const ODOO_USER = process.env.ODOO_MAIN_USER || "usmanghias1@gmail.com";
const ODOO_KEY = process.env.ODOO_MAIN_API_KEY || "d4e37f9afc54226aebb9d4677a1df8e03cded9df";
const ODOO_UID = parseInt(process.env.ODOO_MAIN_UID || "2", 10);

const SYSTEM_PROMPT = `You are Clivora AI, the official 24/7 intelligent workspace and live chat assistant for Clivora (https://clivora.io).
You speak warmly, directly, and professionally as "Team Clivora" or "our team".
Founder & Lead Architect: Usman Ghias (Portfolio: https://usmanghias.co.uk).

Core Knowledge:
- Clivora is the zero-commission freelance operating system and remote engineering marketplace.
- Platform fee: 0% forever for both freelancers and clients. Freelancers keep 100% of their earnings.
- 7,150+ verified remote engineering and tech jobs available at https://clivora.io/jobs.
- Features: Milestone escrow protection, sequential tax invoicing, client CRM, timesheets, and Flutter mobile app.
- Contractor Profiles: Freelancers set up profiles, tech stacks, and rates at https://clivora.io/connect/apply.
- Hiring Clients: Employers post roles for free and hire contractors directly at https://clivora.io/for-clients.
- Custom Development & Enterprise: CODCrafters (https://codcrafters.org) delivers custom Next.js, Flutter, headless Odoo ERP, and AI systems.

Core Directives:
1. NEVER use em dashes (-) or en dashes (-). Use hyphens (-), colons (:), commas (,), or parentheses.
2. Direct Technical Answers: Answer the visitor's questions thoroughly, accurately, and immediately. If they ask for code, write clean, complete, working code examples (Python, JavaScript, TypeScript, React, SQL, Flutter, etc.). If they ask about platform features, explain them clearly.
3. No Immediate Sales Wall: Do NOT withhold answers or demand an email upfront. Always answer their question completely first.
4. Contact & Hiring Inquiries: If the visitor explicitly asks to contact Team Clivora, hire engineers, request an enterprise consultation, or get a custom quote, invite them to share their email address so Team Clivora can reach out directly.
5. Email Detection: If the visitor shares their email address, thank them warmly, confirm that their details have been noted, and inform them that Team Clivora will follow up with them directly.
6. Tone: Highly competent, senior software engineer voice, helpful, and concise without corporate buzzwords.`;

/**
 * Creates a lead in Odoo CRM (crm.lead) with chat transcript
 */
async function syncToOdooCrm(email: string, messages: Array<{ role: string; content: string }>, sourceUrl?: string) {
  try {
    const transcript = messages
      .map((m) => `${m.role === "user" ? "Visitor" : "Clivora AI"}: ${m.content}`)
      .join("\n\n");

    const firstUserMsg = messages.find((m) => m.role === "user")?.content || "Livechat Inquiry";
    const leadTitle = `Livechat Lead: ${firstUserMsg.slice(0, 60)}`;

    const htmlDescription = `<p><strong>Source:</strong> Clivora AI Livechat (${sourceUrl || "clivora.io"})</p>
<p><strong>Captured Email:</strong> ${email}</p>
<div style="background-color: #f8fafc; padding: 12px; border-left: 3px solid #0d9488; font-family: sans-serif; font-size: 13px; white-space: pre-wrap;">
${transcript}
</div>`;

    const payload = {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [
          ODOO_DB,
          ODOO_UID,
          ODOO_KEY,
          "crm.lead",
          "create",
          [
            {
              name: leadTitle,
              email_from: email,
              partner_name: email.split("@")[0],
              contact_name: email.split("@")[0],
              description: htmlDescription,
              stage_id: 1, // New
            },
          ],
        ],
      },
      id: Date.now(),
    };

    const res = await fetch(`${ODOO_URL}/jsonrpc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.result) {
      console.log(`[Odoo CRM] Successfully created lead ID ${data.result} for ${email}`);
      return data.result;
    }
  } catch (err) {
    console.warn("[Odoo CRM] Lead creation error:", err);
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, sourceUrl } = body as {
      messages?: Array<{ role: string; content: string }>;
      sourceUrl?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Missing messages array" }, { status: 400 });
    }

    const lastMsg = messages[messages.length - 1];
    const userText = lastMsg.content || "";

    // Convert to Gemini contents format
    const geminiContents = messages.slice(-8).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // Call Gemini with full failover
    const reply = await callGemini({
      contents: geminiContents,
      systemInstruction: SYSTEM_PROMPT,
      maxOutputTokens: 600,
      temperature: 0.5,
    });

    const safeReply = reply
      ? sanitizeDashes(reply)
      : "Hello! Clivora is the zero-commission freelance platform and remote jobs hub with 7,150+ listings at clivora.io/jobs. How can Team Clivora help you today?";

    // Detect if an email was shared anywhere in recent user messages
    const emailMatch = userText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    let leadCreated = false;

    if (emailMatch) {
      const email = emailMatch[0].toLowerCase();
      // Asynchronously sync to Odoo CRM
      syncToOdooCrm(email, [...messages, { role: "assistant", content: safeReply }], sourceUrl).catch((err) => {
        console.error("Async CRM sync failed:", err);
      });
      leadCreated = true;
    }

    return NextResponse.json({
      reply: safeReply,
      leadCreated,
    });
  } catch (error) {
    console.error("[Livechat Route Error]", error);
    return NextResponse.json(
      {
        reply: "I am having trouble connecting right now. Please explore our live remote jobs at https://clivora.io/jobs or reach out directly to contact@clivora.io.",
        leadCreated: false,
      },
      { status: 500 }
    );
  }
}
