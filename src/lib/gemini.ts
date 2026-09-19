import "server-only";

import { createClient } from "@/lib/supabase/server";

const PRIMARY_KEY = (process.env.GEMINI_API_KEY || "AQ.Ab8RN6I8UIEWWeU7EhUEEZKLplCFXaCwpaVBpmkb8pODZTz6Uw").trim();
const FALLBACK_KEY = (
  process.env.GEMINI_API_KEY_FALLBACK ||
  process.env.GEMINI_FALLBACK_API_KEY ||
  "AQ.Ab8RN6KaOvEU6Wk9AsQsyJJnog_zGuMJxV1Bh0m-XS2ncIVLlw"
).trim();
const TERTIARY_KEY = (
  process.env.GEMINI_API_KEY_BACKUP_3 ||
  process.env.GEMINI_API_KEY_TERTIARY ||
  process.env.GEMINI_TERTIARY_API_KEY ||
  "AQ.Ab8RN6KF7SUhFAh9z_Eua6o6hN7vI7cRVPHnF5TKzsqwW6puzQ"
).trim();

/**
 * Remove em dashes and en dashes to enforce user preference across all outputs
 */
export function sanitizeDashes(text: string): string {
  if (!text) return "";
  return text.replace(/[\u2014\u2013]/g, "-");
}

/**
 * Resolves the active Gemini API keys
 */
export async function getGeminiApiKeys(): Promise<{ primary: string; fallback: string; tertiary: string }> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("admin_get_integration_secret", {
      p_key: "GEMINI_API_KEY",
    });
    if (typeof data === "string" && data.trim()) {
      return { primary: data.trim(), fallback: FALLBACK_KEY, tertiary: TERTIARY_KEY };
    }
  } catch {
    // Database lookup unavailable, use default keys
  }
  return { primary: PRIMARY_KEY, fallback: FALLBACK_KEY, tertiary: TERTIARY_KEY };
}

export async function getGeminiApiKey(): Promise<string | null> {
  const keys = await getGeminiApiKeys();
  return keys.primary || keys.fallback || null;
}

export type GeminiGenerateOptions = {
  prompt: string;
  systemInstruction?: string;
  maxOutputTokens?: number;
  temperature?: number;
  model?: string;
};

async function executeGeminiRequest(apiKey: string, options: GeminiGenerateOptions): Promise<string | null> {
  const model = options.model || "gemini-flash-lite-latest";
  const maxTokens = Math.min(options.maxOutputTokens || 400, 800);
  const temperature = options.temperature ?? 0.7;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents: Array<{ role?: string; parts: Array<{ text: string }> }> = [];

  if (options.systemInstruction) {
    contents.push({
      role: "user",
      parts: [{ text: `Instructions: ${options.systemInstruction}` }],
    });
    contents.push({
      role: "model",
      parts: [{ text: "Understood. I will follow these instructions strictly with zero em dashes." }],
    });
  }

  contents.push({
    role: "user",
    parts: [{ text: options.prompt }],
  });

  const payload = {
    contents,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature,
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn(`[executeGeminiRequest] HTTP ${res.status} with key ${apiKey.slice(0, 10)}...`);
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
    console.error("[executeGeminiRequest] Network error:", err);
    return null;
  }
}

/**
 * Caller for Google Gemini API with automatic fallback key failover and zero-cost free-tier caps
 */
export async function callGemini(options: GeminiGenerateOptions): Promise<string | null> {
  const keys = await getGeminiApiKeys();

  // 1. Try Primary Key
  if (keys.primary) {
    const primaryResult = await executeGeminiRequest(keys.primary, options);
    if (primaryResult) return primaryResult;
  }

  // 2. If Primary Key failed or exhausted, seamlessly use Fallback Key
  if (keys.fallback && keys.fallback !== keys.primary) {
    console.log("[callGemini] Primary key failed. Executing seamless fallback to backup key...");
    const fallbackResult = await executeGeminiRequest(keys.fallback, options);
    if (fallbackResult) return fallbackResult;
  }

  // 3. If Fallback Key failed, use Tertiary Key
  if (keys.tertiary && keys.tertiary !== keys.fallback && keys.tertiary !== keys.primary) {
    console.log("[callGemini] Fallback key failed. Executing fallback to tertiary key...");
    const tertiaryResult = await executeGeminiRequest(keys.tertiary, options);
    if (tertiaryResult) return tertiaryResult;
  }

  return null;
}
