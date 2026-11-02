/* ==========================================================================
   CISSP Field Manual — sync Worker
   Stores one opaque, client-encrypted snapshot per device.
   The Worker never sees plaintext progress and never sees the sync code;
   it derives an account id from the bearer code with SHA-256.
   ========================================================================== */

const ALLOWED_ORIGINS = new Set([
  "https://bonzili.me",
  "https://www.bonzili.me",
  "http://localhost:8000",
  "http://127.0.0.1:8000"
]);

const MAX_BODY = 900000;
const MAX_DEVICES = 10;
const CODE_RE = /^[0-9A-F]{32}$/;
const encoder = new TextEncoder();

function cors(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: Object.assign(cors(origin), {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    })
  });
}

async function accountFor(code) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode("cissp-sync-account:" + code)
  );
  return Array.from(new Uint8Array(digest))
    .map(function (b) { return b.toString(16).padStart(2, "0"); })
    .join("");
}

function readCode(request) {
  const header = request.headers.get("Authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  const code = match[1].toUpperCase().replace(/[^0-9A-F]/g, "");
  return CODE_RE.test(code) ? code : null;
}

function validDeviceId(id) {
  return typeof id === "string" && /^[A-Za-z0-9._:-]{8,80}$/.test(id);
}

async function readJson(request) {
  const declared = Number(request.headers.get("Content-Length") || 0);
  if (declared > MAX_BODY) throw new Error("Payload too large.");
  const text = await request.text();
  if (text.length > MAX_BODY) throw new Error("Payload too large.");
  if (!text) return {};
  return JSON.parse(text);
}

function devicesFromRows(rows) {
  const out = [];
  (rows || []).forEach(function (row) {
    try {
      out.push({
        deviceId: row.device,
        envelope: JSON.parse(row.envelope),
        updatedAt: row.updated_at
      });
    } catch (err) {
      /* Skip a corrupt row rather than failing every device. */
    }
  });
  return out;
}

async function listDevices(env, account) {
  const rows = await env.DB.prepare(
    "SELECT device, envelope, updated_at FROM progress WHERE account = ? ORDER BY updated_at ASC"
  ).bind(account).all();
  return devicesFromRows(rows.results);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    if (url.pathname === "/v1/health") {
      return json({ ok: true }, 200, origin);
    }

    if (url.pathname !== "/v1/sync") {
      return json({ error: "Not found." }, 404, origin);
    }

    if (request.method !== "GET" && request.method !== "POST" && request.method !== "DELETE") {
      return json({ error: "Method not allowed." }, 405, origin);
    }

    const code = readCode(request);
    if (!code) return json({ error: "That sync code is not valid." }, 401, origin);

    const account = await accountFor(code);
    const lockedAccount = String(env.ACCOUNT_ID || "").trim().toLowerCase();
    if (lockedAccount && account !== lockedAccount) {
      return json({ error: "This sync service is locked to another account." }, 401, origin);
    }

    try {
      if (request.method === "GET") {
        return json({ ok: true, devices: await listDevices(env, account) }, 200, origin);
      }

      if (request.method === "POST") {
        const body = await readJson(request);
        if (!validDeviceId(body.deviceId)) {
          return json({ error: "That device id is not valid." }, 400, origin);
        }
        if (!body.envelope || typeof body.envelope !== "object" ||
            typeof body.envelope.ct !== "string" || typeof body.envelope.iv !== "string") {
          return json({ error: "That sync payload is not valid." }, 400, origin);
        }

        const envelope = JSON.stringify(body.envelope);
        if (envelope.length > MAX_BODY) {
          return json({ error: "Payload too large." }, 413, origin);
        }

        const existing = await env.DB.prepare(
          "SELECT device FROM progress WHERE account = ? AND device = ?"
        ).bind(account, body.deviceId).first();
        if (!existing) {
          const count = await env.DB.prepare(
            "SELECT COUNT(*) AS n FROM progress WHERE account = ?"
          ).bind(account).first();
          if (count && Number(count.n) >= MAX_DEVICES) {
            return json({ error: "This sync account already has the maximum number of devices." }, 409, origin);
          }
        }

        await env.DB.prepare(
          "INSERT INTO progress (account, device, envelope, updated_at) VALUES (?, ?, ?, ?) " +
          "ON CONFLICT(account, device) DO UPDATE SET envelope = excluded.envelope, updated_at = excluded.updated_at"
        ).bind(account, body.deviceId, envelope, Date.now()).run();

        return json({ ok: true, devices: await listDevices(env, account) }, 200, origin);
      }

      if (request.method === "DELETE") {
        const body = await readJson(request);
        if (body.all === true) {
          await env.DB.prepare("DELETE FROM progress WHERE account = ?").bind(account).run();
          return json({ ok: true, deleted: "all" }, 200, origin);
        }
        if (!validDeviceId(body.deviceId)) {
          return json({ error: "That device id is not valid." }, 400, origin);
        }
        await env.DB.prepare(
          "DELETE FROM progress WHERE account = ? AND device = ?"
        ).bind(account, body.deviceId).run();
        return json({ ok: true, deleted: "device" }, 200, origin);
      }
    } catch (err) {
      const tooLarge = err && err.message === "Payload too large.";
      return json(
        { error: tooLarge ? "Payload too large." : "The sync service could not complete that request." },
        tooLarge ? 413 : 500,
        origin
      );
    }
  }
};
