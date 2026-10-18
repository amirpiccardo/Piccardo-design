import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { changePassword, listUsers, inviteUser, changeRole, removeUser } from "./api";
import { Field, PasswordInput, useAdmin, useConfirm } from "./ui";

export const ROLES = {
  admin: { label: "Amministratore", text: "Può fare tutto, compreso invitare persone e cambiare i ruoli." },
  editor: { label: "Redattore", text: "Modifica pagine, marchi, persone e contract; legge messaggi e newsletter." },
  messages: { label: "Messaggi", text: "Vede solo i messaggi del modulo e gli iscritti alla newsletter." },
};

function strength(p) {
  let s = 0;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return ["Debole", "Debole", "Discreta", "Buona", "Ottima"][s];
}

const fmt = (d) => new Date(d).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });

function People({ me }) {
  const { notify } = useAdmin();
  const [confirm, confirmUI] = useConfirm();
  const [users, setUsers] = useState(null);
  const [form, setForm] = useState({ email: "", role: "editor" });
  const [busy, setBusy] = useState(false);

  const load = () => listUsers().then(setUsers).catch((e) => { notify(e.message, "err"); setUsers([]); });
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const invite = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return notify("Email non valida.", "err");
    setBusy(true);
    try {
      const r = await inviteUser(form.email.trim().toLowerCase(), form.role);
      notify(r.message || `Invito inviato a ${form.email}: riceverà un'email per scegliere la password.`);
      setForm({ email: "", role: "editor" });
      load();
    } catch (err) { notify(err.message, "err"); } finally { setBusy(false); }
  };

  const setRole = async (u, role) => {
    try { await changeRole(u.email, role); notify(`${u.email} ora è ${ROLES[role].label.toLowerCase()}`); load(); }
    catch (err) { notify(err.message, "err"); }
  };

  const del = async (u) => {
    if (!(await confirm({ title: "Togliere l'accesso?", message: `${u.email} non potrà più entrare nell'area riservata.`, confirmLabel: "Togli accesso", danger: true }))) return;
    try { await removeUser(u.email); notify("Accesso rimosso"); load(); } catch (err) { notify(err.message, "err"); }
  };

  return (
    <div className="card">
      {confirmUI}
      <h2>Persone con accesso</h2>
      <p className="sub">Ogni persona entra con la sua email e la sua password. Il ruolo decide cosa può vedere e modificare.</p>
      <div className="items">
        {(users || []).map((u) => (
          <div className="item" key={u.email} style={{ gridTemplateColumns: "minmax(0,1fr)" }}>
            <div className="item__body">
              <b>{u.email}{u.email === me ? " (tu)" : ""}</b>
              <span>Dal {fmt(u.created_at)}{u.invited_by ? `, invitato da ${u.invited_by}` : ""}</span>
            </div>
            <div className="item__actions" style={{ gridColumn: "1 / -1", alignItems: "center" }}>
              <div className="f" style={{ minWidth: 200 }}>
                <select aria-label={`Ruolo di ${u.email}`} value={u.role} disabled={u.email === me} onChange={(e) => setRole(u, e.target.value)}>
                  {Object.entries(ROLES).map(([k, r]) => <option key={k} value={k}>{r.label}</option>)}
                </select>
              </div>
              {u.email !== me && <button type="button" className="b b--danger b--sm" onClick={() => del(u)}>Togli accesso</button>}
            </div>
          </div>
        ))}
      </div>

      <form className="stack" onSubmit={invite} style={{ paddingTop: 16, borderTop: "1px solid var(--line)" }}>
        <h3>Invita una persona</h3>
        <div className="grid-2">
          <Field id="inv-email" label="Email" type="email" autoComplete="off" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <div className="f">
            <label htmlFor="inv-role">Ruolo</label>
            <select id="inv-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {Object.entries(ROLES).map(([k, r]) => <option key={k} value={k}>{r.label}</option>)}
            </select>
            <span className="hint">{ROLES[form.role].text}</span>
          </div>
        </div>
        <p className="sub">Riceverà un'email con un link per scegliere la sua password al primo accesso.</p>
        <div><button className="b" type="submit" disabled={busy}>{busy ? <span className="spin" /> : <FontAwesomeIcon icon={faUserPlus} />}Invia invito</button></div>
      </form>
    </div>
  );
}

export default function Account({ session, role, onLogout }) {
  const { notify } = useAdmin();
  const [pw, setPw] = useState({ current: "", next: "", again: "" });
  const [busy, setBusy] = useState(false);
  const me = session?.user?.email?.toLowerCase();

  const submitPw = async (e) => {
    e.preventDefault();
    if (pw.next.length < 10) return notify("La nuova password deve avere almeno 10 caratteri.", "err");
    if (pw.next !== pw.again) return notify("Le due password nuove non coincidono.", "err");
    setBusy(true);
    try {
      await changePassword(pw.current, pw.next);
      setPw({ current: "", next: "", again: "" });
      notify("Password aggiornata");
    } catch (err) { notify(err.message, "err"); } finally { setBusy(false); }
  };

  return (
    <div className="stack">
      <div className="card">
        <h2>Il tuo account</h2>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="item__body">
            <b>{me}</b>
            <span>{ROLES[role]?.label}: {ROLES[role]?.text}</span>
          </div>
          <button type="button" className="b b--ghost" onClick={onLogout}><FontAwesomeIcon icon={faRightFromBracket} /> Esci</button>
        </div>
      </div>

      <form className="card" onSubmit={submitPw}>
        <h2>Cambia password</h2>
        <div className="grid-2">
          <PasswordInput id="pw-cur" label="Password attuale" value={pw.current} onChange={(v) => setPw({ ...pw, current: v })} />
          <span />
          <PasswordInput id="pw-new" label="Nuova password" autoComplete="new-password" value={pw.next} onChange={(v) => setPw({ ...pw, next: v })} hint={pw.next ? `Sicurezza: ${strength(pw.next)}. Almeno 10 caratteri.` : "Almeno 10 caratteri."} />
          <PasswordInput id="pw-again" label="Ripeti la nuova password" autoComplete="new-password" value={pw.again} onChange={(v) => setPw({ ...pw, again: v })} />
        </div>
        <div><button className="b" type="submit" disabled={busy}>{busy && <span className="spin" />}Aggiorna password</button></div>
      </form>

      {role === "admin" && <People me={me} />}
    </div>
  );
}
