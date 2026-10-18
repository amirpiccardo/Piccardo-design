// Le immagini caricate (e quelle iniziali in /img/foto) esistono in due larghezze:
// "<nome>-1600.webp" e "<nome>-800.webp". Da qui ricaviamo srcset per i telefoni.

export function imgUrl(value) {
  if (!value) return "";
  if (typeof value === "object") return value.url || "";
  return String(value);
}

export function imgAlt(value, fallback = "") {
  if (value && typeof value === "object" && value.alt) return value.alt;
  return fallback;
}

export function srcSet(value) {
  const url = imgUrl(value);
  if (!/-1600\.webp(\?.*)?$/.test(url)) return undefined;
  return `${url.replace(/-1600\.webp/, "-800.webp")} 800w, ${url} 1600w`;
}

// Props pronte per <img>: src, srcSet e sizes coerenti.
export function imgProps(value, { sizes = "100vw", alt = "" } = {}) {
  const set = srcSet(value);
  return {
    src: imgUrl(value),
    srcSet: set,
    sizes: set ? sizes : undefined,
    alt: imgAlt(value, alt),
  };
}
