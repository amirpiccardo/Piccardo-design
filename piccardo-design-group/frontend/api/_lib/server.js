// Strumenti condivisi dalle funzioni serverless (Vercel).
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client con chiave di servizio: salta la Row Level Security, quindi solo lato server.
function adminClient() {
  if (!SUPABASE_URL || !SERVICE_KEY) return null;
  return createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch { return {}; } }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); } catch { return {}; }
}

// Verifica che la richiesta arrivi da un utente dell'area riservata con uno dei ruoli indicati.
// Ruoli: admin (tutto), editor (contenuti e messaggi), messages (solo messaggi).
async function requireRole(req, roles = ["admin", "editor", "messages"]) {
  const sb = adminClient();
  if (!sb) return { error: [503, "Supabase non configurato sul server (manca SUPABASE_SERVICE_ROLE_KEY)."] };
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) return { error: [401, "Accesso richiesto."] };
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data?.user?.email) return { error: [401, "Sessione non valida: accedi di nuovo."] };
  const email = data.user.email.toLowerCase();
  const { data: row } = await sb.from("admins").select("email, role").eq("email", email).maybeSingle();
  if (!row) return { error: [403, "Non hai accesso all'area riservata."] };
  if (!roles.includes(row.role)) return { error: [403, "Il tuo ruolo non permette questa operazione."] };
  return { sb, user: data.user, email, role: row.role };
}

// Indirizzo del sito da cui arriva la richiesta (per i link nelle email di invito).
function siteOrigin(req) {
  const origin = req.headers.origin;
  if (origin && /^https?:\/\//.test(origin)) return origin;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  return host ? `${proto}://${host}` : process.env.SITE_URL || "";
}

module.exports = { adminClient, send, readJson, requireRole, siteOrigin };
