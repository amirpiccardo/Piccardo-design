import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/site/Header";
import { IndexSection, ClosingBand } from "../../components/site/Sections";
import { useContent, usePage, useSite } from "../../context/ContentContext";
import { Seo, orgJsonLd, SITE_URL } from "../../lib/seo";
import { imgUrl } from "../../lib/media";

// La home è un biglietto da visita: foto con titolo e una frase, l'indice delle
// pagine del sito e il contatto. Il resto vive nelle pagine dedicate.
export default function HomePage() {
  const { brands, team, contractTypes } = useContent();
  const f = usePage("home").fields;
  const about = usePage("about").fields;
  const site = useSite();
  const firstBrandPhoto = brands.map((b) => (b.photos || []).find((p) => imgUrl(p))).find(Boolean);
  const n = (count, one, many) => `${count} ${count === 1 ? one : many}`;

  const items = [
    { key: "marchi", title: "Marchi", meta: n(brands.length, "marchio", "marchi"), text: f.dirBrandsText, to: "/marchi", photo: firstBrandPhoto },
    { key: "contract", title: "Contract", meta: n(contractTypes.length, "tipo di progetto", "tipi di progetto"), text: f.dirContractText, to: "/contract", photo: contractTypes[0]?.photo },
    { key: "chi-siamo", title: "Chi siamo", meta: n(team.length, "persona", "persone"), text: f.dirAboutText, to: "/chi-siamo", photo: f.dirAboutPhoto || about.headerPhoto },
    { key: "rivenditori", title: "Per rivenditori", meta: "servizi", text: f.dirDealersText, to: "/rivenditori", photo: f.dirDealersPhoto },
    { key: "contatti", title: "Contatti", meta: site.city?.replace(/^\d+\s*/, ""), text: f.dirContactText, to: "/contatti", photo: f.dirContactPhoto },
  ];

  return (
    <>
      <Seo
        title={f.seoTitle}
        description={f.seoDescription}
        path="/"
        image={f.topPhoto}
        jsonLd={[
          orgJsonLd(site, brands, team),
          { "@context": "https://schema.org", "@type": "WebSite", name: site.companyName, url: SITE_URL, inLanguage: "it-IT" },
        ]}
      />
      <Header
        variant="home"
        photo={f.topPhoto}
        title={f.heroTitle}
        intro={f.heroText}
        actions={<><Link className="btn btn--gold" to="/contatti">Contattaci</Link><Link className="lnk lnk--light" to="/marchi">Vedi i marchi</Link></>}
      />
      <main id="contenuto">
        {brands.length > 0 && (
          <nav className="logo-strip" aria-label="Marchi rappresentati">
            <ul className="wrap">
              {brands.filter((b) => b.logo).map((b) => (
                <li key={b.slug}>
                  <Link to={`/marchi/${b.slug}`} title={b.name}>
                    <img src={b.logo} alt={b.name} width="140" height="56" loading="lazy" decoding="async" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <IndexSection first id="indice" title={f.dirTitle} intro={f.dirIntro} items={items} />
      </main>
      <ClosingBand title={f.closingTitle} text={f.closingText}>
        <Link className="btn btn--gold" to="/contatti">Scriveteci</Link>
        <a className="lnk lnk--light" href={`mailto:${site.email}`}>{site.email}</a>
        {site.phone && <a className="lnk lnk--light" href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>}
      </ClosingBand>
    </>
  );
}
