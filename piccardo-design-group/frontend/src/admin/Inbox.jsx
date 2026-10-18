import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv, faTrash, faReply } from "@fortawesome/free-solid-svg-icons";
import { listContacts, markContactRead, deleteContact, listSubscribers, deleteSubscriber } from "./api";
import { exportToCsv } from "../utils/csv";
import { Loading, useAdmin, useConfirm } from "./ui";

const fmt = (d) => new Date(d).toLocaleString("it-IT", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const KIND = { rivenditore: "Rivenditore", progettista: "Progettista", contract: "Contract", azienda: "Azienda", privato: "Privato" };

export function Contacts({ onUnread }) {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState("");
  const [only, setOnly] = useState("all");
  const { notify } = useAdmin();
  const [confirm, confirmUI] = useConfirm();

  const load = () => listContacts().then((r) => { setRows(r); onUnread?.(r.filter((c) => !c.read).length); }).catch((e) => { notify(e.message, "err"); setRows([]); });
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setRead = async (c, read) => {
    setRows((rs) => { const n = rs.map((x) => (x.id === c.id ? { ...x, read } : x)); onUnread?.(n.filter((x) => !x.read).length); return n; });
    markContactRead(c.id, read).catch((e) => notify(e.message, "err"));
  };
  const del = async (c) => {
    if (!(await confirm({ title: "Eliminare il messaggio?", message: `Da ${c.name}. Non si può annullare.`, confirmLabel: "Elimina", danger: true }))) return;
    try { await deleteContact(c.id); notify("Messaggio eliminato"); load(); } catch (e) { notify(e.message, "err"); }
  };

  if (!rows) return <Loading />;
  const s = q.toLowerCase();
  const shown = rows.filter((c) => (only === "unread" ? !c.read : true) && [c.name, c.email, c.message, c.phone].join(" ").toLowerCase().includes(s));
  const unread = rows.filter((c) => !c.read).length;

  return (
    <div className="stack">
      {confirmUI}
      <div className="row">
        <div className="f" style={{ flex: "1 1 240px" }}><input type="search" placeholder="Cerca per nome, email o testo" aria-label="Cerca messaggi" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <button type="button" className={`b b--sm ${only === "all" ? "" : "b--ghost"}`} onClick={() => setOnly("all")}>Tutti ({rows.length})</button>
        <button type="button" className={`b b--sm ${only === "unread" ? "" : "b--ghost"}`} onClick={() => setOnly("unread")}>Da leggere ({unread})</button>
        <button type="button" className="b b--ghost b--sm" disabled={!shown.length} onClick={() => exportToCsv("messaggi.csv", shown, [
          { label: "Data", value: (r) => fmt(r.created_at) }, { label: "Nome", value: (r) => r.name }, { label: "Email", value: (r) => r.email },
          { label: "Telefono", value: (r) => r.phone }, { label: "Tipo", value: (r) => KIND[r.kind] || r.kind }, { label: "Messaggio", value: (r) => r.message },
          { label: "Letto", value: (r) => (r.read ? "sì" : "no") },
        ])}><FontAwesomeIcon icon={faFileCsv} /> Esporta CSV</button>
      </div>
      {shown.length === 0 ? <div className="empty">{rows.length ? "Nessun messaggio corrisponde alla ricerca." : "Ancora nessun messaggio dal sito."}</div> : shown.map((c) => (
        <details className={`mail${c.read ? "" : " unread"}`} key={c.id} onToggle={(e) => e.currentTarget.open && !c.read && setRead(c, true)}>
          <summary>
            <span className="dot" aria-label={c.read ? "Letto" : "Da leggere"} />
            <span style={{ minWidth: 0 }}><b>{c.name} {c.kind && <span className="tag">{KIND[c.kind] || c.kind}</span>}</b><span>{c.message}</span></span>
            <time dateTime={c.created_at}>{fmt(c.created_at)}</time>
          </summary>
          <div className="mail__body">
            <div className="row" style={{ fontSize: 14 }}>
              <a href={`mailto:${c.email}`}>{c.email}</a>
              {c.phone && <a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a>}
              {!c.emailed && <span className="tag tag--warn">Email di notifica non partita</span>}
            </div>
            <pre>{c.message}</pre>
            <div className="row">
              <a className="b b--sm" href={`mailto:${c.email}?subject=${encodeURIComponent("Re: la vostra richiesta a Liguria Design Group")}`}><FontAwesomeIcon icon={faReply} /> Rispondi</a>
              <button type="button" className="b b--ghost b--sm" onClick={() => setRead(c, !c.read)}>{c.read ? "Segna da leggere" : "Segna come letto"}</button>
              <button type="button" className="b b--danger b--sm" onClick={() => del(c)}><FontAwesomeIcon icon={faTrash} /> Elimina</button>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

export function Newsletter() {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState("");
  const { notify } = useAdmin();
  const [confirm, confirmUI] = useConfirm();
  const load = () => listSubscribers().then(setRows).catch((e) => { notify(e.message, "err"); setRows([]); });
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const del = async (r) => {
    if (!(await confirm({ title: "Rimuovere l'iscritto?", message: r.email, confirmLabel: "Rimuovi", danger: true }))) return;
    try { await deleteSubscriber(r.id); notify("Iscritto rimosso"); load(); } catch (e) { notify(e.message, "err"); }
  };

  if (!rows) return <Loading />;
  const shown = rows.filter((r) => r.email.includes(q.toLowerCase()));
  return (
    <div className="stack">
      {confirmUI}
      <div className="row">
        <div className="f" style={{ flex: "1 1 240px" }}><input type="search" placeholder="Cerca email" aria-label="Cerca iscritti" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <button type="button" className="b b--ghost b--sm" disabled={!shown.length} onClick={() => exportToCsv("iscritti-newsletter.csv", shown, [{ label: "Email", value: (r) => r.email }, { label: "Iscritto il", value: (r) => fmt(r.created_at) }])}><FontAwesomeIcon icon={faFileCsv} /> Esporta CSV</button>
      </div>
      {shown.length === 0 ? <div className="empty">{rows.length ? "Nessuna email corrisponde." : "Ancora nessun iscritto."}</div> : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Email</th><th>Iscritto il</th><th aria-label="Azioni" /></tr></thead>
            <tbody>{shown.map((r) => (
              <tr key={r.id}><td>{r.email}</td><td className="num">{fmt(r.created_at)}</td><td style={{ textAlign: "right" }}><button type="button" className="b b--danger b--sm" onClick={() => del(r)}>Rimuovi</button></td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
