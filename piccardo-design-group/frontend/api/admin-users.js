// Utenti dell'area riservata: invito, cambio ruolo, rimozione. Solo per il ruolo "admin".
const { send, readJson, requireRole, siteOrigin } = require("./_lib/server");

const ROLES = ["admin", "editor", "messages"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function adminCount(sb) {
  const { count } = await sb.from("admins").select("email", { count: "exact", head: true }).eq("role", "admin");
  return count || 0;
}

module.exports = async (req, res) => {
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return send(res, auth.error[0], { message: auth.error[1] });
  const { sb, email: me } = auth;
  const body = await readJson(req);
  const email = String(body.email || "").trim().toLowerCase();
  const role = String(body.role || "");

  // Invita: crea l'utente e gli manda l'email per scegliere la password.
  if (req.method === "POST") {
    if (!EMAIL_RE.test(email)) return send(res, 400, { message: "Email non valida." });
    if (!ROLES.includes(role)) return send(res, 400, { message: "Ruolo non valido." });
    const { data: existing } = await sb.from("admins").select("email").eq("email", email).maybeSingle();
    if (existing) return send(res, 409, { message: "Questa persona ha già accesso. Puoi cambiarle il ruolo dall'elenco." });

    const { error: rowError } = await sb.from("admins").insert({ email, role, invited_by: me });
    if (rowError) return send(res, 500, { message: rowError.message });

    const redirectTo = `${siteOrigin(req)}/login?invito=1`;
    const { error } = await sb.auth.admin.inviteUserByEmail(email, { redirectTo });
    if (error) {
      if (/already been registered|already exists/i.test(error.message)) {
        return send(res, 200, { ok: true, existing: true, message: "Questa email aveva già un account: può entrare con la sua password o usare \"Primo accesso o password dimenticata\"." });
      }
      await sb.from("admins").delete().eq("email", email);
      const smtp = /rate limit|not authorized|smtp|sending/i.test(error.message);
      return send(res, 502, {
        message: smtp
          ? "Supabase non è riuscito a spedire l'invito. Con il piano gratuito l'email parte solo verso indirizzi del team Supabase: per invitare altri serve impostare l'SMTP (Supabase > Authentication > Emails)."
          : `Invito non riuscito: ${error.message}`,
      });
    }
    return send(res, 200, { ok: true });
  }

  // Cambia ruolo
  if (req.method === "PATCH") {
    if (!ROLES.includes(role)) return send(res, 400, { message: "Ruolo non valido." });
    if (email === me && role !== "admin") return send(res, 400, { message: "Non puoi togliere a te stesso il ruolo di amministratore." });
    const { error } = await sb.from("admins").update({ role }).eq("email", email);
    if (error) return send(res, 500, { message: error.message });
    return send(res, 200, { ok: true });
  }

  // Rimuove l'accesso (l'account resta, ma non entra più nell'area riservata)
  if (req.method === "DELETE") {
    if (email === me) return send(res, 400, { message: "Non puoi togliere l'accesso a te stesso." });
    const { data: row } = await sb.from("admins").select("role").eq("email", email).maybeSingle();
    if (row?.role === "admin" && (await adminCount(sb)) <= 1) return send(res, 400, { message: "Deve restare almeno un amministratore." });
    const { error } = await sb.from("admins").delete().eq("email", email);
    if (error) return send(res, 500, { message: error.message });
    return send(res, 200, { ok: true });
  }

  return send(res, 405, { message: "Metodo non consentito." });
};
