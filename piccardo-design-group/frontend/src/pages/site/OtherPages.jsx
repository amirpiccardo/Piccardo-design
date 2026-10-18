import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/site/Header";
import ContactBlock from "../../components/site/ContactBlock";
import Assistant from "../../components/site/Assistant";
import {
  Section, IndexSection, ClosingBand, MethodLead, People, TerritoryMap, ServiceRows, brandItems, contractItems,
} from "../../components/site/Sections";
import { useContent, usePage, useSite } from "../../context/ContentContext";
import { Seo, breadcrumbJsonLd, orgJsonLd } from "../../lib/seo";
import { imgProps, imgUrl } from "../../lib/media";

const crumbs = (name, path) => breadcrumbJsonLd([{ name: "Home", path: "/" }, { name, path }]);

function ContactClosing({ title = "Parliamone", text }) {
  const site = useSite();
  return (
    <ClosingBand title={title} text={text}>
      <Link className="btn btn--gold" to="/contatti">Scriveteci</Link>
      <a className="lnk lnk--light" href={`mailto:${site.email}`}>{site.email}</a>
    </ClosingBand>
  );
}

export function ContractPage() {
  const { contractTypes, contractBrands } = useContent();
  const f = usePage("contract").fields;
  return (
    <>
      <Seo title={f.seoTitle} description={f.seoDescription} path="/contract" image={f.headerPhoto} jsonLd={[crumbs("Contract", "/contract")]} />
      <Header photo={f.headerPhoto} title={f.title} intro={f.intro} />
      <main id="contenuto">
        <IndexSection first id="tipi" title={f.typesTitle} intro={f.typesIntro} items={contractItems(contractTypes)} />
        {contractBrands.length > 0 && (
          <Section id="marchi-contract" title={f.brandsTitle}>
            <div className="logos">
              {contractBrands.map((b) => {
                const inner = (
                  <>
                    <span>{b.logo && <img src={b.logo} alt="" width="160" height="50" loading="lazy" decoding="async" />}</span>
                    <span>{b.name}{b.category ? `, ${b.category}` : ""}</span>
                  </>
                );
                return b.website
                  ? <a key={b.id || b.name} href={b.website} target="_blank" rel="noopener">{inner}</a>
                  : <div key={b.id || b.name} className="logos__item">{inner}</div>;
              })}
            </div>
          </Section>
        )}
      </main>
      <ClosingBand title="Raccontateci il progetto" text="Tipo di struttura, numero di ambienti, tempi: vi rispondiamo con una prima proposta.">
        <Link className="btn btn--gold" to="/contatti?tipo=contract">Scriveteci</Link>
      </ClosingBand>
    </>
  );
}

export function AboutPage() {
  const { team, brands } = useContent();
  const { fields: f, sections } = usePage("about");
  const site = useSite();
  return (
    <>
      <Seo title={f.seoTitle} description={f.seoDescription} path="/chi-siamo" image={f.headerPhoto} jsonLd={[crumbs("Chi siamo", "/chi-siamo"), orgJsonLd(site, brands, team)]} />
      <Header photo={f.headerPhoto} title={f.title} />
      <main id="contenuto">
        <Section
          first
          id="cosa-facciamo"
          title={f.introTitle}
          intro={f.intro1}
          rail={imgUrl(f.aboutPhoto) && <img className="rail-photo" {...imgProps(f.aboutPhoto, { sizes: "(min-width: 900px) 34vw, 100vw" })} width="1600" height="1200" loading="lazy" decoding="async" />}
        >
          <ul className="rows">
            {sections.map((r, i) => (
              <li key={r.title + i}>
                <div className="row">
                  <span className="row__title">{r.title}</span>
                  {r.meta && <span className="row__meta">{r.meta}</span>}
                  <span className="row__text">{r.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </Section>
        {team.length > 0 && (
          <Section id="persone" title={f.teamTitle} intro={f.teamSubtitle}>
            <People team={team} />
          </Section>
        )}
        <Section id="zona" title={f.territoryTitle} intro={f.territoryText} link={<Link className="lnk" to="/contatti">Siete in zona? Scriveteci</Link>}>
          <TerritoryMap f={f} />
        </Section>
      </main>
      <ContactClosing />
    </>
  );
}

export function DealersPage() {
  const page = usePage("dealers");
  const f = page.fields;
  const { brands } = useContent();
  return (
    <>
      <Seo title={f.seoTitle} description={f.seoDescription} path="/rivenditori" jsonLd={[crumbs("Per rivenditori", "/rivenditori")]} />
      <Header title={f.title} intro={f.intro} />
      <main id="contenuto">
        <Section first id="servizi" title={f.servicesTitle}>
          <ServiceRows rows={page.sections} />
        </Section>
        <Section id="metodo" title={f.methodTitle}>
          <MethodLead f={f} />
        </Section>
        <IndexSection id="marchi" title={f.brandsTitle} items={brandItems(brands)} link={<Link className="lnk" to="/marchi">Tutti i marchi</Link>} />
      </main>
      <ClosingBand title="Chiedete una visita" text="Indicate il vostro negozio e i marchi che vi interessano: passiamo noi con campioni e cataloghi.">
        <Link className="btn btn--gold" to="/contatti?tipo=rivenditore&richiesta=Visita%20in%20negozio">Prenota una visita</Link>
      </ClosingBand>
    </>
  );
}

export function ContactPage() {
  const f = usePage("contact").fields;
  return (
    <>
      <Seo title={f.seoTitle} description={f.seoDescription} path="/contatti" jsonLd={[crumbs("Contatti", "/contatti")]} />
      <Header title={f.title} intro={f.intro} />
      <main id="contenuto">
        <ContactBlock first title="Il vostro messaggio" />
      </main>
      <ClosingBand title="Domande frequenti" text="Zone servite, contract, cataloghi e listini: le risposte più rapide.">
        <Link className="btn btn--gold" to="/faq">Leggi le risposte</Link>
      </ClosingBand>
      <Assistant />
    </>
  );
}

export function FaqPage() {
  const { sections } = usePage("faq");
  return (
    <>
      <Seo
        title="Domande frequenti"
        description="Risposte su zone servite, forniture contract, cataloghi, listini e collaborazione con Liguria Design Group."
        path="/faq"
        jsonLd={[
          crumbs("Domande frequenti", "/faq"),
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: sections.map((s) => ({ "@type": "Question", name: s.title, acceptedAnswer: { "@type": "Answer", text: s.text } })) },
        ]}
      />
      <Header title="Domande frequenti" />
      <main id="contenuto">
        <Section first id="risposte" title={`${sections.length} risposte`} intro="Toccate una domanda per aprire la risposta.">
          <ul className="rows">
            {sections.map((s, i) => (
              <li key={s.title + i}>
                <details open={i === 0}>
                  <summary><span className="row__title">{s.title}</span></summary>
                  <p>{s.text}</p>
                </details>
              </li>
            ))}
          </ul>
        </Section>
      </main>
      <ContactClosing title="Non trovate la risposta?" text="Scriveteci: vi risponde direttamente Gabriele o Francesca." />
    </>
  );
}

const LEGAL = {
  privacy: { title: "Privacy policy", path: "/privacy", description: "Come Liguria Design Group tratta i dati personali raccolti dal sito." },
  cookie: { title: "Cookie policy", path: "/cookie-policy", description: "Quali strumenti tecnici e statistici usa il sito di Liguria Design Group." },
  terms: { title: "Termini e condizioni", path: "/termini", description: "Condizioni d'uso del sito di Liguria Design Group." },
};

export function LegalPage({ pageKey }) {
  const meta = LEGAL[pageKey];
  const { sections } = usePage(pageKey);
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={meta.path} />
      <Header title={meta.title} />
      <main id="contenuto">
        <Section first id="testo" title="In sintesi" intro={meta.description}>
          <ul className="rows">
            {sections.map((s, i) => (
              <li key={s.title + i}>
                <div className="row">
                  <h2 className="row__title">{s.title}</h2>
                  <p className="row__text">{s.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </main>
      <ContactClosing title="Domande sui vostri dati?" text="Scriveteci e vi rispondiamo entro un giorno lavorativo." />
    </>
  );
}
