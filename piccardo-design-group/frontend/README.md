# Liguria Design Group: sito e area riservata

Sito pubblico in React + Vite, generato già pronto al build (prerender) per velocità e SEO.
Contenuti, immagini, messaggi e newsletter su **Supabase**. Hosting e funzioni su **Vercel**.

## Come è fatto

| Parte | Dove |
|---|---|
| Pagine pubbliche | `src/pages/site`, `src/components/site`, stile in `src/styles/site.css` |
| Area riservata (`/login`, `/admin`) | `src/admin` (caricata a parte, non pesa sul sito pubblico) |
| Contenuti iniziali e riserva se Supabase non risponde | `src/data/seed.js` |
| Database, permessi, storage | `supabase/schema.sql`, `supabase/seed.sql` (generato con `npm run seed:sql`) |
| Modulo contatti con email a info@ | `api/contact.js` |
| Creazione amministratori | `api/admin-users.js` |
| Aggiornamento del sito dopo le modifiche in admin | `api/rebuild.js` (deploy hook di Vercel) |
| Prerender, sitemap, robots, llms.txt | `scripts/prerender.mjs` |

## Variabili d'ambiente

Pubbliche (già in `.env.production`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL`.

Segrete, da impostare su Vercel > Settings > Environment Variables (Production e Preview):

| Nome | Valore |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Settings > API Keys > Secret key |
| `SMTP_HOST` | `smtps.aruba.it` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `info@liguriadesigngroup.it` |
| `SMTP_PASS` | password della casella info@ |
| `VERCEL_DEPLOY_HOOK` | Vercel > Settings > Git > Deploy Hooks (branch `main`) |

## Comandi

```bash
npm install
npm run dev        # sviluppo
npm run build      # build + prerender di tutte le pagine
npm run preview    # prova della build in locale
```

## Primo accesso all'area riservata

Gli amministratori sono le email nella tabella `admins` (all'inizio `info@liguriadesigngroup.it`).
L'utente si crea da Supabase > Authentication > Users > Invite user; dall'email si sceglie la password.
Altri amministratori si aggiungono dall'admin, sezione Account.
