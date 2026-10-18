// Rigenera il sito pubblico dopo una modifica dall'admin, così le pagine pronte
// (quelle che leggono Google e i social) contengono subito i nuovi testi e le nuove foto.
// Variabile su Vercel: VERCEL_DEPLOY_HOOK (Settings > Git > Deploy Hooks).
const { send, requireRole } = require("./_lib/server");

let last = 0;

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { message: "Metodo non consentito." });
  const auth = await requireRole(req, ["admin", "editor"]);
  if (auth.error) return send(res, auth.error[0], { message: auth.error[1] });
  const hook = process.env.VERCEL_DEPLOY_HOOK;
  if (!hook) return send(res, 501, { message: "Rigenerazione non configurata: manca il deploy hook di Vercel." });
  if (Date.now() - last < 30000) return send(res, 202, { ok: true, skipped: true });
  last = Date.now();
  const r = await fetch(hook, { method: "POST" });
  if (!r.ok) return send(res, 502, { message: `Vercel ha risposto ${r.status}.` });
  return send(res, 202, { ok: true });
};
