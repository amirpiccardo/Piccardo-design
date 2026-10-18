import { PostgrestClient } from "@supabase/postgrest-js";

// Chiavi pubbliche (anon): possono stare nel browser, i permessi li decide la Row Level Security.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);
export const SUPABASE_URL = url;
export const SUPABASE_ANON_KEY = anonKey;
export const MEDIA_BUCKET = "media";

// Sito pubblico: solo letture e due inserimenti (newsletter, visite). Basta il client
// del database, molto più leggero della libreria completa usata nell'area riservata.
export const db = isSupabaseConfigured
  ? new PostgrestClient(`${url}/rest/v1`, { headers: { apikey: anonKey } })
  : null;
