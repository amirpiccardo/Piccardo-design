import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSite } from "../../context/ContentContext";
import { Section } from "./Sections";

const KINDS = [
  { value: "rivenditore", label: "Un rivenditore" },
  { value: "progettista", label: "Un progettista o architetto" },
  { value: "contract", label: "Un hotel, locale o progetto contract" },
  { value: "azienda", label: "Un'azienda in cerca di agente" },
  { value: "privato", label: "Un privato" },
];

const EMPTY = { name: "", email: "", phone: "", kind: "rivenditore", message: "", privacy: false, website: "" };

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Scrivete il vostro nome.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Controllate l'indirizzo email.";
  if (v.phone && !/^[+()\d\s./-]{6,20}$/.test(v.phone.trim())) e.phone = "Il numero contiene caratteri non validi.";
  if (v.message.trim().length < 10) e.message = "Scrivete almeno una riga sul motivo del contatto.";
  if (v.message.length > 3000) e.message = "Il messaggio è troppo lungo (massimo 3000 caratteri).";
  if (!v.privacy) e.privacy = "Serve il consenso per potervi rispondere.";
  return e;
}

// Modulo di contatto: dati aziendali nella colonna, modulo nel contenuto.
export default function ContactBlock({ title, intro, headingLevel = 2, id = "scrivici", first = false }) {
  const site = useSite();
  const { search } = useLocation();
  const [v, setV] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ status: "idle", msg: "" });
  const startedAt = useRef(Date.now());

  // Precompila dai link "Richiedi listino", "Prenota visita" ecc.
  useEffect(() => {
    const p = new URLSearchParams(search);
    const tipo = p.get("tipo");
    const richiesta = p.get("richiesta");
    const marchio = p.get("marchio");
    setV((prev) => ({
      ...prev,
      kind: KINDS.some((k) => k.value === tipo) ? tipo : prev.kind,
      message: prev.message || [richiesta && `Richiesta: ${richiesta}`, marchio && `Marchio: ${marchio}`].filter(Boolean).join("\n") + (richiesta || marchio ? "\n" : ""),
    }));
  }, [search]);

  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`cf-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setState({ status: "busy", msg: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, elapsed: Date.now() - startedAt.current, page: window.location.pathname }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Invio non riuscito.");
      setV(EMPTY);
      setState({ status: "ok", msg: "Messaggio inviato. Vi rispondiamo entro un giorno lavorativo." });
    } catch (err) {
      setState({ status: "err", msg: `${err.message} Potete anche scriverci a ${site.email}.` });
    }
  };

  const fieldProps = (k) => ({
    id: `cf-${k}`,
    value: v[k],
    onChange: set(k),
    "aria-invalid": errors[k] ? "true" : undefined,
    "aria-describedby": errors[k] ? `cf-${k}-err` : undefined,
  });
  const err = (k) => errors[k] && <span className="err" id={`cf-${k}-err`}>{errors[k]}</span>;

  const details = (
    <dl className="contact-list">
      <div><dt>Indirizzo</dt><dd>{site.address}, {site.city}</dd></div>
      <div><dt>Email</dt><dd><a className="lnk" href={`mailto:${site.email}`}>{site.email}</a></dd></div>
      {site.phone && <div><dt>Telefono</dt><dd><a className="lnk" href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></dd></div>}
      <div><dt>Zona</dt><dd>{site.area}</dd></div>
      {site.mapsUrl && <div><dt>Mappa</dt><dd><a className="lnk" href={site.mapsUrl} target="_blank" rel="noopener">Apri in Google Maps</a></dd></div>}
      {site.replyTime && <div><dt>Risposta</dt><dd>{site.replyTime}</dd></div>}
    </dl>
  );

  return (
    <Section id={id} title={title} intro={intro} rail={details} first={first} headingLevel={headingLevel}>
      <form className="form" onSubmit={submit} noValidate>
        {state.status === "ok" ? (
          <p className="notice notice--ok" role="status">{state.msg}</p>
        ) : (
          <>
            <div className="fields-2">
              <div className="field"><label htmlFor="cf-name">Nome e cognome</label><input {...fieldProps("name")} autoComplete="name" />{err("name")}</div>
              <div className="field"><label htmlFor="cf-email">Email</label><input {...fieldProps("email")} type="email" inputMode="email" autoComplete="email" />{err("email")}</div>
            </div>
            <div className="fields-2">
              <div className="field"><label htmlFor="cf-phone">Telefono <span className="opt">(facoltativo)</span></label><input {...fieldProps("phone")} type="tel" inputMode="tel" autoComplete="tel" />{err("phone")}</div>
              <div className="field">
                <label htmlFor="cf-kind">Siete</label>
                <select {...fieldProps("kind")}>{KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}</select>
              </div>
            </div>
            <div className="field"><label htmlFor="cf-message">Messaggio</label><textarea {...fieldProps("message")} rows={5} />{err("message")}</div>
            <div className="hp" aria-hidden="true">
              <label htmlFor="cf-website">Lascia vuoto</label>
              <input id="cf-website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} />
            </div>
            <div className="field">
              <label className="check" htmlFor="cf-privacy">
                <input id="cf-privacy" type="checkbox" checked={v.privacy} onChange={set("privacy")} aria-invalid={errors.privacy ? "true" : undefined} />
                <span>Ho letto l'<Link to="/privacy">informativa privacy</Link> e acconsento a essere ricontattato.</span>
              </label>
              {err("privacy")}
            </div>
            {state.status === "err" && <p className="notice notice--err" role="alert">{state.msg}</p>}
            <div><button className="btn" type="submit" disabled={state.status === "busy"}>{state.status === "busy" ? "Invio in corso" : "Invia messaggio"}</button></div>
          </>
        )}
      </form>
    </Section>
  );
}
