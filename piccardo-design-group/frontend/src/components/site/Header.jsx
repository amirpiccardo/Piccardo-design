import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { imgProps } from "../../lib/media";
import { useSite } from "../../context/ContentContext";

const LEFT = [
  { to: "/marchi", label: "Marchi" },
  { to: "/contract", label: "Contract" },
  { to: "/chi-siamo", label: "Chi siamo" },
];
const RIGHT = [
  { to: "/rivenditori", label: "Per rivenditori" },
  { to: "/contatti", label: "Contatti" },
];
const ALL = [{ to: "/", label: "Home" }, ...LEFT, ...RIGHT, { to: "/faq", label: "Domande frequenti" }];

function NavRow({ onMenu, menuOpen }) {
  return (
    <div className="nav wrap">
      <div className="nav__side">
        {LEFT.map((l) => (
          <NavLink key={l.to} to={l.to} className="nav__desk">{l.label}</NavLink>
        ))}
      </div>
      <Link to="/" className="nav__logo" aria-label="Liguria Design Group, torna alla home">
        <img src="/img/logo-white.webp" alt="" width="640" height="270" />
      </Link>
      <div className="nav__side nav__side--right">
        {RIGHT.map((l) => (
          <NavLink key={l.to} to={l.to} className="nav__desk">{l.label}</NavLink>
        ))}
        <button type="button" className="nav__menu" onClick={onMenu} aria-expanded={menuOpen} aria-controls="menu">
          <i aria-hidden="true" /> Menu
        </button>
      </div>
    </div>
  );
}

// Testata della pagina: barra trasparente sopra una foto (o una fascia navy) con il logo al centro.
export default function Header({ variant = "page", photo, title, intro, crumbs, actions, priority = true }) {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const topRef = useRef(null);
  const closeRef = useRef(null);
  const { pathname } = useLocation();
  const site = useSite();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const el = topRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { rootMargin: "-80px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open]);

  const cls = ["top", variant === "home" ? "top--page top--home" : "top--page", !photo && "top--plain", !title && variant !== "home" && "top--short"].filter(Boolean).join(" ");

  return (
    <>
      <a className="skip" href="#contenuto">Vai al contenuto</a>
      <header className={cls} ref={topRef}>
        {photo && (
          <img
            className="top__photo"
            {...imgProps(photo, { sizes: "100vw" })}
            alt=""
            width="1600"
            height="1067"
            fetchpriority={priority ? "high" : undefined}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
          />
        )}
        <NavRow onMenu={() => setOpen(true)} menuOpen={open} />
        {title && (
          <div className="top__title wrap">
            {crumbs && (
              <nav className="crumbs" aria-label="Percorso">
                {crumbs.map((c, i) => (
                  <span key={c.to || c.label}>
                    {c.to ? <Link to={c.to}>{c.label}</Link> : c.label}
                    {i < crumbs.length - 1 ? " / " : ""}
                  </span>
                ))}
              </nav>
            )}
            <h1>{title}</h1>
            {intro && <p>{intro}</p>}
            {actions && <div className="top__actions">{actions}</div>}
          </div>
        )}
      </header>

      <div className={`bar${stuck ? " is-on" : ""}`} aria-hidden={!stuck} inert={!stuck ? "" : undefined}>
        <NavRow onMenu={() => setOpen(true)} menuOpen={open} />
      </div>

      <div id="menu" className={`drawer${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" inert={!open ? "" : undefined}>
        <div className="drawer__head">
          <img src="/img/logo-white.webp" alt="Liguria Design Group" width="640" height="270" />
          <button type="button" className="drawer__close" onClick={() => setOpen(false)} ref={closeRef}>Chiudi</button>
        </div>
        <nav aria-label="Pagine del sito">
          {ALL.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"}>{l.label}</NavLink>
          ))}
        </nav>
        <div className="drawer__foot">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          {site.phone && <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>}
          <span>{site.address}, {site.city}</span>
        </div>
      </div>
    </>
  );
}
