import "server-only";

import {
  adminServiceHeaders,
  requireAdminServiceConfig,
} from "@/lib/admin-service";

const PRIMARY_KEY = (process.env.GEMINI_API_KEY || "").trim();
const KEY_CLIVORA_APP = (process.env.GEMINI_API_KEY_APP || "").trim();
const KEY_CLIVORA_AI = (process.env.GEMINI_API_KEY_AI || "").trim();
const FALLBACK_KEY = (
  process.env.GEMINI_API_KEY_FALLBACK ||
  process.env.GEMINI_FALLBACK_API_KEY ||
  ""
).trim();
const TERTIARY_KEY = (
  process.env.GEMINI_API_KEY_BACKUP_3 ||
  process.env.GEMINI_API_KEY_TERTIARY ||
  process.env.GEMINI_TERTIARY_API_KEY ||
  ""
).trim();

export const ALL_GEMINI_KEYS = [
  PRIMARY_KEY,
  KEY_CLIVORA_APP,
  KEY_CLIVORA_AI,
  FALLBACK_KEY,
  TERTIARY_KEY,
].filter(Boolean);

/**
 * Remove em dashes and en dashes to enforce user preference across all outputs
 */
export function sanitizeDashes(text: string): string {
  if (!text) return "";
  return text.replace(/[\u2014\u2013]/g, "-");
}

/**
 * Resolves the active Gemini API keys from server env vars or admin secrets.
 */
export async function getGeminiApiKeys(): Promise<{
  primary: string;
  keys: string[];
}> {
  try {
    const { url, serviceRoleKey } = requireAdminServiceConfig();
    const res = await fetch(
      `${url}/rest/v1/admin_integration_secrets?select=value&key=eq.GEMINI_API_KEY&limit=1`,
      {
        headers: adminServiceHeaders(serviceRoleKey),
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      },
    );
    if (res.ok) {
      const rows = (await res.json()) as Array<{ value?: unknown }>;
      const dbKey = typeof rows[0]?.value === "string" ? rows[0].value.trim() : "";
      if (dbKey) {
        return {
          primary: dbKey,
          keys: [dbKey, ...ALL_GEMINI_KEYS.filter((k) => k !== dbKey)],
        };
      }
    }
  } catch {
    // Database or service key unavailable; use configured environment keys only.
  }
  return { primary: PRIMARY_KEY || ALL_GEMINI_KEYS[0] || "", keys: ALL_GEMINI_KEYS };
}

export async function getGeminiApiKey(): Promise<string | null> {
  const keys = await getGeminiApiKeys();
  return keys.primary || keys.keys[0] || null;
}

export type GeminiGenerateOptions = {
  prompt?: string;
  contents?: Array<{ role?: string; parts: Array<{ text: string }> }>;
  systemInstruction?: string;
  maxOutputTokens?: number;
  temperature?: number;
  model?: string;
};

const WORKING_MODELS = [
  process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-3.6-flash",
];

async function executeGeminiRequest(
  apiKey: string,
  keySlot: number,
  options: GeminiGenerateOptions,
  modelName: string
): Promise<string | null> {
  const maxTokens = Math.min(options.maxOutputTokens || 600, 1500);
  const temperature = options.temperature ?? 0.5;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  let contents: Array<{ role?: string; parts: Array<{ text: string }> }> = [];

  if (options.contents && options.contents.length > 0) {
    contents = options.contents
      .filter((c) => c && c.parts && c.parts.length > 0 && c.parts[0].text)
      .map((c) => ({
        role: c.role === "assistant" || c.role === "model" ? "model" : "user",
        parts: c.parts.map((p) => ({ text: p.text })),
      }));
  } else if (options.prompt) {
    contents = [
      {
        role: "user",
        parts: [{ text: options.prompt }],
      },
    ];
  } else {
    return null;
  }

  if (contents.length === 0) return null;

  const payload: Record<string, unknown> = {
    contents,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature,
    },
  };

  if (options.systemInstruction) {
    payload.system_instruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.warn(`[executeGeminiRequest] HTTP ${res.status} with model ${modelName} on key#${keySlot}`);
      return null;
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
    return rawText ? sanitizeDashes(rawText) : null;
  } catch (err) {
    console.warn(`[executeGeminiRequest] Model ${modelName} on key#${keySlot} error or timeout:`, err);
    return null;
  }
}

/**
 * Caller for Google Gemini API with automatic key and model failover
 */
export async function callGemini(options: GeminiGenerateOptions): Promise<string | null> {
  const { keys } = await getGeminiApiKeys();
  const modelsToTry = options.model ? [options.model, ...WORKING_MODELS.filter((m) => m !== options.model)] : WORKING_MODELS;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!key) continue;

    for (const model of modelsToTry) {
      const result = await executeGeminiRequest(key, i + 1, options, model);
      if (result) {
        return result;
      }
    }
    console.log(`[callGemini] Key ${i + 1}/${keys.length} exhausted across models. Trying next key in pool...`);
  }

  return null;
}

