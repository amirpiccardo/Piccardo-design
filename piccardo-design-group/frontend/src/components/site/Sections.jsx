import React, { useState } from "react";
import { Link } from "react-router-dom";
import { imgProps, imgUrl } from "../../lib/media";
import { lines } from "../../lib/content";

// ─── La struttura di ogni sezione: colonna (titolo, intro, extra) + contenuto ─
export function Section({ id, title, intro, link, rail, children, first = false, headingLevel = 2 }) {
  const H = `h${headingLevel}`;
  return (
    <section className={`sec${first ? " sec--first" : ""}`} id={id} aria-labelledby={id ? `${id}-t` : undefined}>
      <div className="wrap sec__grid">
        <div className="sec__rail">
          {title && <H id={id ? `${id}-t` : undefined}>{title}</H>}
          {intro && <p>{intro}</p>}
          {link}
          {rail}
        </div>
        <div className="sec__body">{children}</div>
      </div>
    </section>
  );
}

// ─── Elenco a righe con anteprima nella colonna (marchi, contract, indice home) ─
// item: { key, title, meta, text, to, href, photo, logo }
function Preview({ items, active }) {
  return (
    <div className="sec__preview" aria-hidden="true">
      {items.map((it, i) => (
        <div key={it.key} className={`pane${i === active ? " is-on" : ""}`}>
          {imgUrl(it.photo) ? (
            <>
              <img className="photo" {...imgProps(it.photo, { sizes: "34vw" })} alt="" width="1600" height="1200" loading="lazy" decoding="async" />
              {it.logo && <span className="chip"><img src={it.logo} alt="" width="120" height="32" loading="lazy" /></span>}
            </>
          ) : it.logo ? (
            <img className="solo" src={it.logo} alt="" width="320" height="120" loading="lazy" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function IndexSection({ id, title, intro, link, items, first, before, headingLevel, thumbs = true }) {
  const [active, setActive] = useState(0);
  const hasPreview = items.some((it) => imgUrl(it.photo) || it.logo);
  return (
    <Section id={id} title={title} intro={intro} link={link} first={first} headingLevel={headingLevel} rail={hasPreview && <Preview items={items} active={active} />}>
      {before}
      <ul className="rows rows--hover">
        {items.map((it, i) => {
          const thumb = thumbs && (it.logo || imgUrl(it.photo));
          const inner = (
            <>
              {thumb && (
                <span className="row__thumb" aria-hidden="true">
                  {it.logo ? <img src={it.logo} alt="" width="46" height="30" loading="lazy" decoding="async" /> : <img className="cover" src={imgUrl(it.photo)} alt="" width="56" height="42" loading="lazy" decoding="async" />}
                </span>
              )}
              <span className="row__title">{it.title}</span>
              {it.meta && <span className="row__meta">{it.meta}</span>}
              {it.text && <span className="row__text">{it.text}</span>}
            </>
          );
          const cls = `row${thumb ? " row--thumb" : ""}${i === active ? " is-active" : ""}`;
          const on = { onMouseEnter: () => setActive(i), onFocus: () => setActive(i) };
          return (
            <li key={it.key}>
              {it.to ? <Link className={cls} to={it.to} {...on}>{inner}</Link>
                : it.href ? <a className={cls} href={it.href} target="_blank" rel="noopener" {...on}>{inner}</a>
                  : <div className={cls} tabIndex={0} {...on}>{inner}</div>}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

// Elementi pronti per IndexSection
export const brandItems = (brands) => brands.map((b) => ({
  key: b.slug, title: b.name, meta: b.category, to: `/marchi/${b.slug}`,
  photo: (b.photos || []).find((p) => imgUrl(p)), logo: b.logo,
}));
export const contractItems = (types) => types.map((t) => ({
  key: t.id || t.title, title: t.title, text: t.text, photo: t.photo,
}));

// Il metodo: quattro passi in una frase
export function MethodLead({ f }) {
  const steps = [1, 2, 3, 4].map((n) => [f[`step${n}Title`], f[`step${n}Text`]]).filter(([t]) => t);
  return (
    <p className="lead" style={{ maxWidth: "34ch" }}>
      {steps.map(([t, txt], i) => (
        <React.Fragment key={t}>
          <span><sup>{i + 1}</sup>{t}</span>{" "}
          {i === steps.length - 1 ? <em>{txt}</em> : txt}{" "}
        </React.Fragment>
      ))}
    </p>
  );
}

// ─── Persone ─────────────────────────────────────────────────────────────────
export function People({ team }) {
  return (
    <div className="people">
      {team.map((p) => (
        <article className="person" key={p.id || p.name}>
          <div className="person__photo">
            {imgUrl(p.photo) && <img {...imgProps(p.photo, { sizes: "(min-width: 900px) 30vw, (min-width: 640px) 50vw, 100vw" })} alt={`Ritratto di ${p.name}`} width="800" height="1000" loading="lazy" decoding="async" />}
          </div>
          <h3>{p.name}</h3>
          <span className="person__role">{p.role}</span>
          {p.bio && <p>{p.bio}</p>}
          {p.linkedin && <a className="lnk" href={p.linkedin} target="_blank" rel="noopener">Profilo LinkedIn</a>}
        </article>
      ))}
    </div>
  );
}

// ─── Mappa della zona servita ────────────────────────────────────────────────
function CoastMap({ liguria, piemonte, w, h, font, wide }) {
  const coast = wide
    ? `M20 ${h - 30} C ${w * 0.17} ${h - 60}, ${w * 0.27} ${h - 110}, ${w * 0.39} ${h - 122} S ${w * 0.6} ${h - 155}, ${w * 0.7} ${h - 140} S ${w * 0.88} ${h - 90}, ${w - 20} ${h - 60}`
    : `M14 ${h - 24} C ${w * 0.22} ${h - 50}, ${w * 0.32} ${h - 96}, ${w * 0.46} ${h - 108} S ${w * 0.7} ${h - 140}, ${w * 0.8} ${h - 120} S ${w * 0.94} ${h - 80}, ${w - 10} ${h - 54}`;
  const along = (n, i) => (n === 1 ? 0.5 : i / (n - 1));
  const lig = liguria.map((name, i) => {
    const t = along(liguria.length, i);
    return { name, x: 40 + t * (w - 90), y: h - 40 - Math.sin(t * Math.PI) * (wide ? 110 : 90) - t * 10 };
  });
  const pie = piemonte.map((name, i) => {
    const t = along(piemonte.length, i);
    return { name, x: (wide ? 140 : 70) + t * (w * (wide ? 0.48 : 0.6)), y: (wide ? 92 : 80) - Math.sin(t * Math.PI) * 26 };
  });
  const sans = "Hanken Grotesk Variable, Arial, sans-serif";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={wide ? "map-wide" : "map-tall"} role="img" aria-label={`Zone servite: ${[...liguria, ...piemonte].join(", ")}`}>
      <rect width={w} height={h} fill="#f8f9f9" />
      <path d={coast} fill="none" stroke="#1b2a4a" strokeWidth="2" />
      <text x={w - 16} y={h - 10} textAnchor="end" fontSize={font - 2} fill="#59616a" fontFamily={sans}>Mar Ligure</text>
      {lig[0] && pie[0] && <line x1={lig[0].x} y1={lig[0].y - 10} x2={pie[0].x} y2={pie[0].y + 8} stroke="#a8834a" strokeDasharray="4 5" />}
      <g fontFamily={sans} fontSize={font} fill="#16213a">
        {lig.map((c, i) => (
          <g key={c.name}>
            <circle cx={c.x} cy={c.y} r={i === 0 ? 9 : 6} fill={i === 0 ? "#a8834a" : "#16213a"} />
            <text x={c.x} y={c.y + (i % 2 ? 26 : -16)} textAnchor="middle" fontWeight={i === 0 ? 600 : 400}>{c.name}</text>
          </g>
        ))}
        {pie.map((c) => (
          <g key={c.name}>
            <circle cx={c.x} cy={c.y} r="6" fill="none" stroke="#16213a" strokeWidth="2" />
            <text x={c.x} y={c.y - 14} textAnchor="middle">{c.name}</text>
          </g>
        ))}
      </g>
      <g fontFamily={sans} fontSize={font - 2} fill="#59616a">
        <circle cx="22" cy="22" r="6" fill="#16213a" /><text x="34" y="27">Liguria</text>
        <circle cx={wide ? 112 : 104} cy="22" r="6" fill="none" stroke="#16213a" strokeWidth="2" /><text x={wide ? 124 : 116} y="27">Basso Piemonte</text>
      </g>
    </svg>
  );
}

export function TerritoryMap({ f }) {
  const liguria = lines(f.territoryLiguria);
  const piemonte = lines(f.territoryPiemonte);
  return (
    <div className="map">
      <CoastMap liguria={liguria} piemonte={piemonte} w={640} h={360} font={14} wide />
      <CoastMap liguria={liguria} piemonte={piemonte} w={360} h={300} font={13} />
    </div>
  );
}

// ─── Chiusura di ogni pagina: una sola fascia navy ───────────────────────────
export function ClosingBand({ title, text, children }) {
  return (
    <section className="cta-band">
      <div className="wrap">
        <div><h2>{title}</h2>{text && <p>{text}</p>}</div>
        <div className="links">{children}</div>
      </div>
    </section>
  );
}

export function ServiceRows({ rows }) {
  return (
    <ul className="rows">
      {rows.map((r) => (
        <li key={r.title}>
          <div className="row">
            <span className="row__title">{r.title}</span>
            <Link className="lnk row__meta" to={`/contatti?tipo=rivenditore&richiesta=${encodeURIComponent(r.title)}`}>{r.cta || "Richiedi"}</Link>
            <span className="row__text">{r.text}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
