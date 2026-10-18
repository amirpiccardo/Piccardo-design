import React, { createContext, useContext, useEffect } from "react";
import { imgUrl } from "./media";

export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://www.liguriadesigngroup.it").replace(/\/$/, "");
export const SITE_NAME = "Liguria Design Group";
const DEFAULT_IMAGE = "/og-image.jpg";

// Sul server (prerender) i tag vengono raccolti in questo oggetto e scritti nell'HTML.
const HeadContext = createContext(null);
export const HeadProvider = ({ collector, children }) => <HeadContext.Provider value={collector}>{children}</HeadContext.Provider>;

const abs = (u) => (!u ? "" : /^https?:\/\//.test(u) ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`);

export function buildHead({ title, description, path = "/", image, jsonLd = [], noindex = false }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Rappresentanza arredamento e illuminazione`;
  const url = abs(path);
  const img = abs(imgUrl(image) || DEFAULT_IMAGE);
  return { title: fullTitle, description: description || "", url, image: img, jsonLd, noindex };
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function headToHtml(h) {
  if (!h) return "";
  const tags = [
    `<title>${esc(h.title)}</title>`,
    h.description && `<meta name="description" content="${esc(h.description)}">`,
    `<link rel="canonical" href="${esc(h.url)}">`,
    h.noindex ? `<meta name="robots" content="noindex, nofollow">` : `<meta name="robots" content="index, follow, max-image-preview:large">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    `<meta property="og:locale" content="it_IT">`,
    `<meta property="og:title" content="${esc(h.title)}">`,
    h.description && `<meta property="og:description" content="${esc(h.description)}">`,
    `<meta property="og:url" content="${esc(h.url)}">`,
    `<meta property="og:image" content="${esc(h.image)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(h.title)}">`,
    h.description && `<meta name="twitter:description" content="${esc(h.description)}">`,
    `<meta name="twitter:image" content="${esc(h.image)}">`,
    ...h.jsonLd.map((d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, "\\u003c")}</script>`),
  ];
  return tags.filter(Boolean).join("\n    ");
}

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!value) { el?.remove(); return; }
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", value);
}

export function Seo(props) {
  const collector = useContext(HeadContext);
  const h = buildHead(props);
  if (collector) collector.head = h;

  const key = JSON.stringify(h);
  useEffect(() => {
    document.title = h.title;
    setMeta("name", "description", h.description);
    setMeta("name", "robots", h.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    setMeta("property", "og:title", h.title);
    setMeta("property", "og:description", h.description);
    setMeta("property", "og:url", h.url);
    setMeta("property", "og:image", h.image);
    setMeta("name", "twitter:title", h.title);
    setMeta("name", "twitter:description", h.description);
    setMeta("name", "twitter:image", h.image);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = h.url;
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
    h.jsonLd.forEach((d) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.textContent = JSON.stringify(d);
      document.head.appendChild(s);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return null;
}

// ─── Dati strutturati ────────────────────────────────────────────────────────
export function orgJsonLd(site, brands = [], team = []) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#org`,
    name: site.companyName || SITE_NAME,
    description: site.tagline,
    url: SITE_URL,
    logo: `${SITE_URL}/img/logo-navy.png`,
    image: `${SITE_URL}/og-image.jpg`,
    email: site.email,
    telephone: site.phone || undefined,
    vatID: site.vat,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: "Imperia",
      addressRegion: "IM",
      postalCode: "18100",
      addressCountry: "IT",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Liguria" },
      { "@type": "AdministrativeArea", name: "Piemonte" },
    ],
    knowsAbout: ["Rappresentanza commerciale", "Arredamento", "Illuminazione", "Arredo bagno", "Forniture contract"],
    brand: brands.map((b) => ({ "@type": "Brand", name: b.name, url: b.website || undefined })),
    employee: team.map((p) => ({ "@type": "Person", name: p.name, jobTitle: p.role, sameAs: p.linkedin || undefined })),
    sameAs: [site.instagram, site.facebook, site.linkedin].filter(Boolean),
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}
