import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/site/Header";
import { Seo } from "../../lib/seo";

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Pagina non trovata" description="La pagina cercata non esiste o è stata spostata." path="/404" noindex />
      <Header />
      <main id="contenuto" className="wrap notfound">
        <h1>Questa pagina non c'è</h1>
        <p className="muted">Forse è stata spostata. Da qui potete ripartire.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 24px", alignItems: "center" }}>
          <Link className="btn" to="/">Torna alla home</Link>
          <Link className="lnk" to="/marchi">Vedi i marchi</Link>
          <Link className="lnk" to="/contatti">Scriveteci</Link>
        </div>
      </main>
    </>
  );
}
