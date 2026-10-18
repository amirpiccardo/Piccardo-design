// Genera le pagine pubbliche già pronte (HTML completo) dopo la build:
// Google, i social e i telefoni ricevono subito testo, titoli e dati strutturati.
// Uso: vite build && vite build --ssr src/entry-server.jsx --outDir dist-ssr && node scripts/prerender.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ssr = await import(pathToFileURL(join(root, "dist-ssr", "entry-server.js")).href);
const { render, loadContent, prerenderPaths, headToHtml, SITE_URL } = ssr;

const template = readFileSync(join(dist, "index.html"), "utf8");

// Precarica i due font principali (solo alfabeto latino) per evitare il cambio di carattere.
const assets = readdirSync(join(dist, "assets"));
const fonts = [/bodoni-moda-latin-opsz-normal/, /hanken-grotesk-latin-wght-normal/]
  .map((re) => assets.find((f) => re.test(f)))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`)
  .join("\n    ");

const content = await loadContent();
console.log(`Contenuti da: ${content.source} (${content.brands.length} marchi, ${content.team.length} persone)`);

const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029);
const BS = String.fromCharCode(92);
const esc = (s) => s.replace(/</g, BS + "u003c").split(LS).join(BS + "u2028").split(PS).join(BS + "u2029");
const dataScript = `<script>window.__LDG_DATA__=${esc(JSON.stringify(content))}</script>`;

function page(url) {
  const { html, head } = render(url, content);
  return template
    .replace("<!--app-preload-->", fonts)
    .replace("<!--app-head-->", headToHtml(head))
    .replace("<!--app-html-->", html)
    .replace("<!--app-data-->", dataScript);
}

function write(file, html) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

// Guscio vuoto per l'area riservata e per i marchi aggiunti dopo l'ultima build.
write(
  join(dist, "app.html"),
  template
    .replace("<!--app-preload-->", fonts)
    .replace("<!--app-head-->", `<title>Liguria Design Group</title>\n    <meta name="robots" content="noindex, nofollow">`)
    .replace("<!--app-html-->", "")
    .replace("<!--app-data-->", "")
);

const paths = prerenderPaths(content);
for (const p of paths) {
  const file = p === "/" ? join(dist, "index.html") : join(dist, p.slice(1), "index.html");
  write(file, page(p));
}
write(join(dist, "404.html"), page("/pagina-non-trovata"));
console.log(`Generate ${paths.length} pagine + 404 + app.html`);

// Sitemap con data di ultima modifica
const today = new Date().toISOString().slice(0, 10);
const lastmod = (p) => {
  const b = p.startsWith("/marchi/") && content.brands.find((x) => `/marchi/${x.slug}` === p);
  return (b?.updated_at || today).slice(0, 10);
};
const prio = (p) => (p === "/" ? "1.0" : p.startsWith("/marchi") || p === "/contract" || p === "/rivenditori" ? "0.8" : ["/privacy", "/cookie-policy", "/termini"].includes(p) ? "0.2" : "0.6");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITE_URL}${p === "/" ? "/" : p}</loc><lastmod>${lastmod(p)}</lastmod><priority>${prio(p)}</priority></url>`).join("\n")}
</urlset>
`;
write(join(dist, "sitemap.xml"), sitemap);

write(
  join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
);

// Riassunto per i motori di ricerca basati su AI (llms.txt)
const site = content.pages.site.fields;
const llms = `# ${site.companyName}

> ${site.tagline}. Sede: ${site.address}, ${site.city}. Zona: ${site.area}.

${content.pages.about.fields.intro2}

## Marchi rappresentati
${content.brands.map((b) => `- [${b.name}](${SITE_URL}/marchi/${b.slug})${b.category ? `: ${b.category}` : ""}`).join("\n")}

## Persone
${content.team.map((p) => `- ${p.name}, ${p.role}`).join("\n")}

## Pagine utili
- [Contract](${SITE_URL}/contract): forniture per hotel, B&B, studentati, uffici e locali
- [Per rivenditori](${SITE_URL}/rivenditori): cataloghi, listini, preventivi, visite
- [Contatti](${SITE_URL}/contatti): ${site.email}
- [Domande frequenti](${SITE_URL}/faq)
`;
write(join(dist, "llms.txt"), llms);

rmSync(join(root, "dist-ssr"), { recursive: true, force: true });
console.log("Sitemap, robots.txt e llms.txt scritti");
