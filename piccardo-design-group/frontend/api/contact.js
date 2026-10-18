// Modulo di contatto: salva il messaggio su Supabase e lo inoltra via email a info@liguriadesigngroup.it.
// Variabili su Vercel: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO (facoltativa),
// SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
const nodemailer = require("nodemailer");
const { adminClient, send, readJson } = require("./_lib/server");

const KIND = { rivenditore: "Rivenditore", progettista: "Progettista o architetto", contract: "Progetto contract", azienda: "Azienda in cerca di agente", privato: "Privato" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (s, max) => String(s || "").replace(/\r/g, "").trim().slice(0, max);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Limite semplice per istanza: massimo 5 invii ogni 10 minuti dallo stesso indirizzo IP.
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

async function sendMail(c) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) throw new Error("SMTP non configurato");
  const port = Number(SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  const to = process.env.CONTACT_TO || "info@liguriadesigngroup.it";
  const kind = KIND[c.kind] || c.kind || "non indicato";
  const text = [
    `Nuovo messaggio dal sito liguriadesigngroup.it`,
    ``,
    `Nome: ${c.name}`,
    `Email: ${c.email}`,
    `Telefono: ${c.phone || "non indicato"}`,
    `Chi è: ${kind}`,
    `Pagina: ${c.page || "-"}`,
    ``,
    c.message,
    ``,
    `Per rispondere basta usare "Rispondi": la risposta va direttamente a ${c.email}.`,
  ].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#16213a;line-height:1.5">
<p style="margin:0 0 12px"><strong>Nuovo messaggio dal sito</strong></p>
<table style="border-collapse:collapse;margin-bottom:16px">
<tr><td style="padding:4px 14px 4px 0;color:#59616a">Nome</td><td>${esc(c.name)}</td></tr>
<tr><td style="padding:4px 14px 4px 0;color:#59616a">Email</td><td><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></td></tr>
<tr><td style="padding:4px 14px 4px 0;color:#59616a">Telefono</td><td>${esc(c.phone || "non indicato")}</td></tr>
<tr><td style="padding:4px 14px 4px 0;color:#59616a">Chi è</td><td>${esc(kind)}</td></tr>
<tr><td style="padding:4px 14px 4px 0;color:#59616a">Pagina</td><td>${esc(c.page || "-")}</td></tr>
</table>
<div style="white-space:pre-wrap;background:#f3f4f5;padding:14px;border-left:3px solid #a8834a">${esc(c.message)}</div>
<p style="color:#59616a;font-size:13px;margin-top:16px">Rispondi a questa email per scrivere direttamente a ${esc(c.email)}.</p></div>`;

  await transporter.sendMail({
    from: { name: "Sito Liguria Design Group", address: SMTP_USER },
    to,
    replyTo: { name: c.name, address: c.email },
    subject: `Richiesta dal sito: ${c.name} (${kind})`,
    text,
    html,
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { message: "Metodo non consentito." });
  const body = await readJson(req);

  // Anti-spam: campo nascosto compilato o invio troppo rapido = bot. Rispondiamo "ok" senza fare nulla.
  if (body.website || Number(body.elapsed || 0) < 2500) return send(res, 200, { ok: true });

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();
  if (limited(ip)) return send(res, 429, { message: "Troppi invii ravvicinati. Riprovate tra qualche minuto." });

  const c = {
    name: clean(body.name, 120),
    email: clean(body.email, 254).toLowerCase(),
    phone: clean(body.phone, 30),
    kind: clean(body.kind, 30),
    message: clean(body.message, 3000),
    page: clean(body.page, 200),
  };
  if (c.name.length < 2) return send(res, 400, { message: "Il nome è obbligatorio." });
  if (!EMAIL_RE.test(c.email)) return send(res, 400, { message: "L'indirizzo email non è valido." });
  if (c.message.length < 10) return send(res, 400, { message: "Il messaggio è troppo breve." });
  if (!body.privacy) return send(res, 400, { message: "Serve il consenso privacy." });

  let emailed = false;
  let stored = false;
  try {
    await sendMail(c);
    emailed = true;
  } catch (err) {
    console.error("Invio email non riuscito:", err.message);
  }

  const sb = adminClient();
  if (sb) {
    const { error } = await sb.from("contacts").insert({ name: c.name, email: c.email, phone: c.phone, kind: c.kind, message: c.message, emailed });
    if (error) console.error("Salvataggio messaggio non riuscito:", error.message);
    else stored = true;
  }

  if (!emailed && !stored) return send(res, 502, { message: "Non siamo riusciti a inviare il messaggio." });
  return send(res, 200, { ok: true, emailed, stored });
};
