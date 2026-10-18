// Genera supabase/seed.sql dai contenuti di src/data/seed.js.
// Uso: node scripts/make-seed-sql.mjs
// Il seed non sovrascrive nulla: se un contenuto esiste già (modificato dall'admin) resta com'è.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { SEED_BRANDS, SEED_TEAM, SEED_CONTRACT_TYPES, SEED_CONTRACT_BRANDS, SEED_PAGES } from "../src/data/seed.js";

const ADMIN_EMAILS = ["info@liguriadesigngroup.it"];

const q = (v) => `'${String(v ?? "").replace(/'/g, "''")}'`;
const j = (v) => `${q(JSON.stringify(v ?? null))}::jsonb`;

const out = [
  "-- Generato da scripts/make-seed-sql.mjs: non modificare a mano.",
  "-- Da eseguire nel SQL Editor di Supabase dopo schema.sql.",
  "",
  ...ADMIN_EMAILS.map((e) => `insert into public.admins (email) values (${q(e)}) on conflict do nothing;`),
  "",
];

for (const b of SEED_BRANDS) {
  out.push(
    `insert into public.brands (slug, name, logo, website, category, description, photos, position) values (${[
      q(b.slug), q(b.name), q(b.logo), q(b.website), q(b.category), q(b.description), j(b.photos), b.position,
    ].join(", ")}) on conflict (slug) do nothing;`
  );
}
out.push("");

const onlyIfEmpty = (table, rows, cols) => {
  if (!rows.length) return;
  const values = rows.map((r) => `(${cols.map(([k, t]) => (t === "int" ? Number(r[k] || 0) : q(r[k]))).join(", ")})`).join(",\n  ");
  out.push(
    `insert into public.${table} (${cols.map(([k]) => k).join(", ")})\nselect * from (values\n  ${values}\n) v(${cols.map(([k]) => k).join(", ")})\nwhere not exists (select 1 from public.${table});`,
    ""
  );
};

onlyIfEmpty("team_members", SEED_TEAM, [["name"], ["role"], ["photo"], ["bio"], ["linkedin"], ["position", "int"]]);
onlyIfEmpty("contract_types", SEED_CONTRACT_TYPES, [["title"], ["text"], ["photo"], ["position", "int"]]);
onlyIfEmpty("contract_brands", SEED_CONTRACT_BRANDS, [["name"], ["logo"], ["website"], ["category"], ["description"], ["position", "int"]]);

for (const [key, page] of Object.entries(SEED_PAGES)) {
  out.push(
    `insert into public.pages (key, fields, sections) values (${q(key)}, ${j(page.fields)}, ${j(page.sections)}) on conflict (key) do nothing;`
  );
}

const target = fileURLToPath(new URL("../supabase/seed.sql", import.meta.url));
writeFileSync(target, out.join("\n") + "\n");
console.log("Scritto", target);
