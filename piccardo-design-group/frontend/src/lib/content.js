import { db as supabase } from "./supabase";
import {
  SEED_BRANDS, SEED_TEAM, SEED_CONTRACT_TYPES, SEED_CONTRACT_BRANDS, SEED_PAGES,
} from "../data/seed";

const byPosition = (a, b) => (a.position ?? 0) - (b.position ?? 0) || String(a.name || a.title).localeCompare(String(b.name || b.title));

export const SEED_CONTENT = {
  brands: [...SEED_BRANDS].sort(byPosition),
  team: [...SEED_TEAM].sort(byPosition),
  contractTypes: [...SEED_CONTRACT_TYPES].sort(byPosition),
  contractBrands: [...SEED_CONTRACT_BRANDS],
  pages: SEED_PAGES,
  source: "seed",
};

// Unisce una pagina salvata con i default: i campi nuovi o mai salvati prendono il valore iniziale.
export function mergePage(key, saved) {
  const def = SEED_PAGES[key] || { fields: {}, sections: [] };
  if (!saved) return def;
  const fields = { ...def.fields };
  for (const [k, v] of Object.entries(saved.fields || {})) {
    if (v !== undefined && v !== null) fields[k] = v;
  }
  const sections = Array.isArray(saved.sections) && (saved.sections.length || saved.updated_at) ? saved.sections : def.sections;
  return { fields, sections, updated_at: saved.updated_at };
}

// Carica tutti i contenuti pubblici. Se Supabase non è configurato o non risponde,
// restituisce i contenuti iniziali: il sito non resta mai vuoto.
export async function loadContent() {
  if (!supabase) return SEED_CONTENT;
  try {
    const [brands, team, types, cbrands, pages] = await Promise.all([
      supabase.from("brands").select("*").order("position").order("name"),
      supabase.from("team_members").select("*").order("position").order("name"),
      supabase.from("contract_types").select("*").order("position"),
      supabase.from("contract_brands").select("*").order("position").order("name"),
      supabase.from("pages").select("*"),
    ]);
    const failed = [brands, team, types, cbrands, pages].find((r) => r.error);
    if (failed) throw failed.error;
    const savedPages = Object.fromEntries((pages.data || []).map((p) => [p.key, p]));
    const allKeys = new Set([...Object.keys(SEED_PAGES), ...Object.keys(savedPages)]);
    return {
      brands: brands.data || [],
      team: team.data || [],
      contractTypes: types.data || [],
      contractBrands: cbrands.data || [],
      pages: Object.fromEntries([...allKeys].map((k) => [k, mergePage(k, savedPages[k])])),
      source: "supabase",
    };
  } catch (err) {
    console.error("Contenuti da Supabase non disponibili, uso quelli iniziali:", err?.message || err);
    return SEED_CONTENT;
  }
}

export const lines = (text) => String(text || "").split("\n").map((s) => s.trim()).filter(Boolean);
