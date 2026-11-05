import "server-only";

export interface OdooRpcResponse<T> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: {
      name?: string;
      debug?: string;
      message?: string;
    };
  };
}

/**
 * Returns Odoo configuration with environment variable support and fallbacks.
 */
export function getOdooConfig() {
  const url = (
    process.env.ODOO_URL ||
    process.env.ODOO_MAIN_URL ||
    "https://clivora.odoo.com"
  ).replace(/\/jsonrpc\/?$/, "");

  const db = process.env.ODOO_DB || process.env.ODOO_MAIN_DB || "clivora";

  const uidRaw =
    process.env.ODOO_UID ||
    process.env.ODOO_MAIN_UID ||
    "2";
  const uid = Number(uidRaw);

  const apiKey =
    process.env.ODOO_API_KEY ||
    process.env.ODOO_MAIN_API_KEY ||
    "d4e37f9afc54226aebb9d4677a1df8e03cded9df";

  return { url, db, uid, apiKey };
}

/**
 * Calls Odoo 19 via headless JSON-RPC (object.execute_kw).
 * Runs strictly on the Node.js server runtime (no browser leakage).
 */
export async function callOdoo<T>(
  model: string,
  method: string,
  args: any[] = [],
  kwargs: Record<string, any> = {}
): Promise<T> {
  const { url, db, uid, apiKey } = getOdooConfig();

  if (!apiKey || !uid) {
    throw new Error("Missing Odoo credentials in environment variables.");
  }

  // Safety safeguard: Guard against unauthorized module installation calls
  if (
    model === "ir.module.module" &&
    ["button_immediate_install", "button_immediate_upgrade", "write"].includes(method)
  ) {
    throw new Error(
      "SECURITY DIRECTIVE VIOLATION: Zero module installations allowed on Odoo instances."
    );
  }

  const endpoint = `${url}/jsonrpc`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [db, uid, apiKey, model, method, args, kwargs],
      },
      id: Date.now(),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Odoo HTTP network error: ${response.statusText}`);
  }

  const data: OdooRpcResponse<T> = await response.json();

  if (data.error) {
    const errorMsg =
      data.error.data?.message || data.error.message || "Unknown Odoo JSON-RPC error";
    throw new Error(`Odoo RPC Error (${model}.${method}): ${errorMsg}`);
  }

  return data.result as T;
}

/**
 * Checks whether a specific model exists and is installed in the connected Odoo database.
 */
export async function checkOdooModelExists(modelName: string): Promise<boolean> {
  try {
    const models = await callOdoo<{ id: number; model: string }[]>(
      "ir.model",
      "search_read",
      [[["model", "=", modelName]]],
      { fields: ["id", "model"], limit: 1 }
    );
    return Array.isArray(models) && models.length > 0;
  } catch {
    return false;
  }
}
