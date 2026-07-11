import { useEffect } from "react";

const SITE = "Liguria Design Group";

function setMeta(key, content, attr = "name") {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

// Imposta title e meta description/OG per la singola pagina (senza librerie esterne)
export default function Seo({ title, description }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE}` : `${SITE} — Rappresentanza Arredamento e Illuminazione`;
    document.title = fullTitle;
    setMeta("og:title", fullTitle, "property");
    setMeta("twitter:title", fullTitle);
    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
      setMeta("twitter:description", description);
    }
  }, [title, description]);

  return null;
}
