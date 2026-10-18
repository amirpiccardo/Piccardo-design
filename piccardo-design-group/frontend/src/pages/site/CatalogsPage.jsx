import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/site/Header";
import { Section, ClosingBand } from "../../components/site/Sections";
import { Seo } from "../../lib/seo";
import { db } from "../../lib/supabase";

const size = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1).replace(".", ",")} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const day = (d) => (d ? new Date(d).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }) : "");

// Pagina nascosta per i rivenditori: raggiungibile solo con il link che contiene la chiave.
// Non è nel menu, nella sitemap né su Google (noindex anche nell'intestazione HTTP).
export default function CatalogsPage() {
  const { key } = useParams();
  const [brands, setBrands] = useState(null);
  const [error, setError] = useState("");
  const [cat, setCat] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!db) return setError("Servizio non disponibile.");
    db.rpc("catalogs_by_key", { k: key }).then(({ data, error: e }) => {
      if (e) setError("Non riusciamo a caricare i cataloghi. Riprovate tra poco.");
      else if (data === null) setError("Questo link non è valido o è stato sostituito. Chiedete il link aggiornato a Liguria Design Group.");
      else setBrands(data);
    });
  }, [key]);

  const cats = brands ? [...new Set(brands.map((b) => b.category).filter(Boolean))] : [];
  const term = q.trim().toLowerCase();
  const shown = (brands || [])
    .filter((b) => !cat || b.category === cat)
    .map((b) => ({ ...b, catalogs: term && !b.name.toLowerCase().includes(term) ? b.catalogs.filter((c) => c.title.toLowerCase().includes(term)) : b.catalogs }))
    .filter((b) => b.catalogs.length);
  const total = shown.reduce((n, b) => n + b.catalogs.length, 0);

  return (
    <>
      <Seo title="Cataloghi per i rivenditori" description="Area riservata ai rivenditori." path="/cataloghi" noindex />
      <Header title="Cataloghi per i rivenditori" intro="I cataloghi in PDF dei marchi che rappresentiamo, sempre aggiornati. Pagina riservata: non condividete il link." />
      <main id="contenuto">
        <Section
          first
          id="cataloghi"
          title={brands ? `${total} ${total === 1 ? "catalogo" : "cataloghi"}` : "Cataloghi"}
          intro="Cercate per marchio o per nome del catalogo. Il PDF si apre in una nuova scheda e si può salvare."
          rail={brands && (
            <div className="catalogs__tools">
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca un marchio o un catalogo" aria-label="Cerca un marchio o un catalogo" />
              {cats.length > 1 && (
                <div className="filters" role="group" aria-label="Filtra per categoria">
                  <button type="button" aria-pressed={!cat} onClick={() => setCat("")}>Tutti</button>
                  {cats.map((c) => <button type="button" key={c} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
                </div>
              )}
            </div>
          )}
        >
          {error ? <p className="catalogs__msg">{error}</p>
            : !brands ? <p className="catalogs__msg">Caricamento dei cataloghi</p>
            : shown.length === 0 ? <p className="catalogs__msg">{brands.length ? "Nessun catalogo corrisponde alla ricerca." : "I cataloghi arriveranno presto."}</p>
            : shown.map((b) => (
              <div className="catalogs__brand" key={b.slug}>
                <div className="catalogs__head">
                  {b.logo && <span className="row__thumb"><img src={b.logo} alt="" width="46" height="30" loading="lazy" /></span>}
                  <h2>{b.name}</h2>
                  {b.category && <span className="row__meta">{b.category}</span>}
                </div>
                <ul className="rows rows--hover">
                  {b.catalogs.map((c) => (
                    <li key={c.file}>
                      <a className="row" href={c.file} target="_blank" rel="noopener">
                        <span className="row__title">{c.title}</span>
                        <span className="row__meta">PDF · {size(c.size)}</span>
                        {c.updated && <span className="row__text">Aggiornato il {day(c.updated)}</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </Section>
      </main>
      <ClosingBand title="Vi serve un listino o un campione?" text="Scriveteci: rispondiamo con i materiali e le condizioni per il vostro negozio.">
        <Link className="btn btn--gold" to="/contatti?tipo=rivenditore">Contattaci</Link>
      </ClosingBand>
    </>
  );
}
