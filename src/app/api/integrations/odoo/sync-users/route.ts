import { NextResponse } from "next/server";
import { adminErrorResponse, requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

const ODOO_URL = process.env.ODOO_URL || "https://clivora.odoo.com";
const ODOO_DB = process.env.ODOO_DB || "clivora";
const ODOO_KEY = process.env.ODOO_API_KEY || "d4e37f9afc54226aebb9d4677a1df8e03cded9df";
const ODOO_UID = Number(process.env.ODOO_UID || 2);

async function odooRpc(model: string, method: string, args: unknown[], kwargs: Record<string, unknown> = {}) {
  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [ODOO_DB, ODOO_UID, ODOO_KEY, model, method, args, kwargs],
      },
      id: Date.now(),
    }),
  });
  const json = await res.json();
  if (json.error) {
    throw new Error(`${model}.${method}: ${json.error.data?.message || json.error.message}`);
  }
  return json.result;
}

export async function POST(request: Request) {
  try {
    // Writes res.partner / creates res.users in Odoo with the admin API key: admins only.
    await requireAdmin({ requireAal2: false });
    const body = (await request.json().catch(() => ({}))) as {
      user?: { id?: string; email: string; name?: string; account_type?: string; role?: string };
      syncAll?: boolean;
    };

    const supabase = await createClient();

    let usersToSync: Array<{ id: string; email: string; name: string | null; account_type: string | null }> = [];

    if (body.user?.email) {
      usersToSync = [{
        id: body.user.id || "",
        email: body.user.email,
        name: body.user.name || null,
        account_type: body.user.account_type || "freelancer",
      }];
    } else {
      // Fetch latest profiles from Supabase
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, email, name, account_type")
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      usersToSync = profiles || [];
    }

    let syncedCount = 0;
    const errors: string[] = [];

    for (const u of usersToSync) {
      if (!u.email) continue;
      try {
        const cleanEmail = u.email.trim();
        const existingPartner = (await odooRpc("res.partner", "search_read", [[["email", "=ilike", cleanEmail]]], {
          fields: ["id", "name"],
        })) as Array<{ id: number; name: string }>;

        let partnerId: number;
        if (existingPartner.length > 0) {
          partnerId = existingPartner[0].id;
          await odooRpc("res.partner", "write", [
            [partnerId],
            {
              name: u.name || existingPartner[0].name,
              comment: `Clivora Account Type: ${u.account_type || "freelancer"} | UUID: ${u.id}`,
            },
          ]);
        } else {
          partnerId = (await odooRpc("res.partner", "create", [
            {
              name: u.name || cleanEmail.split("@")[0],
              email: cleanEmail,
              comment: `Clivora Account Type: ${u.account_type || "freelancer"} | UUID: ${u.id}`,
            },
          ])) as number;
        }

        // Check if user exists in res.users
        const existingUser = (await odooRpc("res.users", "search_read", [[["login", "=ilike", cleanEmail]]], {
          fields: ["id", "login"],
        })) as Array<{ id: number; login: string }>;

        if (existingUser.length === 0) {
          try {
            await odooRpc("res.users", "create", [
              {
                name: u.name || cleanEmail.split("@")[0],
                login: cleanEmail,
                email: cleanEmail,
                partner_id: partnerId,
              },
            ]);
          } catch (createErr: any) {
            // Ignore if user already has an active portal state
          }
        }
        syncedCount++;
      } catch (userErr: any) {
        errors.push(`${u.email}: ${userErr.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      total: usersToSync.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    return adminErrorResponse(err, "Odoo user sync failed");
  }
}
