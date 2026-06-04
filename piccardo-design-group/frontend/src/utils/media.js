// Risolve il percorso di un'immagine in base alla sua forma:
// - URL assoluto (http...)            -> usato così com'è
// - percorso assoluto sul frontend (/img/...) -> servito dal dominio statico (persistente)
// - percorso legacy multer (uploads/...) -> prefissato col backend
export function mediaUrl(path) {
  if (!path) return "";
  const p = String(path);
  if (p.startsWith("data:")) return p; // immagine base64 salvata nel DB
  const s = p.replace(/\\/g, "/");
  if (/^https?:\/\//i.test(s)) return s; // URL assoluto
  if (s.startsWith("/")) return s; // path sul dominio frontend (statico)
  return `${import.meta.env.VITE_BASE_URL}/${s}`; // legacy multer uploads/
}
