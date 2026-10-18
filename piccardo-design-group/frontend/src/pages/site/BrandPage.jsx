import React from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/site/Header";
import NotFoundPage from "./NotFoundPage";
import { Section, ClosingBand } from "../../components/site/Sections";
import { useContent, useSite } from "../../context/ContentContext";
import { Seo, breadcrumbJsonLd, SITE_URL } from "../../lib/seo";
import { imgProps, imgUrl } from "../../lib/media";

export default function BrandPage() {
  const { slug } = useParams();
  const { brands } = useContent();
  const site = useSite();
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) return <NotFoundPage />;

  const photos = (brand.photos || []).filter((p) => imgUrl(p));
  const [first, ...rest] = photos;
  const others = brands.filter((b) => b.slug !== brand.slug);
  const description = brand.description || `${brand.name}: marchio rappresentato da ${site.companyName} per i rivenditori di ${site.area}.`;
  const askHref = `/contatti?tipo=rivenditore&richiesta=Listino&marchio=${encodeURIComponent(brand.name)}`;

  const rail = (
    <>
      {brand.logo && <div className="brand-logo"><img src={brand.logo} alt={`Logo ${brand.name}`} width="180" height="64" /></div>}
      <p style={{ color: "var(--slate)", maxWidth: "42ch" }}>{description}</p>
      <ul className="facts" style={{ marginTop: 4 }}>
        {brand.category && <li><span>Prodotti</span><span>{brand.category}</span></li>}
        <li><span>Zona</span><span>{site.area}</span></li>
        <li><span>Cataloghi e listini</span><span>su richiesta</span></li>
        <li><span>Preventivi</span><span>con 3CAD e Metron</span></li>
      </ul>
      <div className="brand-actions">
        <Link className="btn" to={askHref}>Chiedi il listino</Link>
        {brand.website && <a className="lnk" href={brand.website} target="_blank" rel="noopener">Sito ufficiale</a>}
      </div>
    </>
  );

  return (
    <>
      <Seo
        title={`${brand.name}: agente per ${site.area}`}
        description={`${description} Cataloghi, listini e preventivi tramite Liguria Design Group, Imperia.`.slice(0, 300)}
        path={`/marchi/${brand.slug}`}
        image={first || brand.logo}
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Marchi", path: "/marchi" }, { name: brand.name, path: `/marchi/${brand.slug}` }]),
          { "@context": "https://schema.org", "@type": "Brand", name: brand.name, description, logo: brand.logo ? (brand.logo.startsWith("http") ? brand.logo : `${SITE_URL}${brand.logo}`) : undefined, url: brand.website || undefined },
        ]}
      />
      <Header title={brand.name} crumbs={[{ to: "/marchi", label: "Marchi" }, { label: brand.name }]} />
      <main id="contenuto">
        <Section first id="marchio" rail={rail}>
          {first ? (
            <div className="gallery">
              <img className="photo-43" {...imgProps(first, { sizes: "(min-width: 900px) 62vw, 100vw" })} alt={first.alt || `${brand.name}, ambiente`} width="1600" height="1200" fetchpriority="high" />
              {rest.length > 0 && (
                <div className={rest.length > 1 ? "pair" : ""}>
                  {rest.slice(0, 4).map((p, i) => (
                    <img key={imgUrl(p) + i} className="photo-43" {...imgProps(p, { sizes: "(min-width: 900px) 31vw, 50vw" })} alt={p.alt || `${brand.name}, dettaglio`} width="800" height="600" loading="lazy" decoding="async" />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="brand-empty">{brand.logo && <img src={brand.logo} alt="" width="320" height="140" />}</div>
          )}
        </Section>

        {others.length > 0 && (
          <Section id="altri" title="Altri marchi" link={<Link className="lnk" to="/marchi">Vedi tutti</Link>}>
            <div className="logos">
              {others.map((b) => (
                <Link key={b.slug} to={`/marchi/${b.slug}`}>
                  <span>{b.logo && <img src={b.logo} alt="" width="160" height="50" loading="lazy" decoding="async" />}</span>
                  <span>{b.name}</span>
                </Link>
              ))}
            </div>
          </Section>
        )}
      </main>
      <ClosingBand title={`Vendete ${brand.name}?`} text="Chiedete listino, cataloghi o una visita in negozio: vi rispondiamo entro un giorno lavorativo.">
        <Link className="btn btn--gold" to={askHref}>Chiedi il listino</Link>
      </ClosingBand>
    </>
  );
}
