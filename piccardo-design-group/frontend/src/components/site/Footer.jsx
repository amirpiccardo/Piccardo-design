import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../../context/ContentContext";
import { db as supabase } from "../../lib/supabase";
import { openCookiePreferences } from "./CookieBanner";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState({ status: "idle", msg: "" });

  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState({ status: "err", msg: "Controlla l'indirizzo email." });
      return;
    }
    if (!supabase) {
      setState({ status: "err", msg: "Iscrizione non disponibile al momento. Scriveteci a info@liguriadesigngroup.it." });
      return;
    }
    setState({ status: "busy", msg: "" });
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.trim().toLowerCase() });
    if (error && error.code !== "23505") {
      setState({ status: "err", msg: "Iscrizione non riuscita. Riprova tra poco." });
      return;
    }
    setEmail("");
    setState({ status: "ok", msg: error ? "Eri già iscritto: a presto." : "Iscrizione fatta. Ti scriviamo solo quando c'è una novità." });
  };

  return (
    <div className="foot__news">
      <label htmlFor="news-email" className="foot__col"><b>Novità dai marchi</b></label>
      <form onSubmit={submit} noValidate>
        <input id="news-email" type="email" autoComplete="email" inputMode="email" placeholder="La tua email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn btn--gold" type="submit" disabled={state.status === "busy"}>Iscriviti</button>
      </form>
      <p className="msg" aria-live="polite">{state.msg}</p>
    </div>
  );
}

export default function Footer() {
  const site = useSite();
  const year = new Date().getFullYear();
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__top">
          <div className="foot__brand">
            <img src="/img/logo-white.webp" alt="Liguria Design Group" width="640" height="270" loading="lazy" />
            <p>{site.tagline}. {site.area}.</p>
          </div>
          <div className="foot__col">
            <b>Sito</b>
            <Link to="/marchi">Marchi</Link>
            <Link to="/contract">Contract</Link>
            <Link to="/chi-siamo">Chi siamo</Link>
            <Link to="/faq">Domande frequenti</Link>
          </div>
          <div className="foot__col">
            <b>Rivenditori</b>
            <Link to="/rivenditori">Servizi</Link>
            <Link to="/contatti?tipo=rivenditore&richiesta=Cataloghi">Cataloghi</Link>
            <Link to="/contatti?tipo=rivenditore&richiesta=Listini">Listini</Link>
            <Link to="/contatti?tipo=rivenditore&richiesta=Visita%20in%20negozio">Visite</Link>
          </div>
          <div className="foot__col">
            <b>Contatti</b>
            <span>{site.address}</span>
            <span>{site.city}</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            {site.phone && <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>}
            {site.instagram && <a href={site.instagram} target="_blank" rel="noopener">Instagram</a>}
            {site.facebook && <a href={site.facebook} target="_blank" rel="noopener">Facebook</a>}
            {site.linkedin && <a href={site.linkedin} target="_blank" rel="noopener">LinkedIn</a>}
          </div>
          <Newsletter />
        </div>
        <div className="foot__bottom">
          <span>{year} {site.companyName}. P. IVA {site.vat}</span>
          <nav aria-label="Note legali">
            <Link to="/privacy">Privacy</Link>
            <Link to="/cookie-policy">Cookie</Link>
            <Link to="/termini">Termini</Link>
            <button type="button" onClick={openCookiePreferences}>Preferenze cookie</button>
            <Link to="/login" rel="nofollow">Area riservata</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
