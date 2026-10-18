import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { uploadImage, triggerRebuild } from "./api";
import { imgUrl } from "../lib/media";

// ─── Avvisi e pubblicazione ──────────────────────────────────────────────────
const AdminCtx = createContext(null);
export const useAdmin = () => useContext(AdminCtx);

const REBUILD_DELAY = 20000;

export function AdminProvider({ children }) {
  const [toast, setToast] = useState(null);
  const [publish, setPublish] = useState({ state: "idle", text: "Sito aggiornato" });
  const timer = useRef(null);
  const toastTimer = useRef(null);

  const notify = useCallback((text, type = "ok") => {
    clearTimeout(toastTimer.current);
    setToast({ text, type });
    toastTimer.current = setTimeout(() => setToast(null), type === "err" ? 7000 : 3500);
  }, []);

  // Ogni salvataggio programma la rigenerazione del sito pubblico (più modifiche ravvicinate = un solo aggiornamento).
  const changed = useCallback(() => {
    clearTimeout(timer.current);
    setPublish({ state: "busy", text: "Modifiche salvate, pubblicazione tra poco" });
    timer.current = setTimeout(async () => {
      try {
        await triggerRebuild();
        setPublish({ state: "busy", text: "Pubblicazione in corso, circa un minuto" });
        setTimeout(() => setPublish({ state: "ok", text: "Sito pubblico aggiornato" }), 75000);
      } catch (e) {
        setPublish({ state: "err", text: e.message.includes("deploy hook") ? "Modifiche visibili, rigenerazione SEO non configurata" : "Pubblicazione non riuscita: riprova salvando di nuovo" });
      }
    }, REBUILD_DELAY);
  }, []);

  useEffect(() => () => { clearTimeout(timer.current); clearTimeout(toastTimer.current); }, []);

  return (
    <AdminCtx.Provider value={{ notify, changed, publish }}>
      {children}
      {toast && <div className={`toast msg msg--${toast.type}`} role="status">{toast.text}</div>}
    </AdminCtx.Provider>
  );
}

export function PublishBadge() {
  const { publish } = useAdmin();
  return <span className={`publish is-${publish.state}`} aria-live="polite"><i aria-hidden="true" />{publish.text}</span>;
}

// ─── Conferma ────────────────────────────────────────────────────────────────
export function useConfirm() {
  const [state, setState] = useState(null);
  const confirm = useCallback((opts) => new Promise((resolve) => setState({ ...opts, resolve })), []);
  const close = (v) => { state?.resolve(v); setState(null); };
  const ui = state && (
    <div className="modal-back" onClick={() => close(false)}>
      <div className="modal" role="alertdialog" aria-modal="true" aria-labelledby="cf-t" onClick={(e) => e.stopPropagation()}>
        <h2 id="cf-t">{state.title}</h2>
        {state.message && <p>{state.message}</p>}
        <div className="row">
          <button type="button" className="b b--ghost" onClick={() => close(false)} autoFocus>Annulla</button>
          <button type="button" className={`b ${state.danger ? "b--danger" : ""}`} onClick={() => close(true)}>{state.confirmLabel || "Conferma"}</button>
        </div>
      </div>
    </div>
  );
  return [confirm, ui];
}

// ─── Campi ───────────────────────────────────────────────────────────────────
export function Field({ id, label, hint, type = "text", value, onChange, rows = 4, max, ...rest }) {
  const len = String(value || "").length;
  return (
    <div className="f">
      <label htmlFor={id}>{label}</label>
      {type === "textarea" || type === "lines" ? (
        <textarea id={id} rows={rows} value={value || ""} onChange={(e) => onChange(e.target.value)} {...rest} />
      ) : (
        <input id={id} type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} {...rest} />
      )}
      {hint && <span className="hint">{hint}</span>}
      {max && <span className="count" style={{ color: len > max ? "var(--danger)" : undefined }}>{len}/{max}</span>}
    </div>
  );
}

export function PasswordInput({ id, label, value, onChange, hint, autoComplete = "current-password" }) {
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  const onKey = (e) => setCaps(e.getModifierState?.("CapsLock"));
  return (
    <div className="f">
      <label htmlFor={id}>{label}</label>
      <div className="pw">
        <input id={id} type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={onKey} onKeyUp={onKey} autoComplete={autoComplete} required />
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Nascondi password" : "Mostra password"}>{show ? "Nascondi" : "Mostra"}</button>
      </div>
      {caps && <span className="caps">Blocco maiuscole attivo</span>}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

// Una immagine: anteprima, carica, rimuovi. value può essere un URL o { url, alt }.
export function ImageField({ id, label, hint, value, onChange, kind = "photo", folder = "foto", withAlt = kind === "photo" }) {
  const { notify } = useAdmin();
  const [busy, setBusy] = useState(false);
  const url = imgUrl(value);
  const alt = typeof value === "object" && value ? value.alt || "" : "";
  const emit = (u, a = alt) => onChange(withAlt ? (u ? { url: u, alt: a } : null) : u || "");

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      emit(await uploadImage(file, { folder, kind }));
    } catch (err) {
      notify(err.message, "err");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="f img-field">
      <span className="lbl" id={`${id}-l`}>{label}</span>
      <div className="img-field__box">
        <div className={`img-field__prev${kind === "photo" ? " photo" : ""}`}>
          {url ? <img src={url} alt="" /> : <span>Nessuna immagine</span>}
        </div>
        <div className="stack" style={{ gap: 8 }}>
          <div className="row">
            <label className="b b--ghost b--sm file">
              {busy ? <span className="spin" aria-hidden="true" /> : <FontAwesomeIcon icon={faUpload} />}
              {busy ? "Caricamento" : url ? "Sostituisci" : "Carica"}
              <input type="file" accept="image/*" onChange={pick} disabled={busy} aria-labelledby={`${id}-l`} />
            </label>
            {url && <button type="button" className="b b--danger b--sm" onClick={() => emit("")}>Rimuovi</button>}
          </div>
          {withAlt && url && (
            <input aria-label={`Descrizione ${label}`} placeholder="Descrizione per Google e lettori di schermo" value={alt} onChange={(e) => emit(url, e.target.value)} style={{ minHeight: 38, padding: "6px 10px", border: "1px solid var(--line)", borderRadius: 4, fontSize: 14 }} />
          )}
        </div>
      </div>
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

// Più immagini: aggiungi (anche più file insieme), riordina, descrivi, rimuovi.
export function GalleryField({ label, hint, value, onChange, folder = "foto" }) {
  const { notify } = useAdmin();
  const [busy, setBusy] = useState(0);
  const items = Array.isArray(value) ? value.map((v) => (typeof v === "string" ? { url: v, alt: "" } : v)) : [];

  const add = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    if (!files.length) return;
    setBusy(files.length);
    const added = [];
    for (const file of files) {
      try {
        added.push({ url: await uploadImage(file, { folder }), alt: "" });
      } catch (err) {
        notify(`${file.name}: ${err.message}`, "err");
      }
      setBusy((n) => n - 1);
    }
    onChange([...items, ...added]);
  };
  const move = (i, d) => {
    const next = [...items];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="f">
      <span className="lbl">{label}</span>
      {hint && <span className="hint">{hint}</span>}
      <div className="gallery">
        {items.map((it, i) => (
          <div className="gallery__item" key={it.url + i}>
            <img src={it.url} alt="" loading="lazy" />
            <div className="tools">
              <button type="button" className="b b--ghost b--icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Sposta prima"><FontAwesomeIcon icon={faArrowUp} style={{ transform: "rotate(-90deg)" }} /></button>
              <button type="button" className="b b--ghost b--icon" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Sposta dopo"><FontAwesomeIcon icon={faArrowDown} style={{ transform: "rotate(-90deg)" }} /></button>
              <button type="button" className="b b--danger b--icon" onClick={() => onChange(items.filter((_, k) => k !== i))} aria-label="Rimuovi immagine"><FontAwesomeIcon icon={faTrash} /></button>
            </div>
            <input placeholder="Descrizione" aria-label={`Descrizione immagine ${i + 1}`} value={it.alt || ""} onChange={(e) => onChange(items.map((x, k) => (k === i ? { ...x, alt: e.target.value } : x)))} />
          </div>
        ))}
        <label className="gallery__add">
          {busy ? <span><span className="spin" /> Caricamento ({busy})</span> : <span>Aggiungi foto<br /><small style={{ fontWeight: 400 }}>anche più di una</small></span>}
          <input type="file" accept="image/*" multiple onChange={add} disabled={busy > 0} />
        </label>
      </div>
    </div>
  );
}

export function Loading({ text = "Caricamento" }) {
  return <div className="empty"><span className="spin" aria-hidden="true" /> {text}</div>;
}

export function MoveButtons({ index, total, onMove }) {
  return (
    <>
      <button type="button" className="b b--ghost b--icon" onClick={() => onMove(index, -1)} disabled={index === 0} aria-label="Sposta su"><FontAwesomeIcon icon={faArrowUp} /></button>
      <button type="button" className="b b--ghost b--icon" onClick={() => onMove(index, 1)} disabled={index === total - 1} aria-label="Sposta giù"><FontAwesomeIcon icon={faArrowDown} /></button>
    </>
  );
}
