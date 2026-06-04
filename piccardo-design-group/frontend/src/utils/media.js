// Risolve il percorso di un'immagine in base alla sua forma:
// - URL assoluto (http...)            -> usato così com'è
// - percorso assoluto sul frontend (/img/...) -> servito dal dominio statico (persistente)
// - percorso legacy multer (uploads/...) -> prefissato col backend
export function mediaUrl(path) {
  if (!path) return "";
  const p = String(path).replace(/\\/g, "/");
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith("/")) return p;
  return `${import.meta.env.VITE_BASE_URL}/${p}`;
}
