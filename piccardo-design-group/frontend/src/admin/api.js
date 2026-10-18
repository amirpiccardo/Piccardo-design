import { MEDIA_BUCKET } from "../lib/supabase";
import { supabase } from "./client";

const need = () => {
  if (!supabase) throw new Error("Supabase non è configurato: mancano VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
  return supabase;
};
const check = ({ data, error }) => {
  if (error) throw new Error(translate(error));
  return data;
};

function translate(error) {
  const m = error?.message || String(error);
  if (/Invalid login credentials/i.test(m)) return "Email o password non corretti.";
  if (/Email not confirmed/i.test(m)) return "Email non ancora confermata.";
  if (/duplicate key/i.test(m)) return "Esiste già un elemento con questo valore.";
  if (/row-level security|permission denied|not authorized|non autorizzato/i.test(m)) return "Non hai i permessi per questa operazione. Controlla di essere un amministratore.";
  if (/Failed to fetch|NetworkError/i.test(m)) return "Connessione non riuscita. Controlla la rete e riprova.";
  return m;
}

// ─── Accesso ─────────────────────────────────────────────────────────────────
export const signIn = async (email, password) => check(await need().auth.signInWithPassword({ email: email.trim(), password }));
export const signOut = () => need().auth.signOut();
export const getSession = async () => (await need().auth.getSession()).data.session;
export const onAuthChange = (cb) => need().auth.onAuthStateChange((_e, session) => cb(session)).data.subscription;
export const isAdmin = async () => check(await need().rpc("is_admin"));
export const myRole = async () => check(await need().rpc("my_role"));

export async function changePassword(currentPassword, newPassword) {
  const sb = need();
  const { data } = await sb.auth.getUser();
  const email = data?.user?.email;
  if (!email) throw new Error("Sessione scaduta: accedi di nuovo.");
  const { error } = await sb.auth.signInWithPassword({ email, password: currentPassword });
  if (error) throw new Error("La password attuale non è corretta.");
  check(await sb.auth.updateUser({ password: newPassword }));
}

export const sendPasswordReset = async (email) =>
  check(await need().auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/login?reset=1` }));
export const setNewPassword = async (password) => check(await need().auth.updateUser({ password }));

async function authFetch(path, options = {}) {
  const session = await getSession();
  const res = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token || ""}`, ...(options.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || `Errore ${res.status}`);
  return body;
}

// Persone con accesso all'area riservata (solo il ruolo admin le vede tutte)
export const listUsers = async () => check(await need().from("admins").select("*").order("created_at"));
export const inviteUser = (email, role) => authFetch("/api/admin-users", { method: "POST", body: JSON.stringify({ email, role }) });
export const changeRole = (email, role) => authFetch("/api/admin-users", { method: "PATCH", body: JSON.stringify({ email, role }) });
export const removeUser = (email) => authFetch("/api/admin-users", { method: "DELETE", body: JSON.stringify({ email }) });

// Rigenera il sito pubblico (Vercel deploy hook) dopo le modifiche.
export const triggerRebuild = () => authFetch("/api/rebuild", { method: "POST" });

// ─── Tabelle ─────────────────────────────────────────────────────────────────
export const list = async (table, order = "position") =>
  check(await need().from(table).select("*").order(order, { ascending: order !== "created_at" }));
export const insert = async (table, row) => check(await need().from(table).insert(row).select().single());
export const update = async (table, id, patch) => check(await need().from(table).update(patch).eq("id", id).select().single());
export const remove = async (table, id) => check(await need().from(table).delete().eq("id", id));
export async function reorder(table, rows) {
  const sb = need();
  await Promise.all(rows.map((r, i) => sb.from(table).update({ position: i + 1 }).eq("id", r.id)));
}

export const getPage = async (key) => check(await need().from("pages").select("*").eq("key", key).maybeSingle());
export const savePage = async (key, fields, sections) =>
  check(await need().from("pages").upsert({ key, fields, sections }, { onConflict: "key" }).select().single());

export const listContacts = () => list("contacts", "created_at");
export const markContactRead = (id, read = true) => update("contacts", id, { read });
export const deleteContact = (id) => remove("contacts", id);
export const listSubscribers = () => list("newsletter_subscribers", "created_at");
export const deleteSubscriber = (id) => remove("newsletter_subscribers", id);

export async function pageStats() {
  const sb = need();
  sb.rpc("prune_page_views").then(() => {}, () => {});
  return check(await sb.rpc("page_stats"));
}

// ─── Immagini ────────────────────────────────────────────────────────────────
const MAX_INPUT_MB = 15;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Immagine non leggibile. Usa JPG, PNG o WebP.")); };
    img.src = url;
  });
}

function toWebp(img, maxWidth, quality) {
  const scale = Math.min(1, maxWidth / img.naturalWidth);
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(img, 0, 0, w, h);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/webp", quality));
}

const rid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

// Ridimensiona nel browser e carica su Supabase Storage.
// Foto: due versioni (1600 e 800 px) per caricare quella giusta su telefono e desktop.
// Loghi: una sola versione da 600 px, trasparenza mantenuta.
export async function uploadImage(file, { folder = "foto", kind = "photo" } = {}) {
  if (!file) throw new Error("Nessun file selezionato.");
  if (!/^image\//.test(file.type)) throw new Error("Il file non è un'immagine.");
  if (file.size > MAX_INPUT_MB * 1024 * 1024) throw new Error(`L'immagine supera ${MAX_INPUT_MB} MB.`);
  const sb = need();
  const base = `${folder}/${rid()}`;
  const put = async (path, blob) => {
    check(await sb.storage.from(MEDIA_BUCKET).upload(path, blob, { contentType: "image/webp", cacheControl: "31536000", upsert: false }));
    return sb.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
  };

  if (file.type === "image/svg+xml") {
    const path = `${base}.svg`;
    check(await sb.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: "image/svg+xml", cacheControl: "31536000" }));
    return sb.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  const img = await loadImage(file);
  if (kind === "logo") return put(`${base}-logo.webp`, await toWebp(img, 600, 0.9));
  const [large, small] = await Promise.all([toWebp(img, 1600, 0.8), toWebp(img, 800, 0.78)]);
  const url = await put(`${base}-1600.webp`, large);
  await put(`${base}-800.webp`, small);
  return url;
}

// Elimina dallo storage un'immagine non più usata (solo se caricata su Supabase).
export async function deleteImage(url) {
  if (!supabase || !url || typeof url !== "string") return;
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const i = url.indexOf(marker);
  if (i < 0) return;
  const path = decodeURIComponent(url.slice(i + marker.length));
  const paths = [path];
  if (path.endsWith("-1600.webp")) paths.push(path.replace(/-1600\.webp$/, "-800.webp"));
  await supabase.storage.from(MEDIA_BUCKET).remove(paths).catch(() => {});
}

export const slugify = (s) =>
  String(s || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/&/g, " e ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

// ─── Cataloghi PDF (pagina nascosta per i rivenditori) ──────────────────────
const CATALOG_BUCKET = "cataloghi";
const MAX_PDF_MB = 50;

export const listCatalogs = async (brandId) =>
  check(await need().from("brand_catalogs").select("*").eq("brand_id", brandId).order("position"));
export const updateCatalog = (id, patch) => update("brand_catalogs", id, patch);
export const reorderCatalogs = (rows) => reorder("brand_catalogs", rows);

export async function uploadCatalog(brandId, file, position) {
  if (!file) throw new Error("Nessun file selezionato.");
  if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) throw new Error("Il file non è un PDF.");
  if (file.size > MAX_PDF_MB * 1024 * 1024) throw new Error(`Il PDF supera ${MAX_PDF_MB} MB. Comprimilo o dividilo in più parti.`);
  const sb = need();
  const name = slugify(file.name.replace(/\.pdf$/i, "")) || "catalogo";
  const path = `${brandId}/${rid()}/${name}.pdf`;
  check(await sb.storage.from(CATALOG_BUCKET).upload(path, file, { contentType: "application/pdf", cacheControl: "86400", upsert: false }));
  const url = sb.storage.from(CATALOG_BUCKET).getPublicUrl(path).data.publicUrl;
  const title = file.name.replace(/\.pdf$/i, "").replace(/[_-]+/g, " ").trim();
  return insert("brand_catalogs", { brand_id: brandId, title, file: url, size: file.size, position });
}

export async function deleteCatalog(row) {
  await remove("brand_catalogs", row.id);
  const marker = `/storage/v1/object/public/${CATALOG_BUCKET}/`;
  const i = row.file.indexOf(marker);
  if (i >= 0) await supabase.storage.from(CATALOG_BUCKET).remove([decodeURIComponent(row.file.slice(i + marker.length))]).catch(() => {});
}

// Chiave del link nascosto: cambiarla disattiva il link vecchio.
export const getCatalogsKey = async () =>
  check(await need().from("private_settings").select("value").eq("key", "catalogs_key").maybeSingle())?.value || "";
export async function renewCatalogsKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const value = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  check(await need().from("private_settings").upsert({ key: "catalogs_key", value }, { onConflict: "key" }));
  return value;
}
