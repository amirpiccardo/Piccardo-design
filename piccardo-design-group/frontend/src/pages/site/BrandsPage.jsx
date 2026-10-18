import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/site/Header";
import { IndexSection, ClosingBand, brandItems } from "../../components/site/Sections";
import { useContent, usePage } from "../../context/ContentContext";
import { Seo, breadcrumbJsonLd, SITE_URL } from "../../lib/seo";

export default function BrandsPage() {
  const { brands } = useContent();
  const f = usePage("brands").fields;
  const [cat, setCat] = useState("");
  const cats = [...new Set(brands.map((b) => b.category).filter(Boolean))];
  const shown = cat ? brands.filter((b) => b.category === cat) : brands;

  return (
    <>
      <Seo
        title={f.seoTitle}
        description={f.seoDescription}
        path="/marchi"
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Marchi", path: "/marchi" }]),
          { "@context": "https://schema.org", "@type": "ItemList", itemListElement: brands.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.name, url: `${SITE_URL}/marchi/${b.slug}` })) },
        ]}
      />
      <Header title={f.title} intro={f.intro} />
      <main id="contenuto">
        <IndexSection
          key={cat}
          first
          id="elenco"
          title={`${shown.length} ${shown.length === 1 ? "marchio" : "marchi"}`}
          intro="Aprite un marchio per vedere foto, categorie e come richiedere cataloghi e listini."
          items={brandItems(shown)}
          before={cats.length > 1 && (
            <div className="filters" role="group" aria-label="Filtra per categoria">
              <button type="button" aria-pressed={!cat} onClick={() => setCat("")}>Tutti</button>
              {cats.map((c) => <button type="button" key={c} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
            </div>
          )}
        />
      </main>
      <ClosingBand title="Siete un rivenditore?" text="Chiedete cataloghi, listini o una visita in negozio per i marchi che vi interessano.">
        <Link className="btn btn--gold" to="/rivenditori">Servizi per rivenditori</Link>
      </ClosingBand>
    </>
  );
}
