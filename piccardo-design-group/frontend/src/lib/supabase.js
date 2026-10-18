import { PostgrestClient } from "@supabase/postgrest-js";

// Chiavi pubbliche (anon): possono stare nel browser, i permessi li decide la Row Level Security.
// Valori pubblici del progetto Supabase (si possono sovrascrivere con le variabili VITE_*).
const url = import.meta.env.VITE_SUPABASE_URL || "https://mjzlofpzbfeadorxjbov.supabase.co";
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_g7pUyobrRkBCb04z60UjJQ_OgZyfkaC";

export const isSupabaseConfigured = Boolean(url && anonKey);
export const SUPABASE_URL = url;
export const SUPABASE_ANON_KEY = anonKey;
export const MEDIA_BUCKET = "media";

// Sito pubblico: solo letture e due inserimenti (newsletter, visite). Basta il client
// del database, molto più leggero della libreria completa usata nell'area riservata.
export const db = isSupabaseConfigured
  ? new PostgrestClient(`${url}/rest/v1`, { headers: { apikey: anonKey } })
  : null;
