# Liguria Design Group: passaggio di consegne

Documento per continuare il lavoro su un altro PC e con un altro account Claude Code.
Incollalo (o fallo leggere) a Claude all'inizio della nuova sessione: contiene tutto il contesto.

> Lingua: l'utente vuole **tutte le risposte in italiano**.

---

## 1. Il progetto in breve

- **Cliente**: Liguria Design Group, agenzia di rappresentanza arredamento e illuminazione, Via Vittorio Alfieri 18, 18100 Imperia. P. IVA 01587610088. Email info@liguriadesigngroup.it. Soci: Gabriele Piccardo e Francesca Zabbia. Zona: Liguria e basso Piemonte.
- **Repository GitHub**: https://github.com/amirpiccardo/Piccardo-design (branch `main` = produzione; `redesign-supabase` = stesso contenuto).
- **Cartella dell'app**: `piccardo-design-group/frontend` (è anche la Root Directory su Vercel).
- **Sito online (provvisorio)**: https://piccardo-design.vercel.app
- **Area riservata**: https://piccardo-design.vercel.app/login
- **Dominio vero**: liguriadesigngroup.it, oggi su **Aruba** (DNS e posta). Oggi punta ancora al vecchio sito WordPress. La migrazione del dominio è il prossimo passo.

## 2. Architettura

| Parte | Tecnologia | Dove |
|---|---|---|
| Sito pubblico | React 18 + Vite, pagine pre-generate al build (prerender SSR) | `src/pages/site`, `src/components/site`, `src/styles/site.css` |
| Area riservata | React, caricata a parte (lazy) | `src/admin` |
| Database, login, immagini | **Supabase** (progetto `liguria-design-group`, id `mjzlofpzbfeadorxjbov`, regione Europa, piano Free) | `supabase/schema.sql`, `supabase/roles.sql`, `supabase/seed.sql` |
| Funzioni server | Vercel Functions (Node, CommonJS) | `api/contact.js`, `api/admin-users.js`, `api/rebuild.js`, `api/_lib/server.js` |
| Prerender, sitemap, robots, llms.txt | script Node | `scripts/prerender.mjs` |
| Contenuti iniziali e riserva se Supabase non risponde | | `src/data/seed.js` (genera `supabase/seed.sql` con `npm run seed:sql`) |

MongoDB, Express e il vecchio backend `server/` sono stati **eliminati**.

### Comandi

```bash
cd piccardo-design-group/frontend
npm install
npm run dev        # sviluppo (http://localhost:5173)
npm run build      # build + prerender di tutte le pagine
npx vite preview --port 4173   # prova della build (http://localhost:4173)
npx eslint .       # deve dare zero errori
```

### Come funziona il build
`vite build` (client) → `vite build --ssr src/entry-server.jsx` → `node scripts/prerender.mjs`, che legge i contenuti da Supabase e scrive `dist/<pagina>/index.html`, `dist/app.html` (guscio per admin/login), `404.html`, `sitemap.xml`, `robots.txt`, `llms.txt`.
`vercel.json`: `cleanUrls`, redirect 301 dai vecchi URL (/about, /materials, /contracts, /contact, /team), rewrite di `/admin`, `/login` e `/marchi/:slug` (se non pre-generato) verso `/app`.

### Valori pubblici Supabase (già nel codice)
In `src/lib/supabase.js` e `api/_lib/server.js` ci sono come valori predefiniti l'URL `https://mjzlofpzbfeadorxjbov.supabase.co` e la chiave **pubblica** `sb_publishable_…`. Sono pubblici per natura (la sicurezza la fa la Row Level Security).
Attenzione: sul vecchio PC un `.gitignore_global` escludeva i file `.env.*`, per questo i valori sono stati messi nel codice.

## 3. Database e permessi (Supabase)

Tabelle: `brands`, `contract_brands`, `contract_types`, `team_members`, `pages` (key + fields jsonb + sections jsonb), `contacts`, `newsletter_subscribers`, `page_views`, `admins` (email + role).
Storage: bucket pubblico `media` (le immagini caricate dall'admin vengono ridimensionate nel browser in WebP 1600 e 800 px).

**Ruoli** (`supabase/roles.sql`), tabella `admins.role`:
- `admin`: tutto, compresa la gestione delle persone
- `editor`: pagine, marchi, persone, contract, messaggi, newsletter
- `messages`: solo panoramica, messaggi, newsletter, account

Funzioni SQL: `my_role()`, `is_admin()`, `can_edit()`, `can_manage_users()`, `page_stats()`, `prune_page_views()`.

Amministratori attuali: `amirpiccardo@gmail.com` (ha già scelto la password e accede) e `info@liguriadesigngroup.it` (nell'elenco ma senza account creato).

**Auth > URL Configuration**:
- Site URL: `http://localhost:4173` (da cambiare con il dominio vero, vedi sotto)
- Redirect URLs: `http://localhost:4173/**`, `https://piccardo-design.vercel.app/**`, `https://*-amir-piccardos-projects.vercel.app/**`

## 4. Vercel

Progetto `piccardo-design` (team "Amir Piccardo's projects", piano Hobby). Root Directory `piccardo-design-group/frontend`. Deploy automatico a ogni push su `main`.

Variabili d'ambiente presenti (Production):
- `SMTP_HOST` = smtps.aruba.it, `SMTP_PORT` = 465, `SMTP_USER` = info@liguriadesigngroup.it (Config)
- `SUPABASE_SERVICE_ROLE_KEY` (Secret, inserita dall'utente)
- `VERCEL_DEPLOY_HOOK` (Secret; hook "admin-aggiornamento" sul branch main, in Settings > Git > Deploy Hooks)

**Manca**: `SMTP_PASS`, la password della casella info@. Senza, i messaggi del modulo vengono salvati su Supabase e si vedono nell'admin, ma la mail a info@ non parte.

Facoltativa: `CONTACT_TO` (destinatario delle mail del modulo, default info@liguriadesigngroup.it).

## 5. Sito: struttura e design (decisioni prese con l'utente)

- Palette: ardesia chiara (#eceeef) come fondo, navy LDG (#1b2a4a / #16213a) come inchiostro e fasce, oro (#a8834a) solo per gli accenti. Font: Bodoni Moda (titoli) e Hanken Grotesk (testo), ospitati in locale con @fontsource.
- **Coerenza**: ogni sezione usa la stessa struttura (componente `Section`): a sinistra la colonna con titolo, introduzione ed eventuale anteprima, a destra il contenuto. Ogni elenco (marchi, contract, servizi, FAQ, indice della home) usa lo stesso componente a righe (`IndexSection` / `.rows`). Il navy si usa solo in apertura (testata) e in chiusura (fascia finale e footer).
- **Home = biglietto da visita**: foto con titolo, frase e bottone "Contattaci" → fascia con i loghi dei marchi (colori originali, 2 righe da 4 su desktop) → indice delle pagine con anteprima → fascia di chiusura. Tutto il resto vive nelle pagine dedicate.
- Pagine: `/marchi` (con filtri per categoria), `/marchi/:slug` (una per marchio), `/contract`, `/chi-siamo` (Cosa facciamo a righe, persone con foto a colori veri, mappa della zona), `/rivenditori` (servizi, metodo, marchi), `/contatti` (modulo con dati aziendali nella colonna e assistente "Domande rapide"), `/faq`, `/privacy`, `/cookie-policy`, `/termini`.
- L'utente **non** ha voluto: il titolo gigante in home, il "campionario" di foto in home, la sezione "Dal produttore al vostro negozio", i ritratti tinti di blu.
- SEO: HTML pre-generato con H1, title, description, canonical, Open Graph e JSON-LD (ProfessionalService, Brand, BreadcrumbList, FAQPage, ItemList). Sitemap con lastmod. `SITE_URL` in `src/lib/seo.jsx` (default `https://piccardo-design.vercel.app`, sovrascrivibile con `VITE_SITE_URL`).

Marchi (con sito ufficiale verificato): Lapalma (lapalma.it), Pintdecor (pintdecor.it), GB Group (gbgroupe.com), Imab Group (imab.com), Team Italia (teamitaliailluminazione.it, illuminazione), Confort Plus (confortplus.it), Effe2 (effe2srl.it), San Lorenzo Home (sanlorenzohome.it).

## 6. Cosa resta da fare

### Serve l'utente
1. **Password SMTP**: aggiungere `SMTP_PASS` su Vercel (Secret, Production), poi fare un Redeploy. Provare il modulo su /contatti e verificare che la mail arrivi a info@.
2. **Migrazione del dominio: FATTA il 18/10/2026.** Su Vercel `www.liguriadesigngroup.it` è il principale, `liguriadesigngroup.it` reindirizza (308). Su Aruba: A @ = 216.198.79.1, A www = 76.76.21.21, record AAAA del sito eliminati; posta (MX, mail, smtp, SPF) non toccata. `SITE_URL` nel codice punta già a www. Supabase: Site URL e Redirect URLs aggiornati al dominio. Resta solo da verificare, a propagazione finita, che Vercel mostri "Valid Configuration" e che HTTPS funzioni.
3. **Mittente email di Supabase** (Authentication > Emails > SMTP Settings): impostare smtps.aruba.it, porta 465, utente info@liguriadesigngroup.it, password della casella, mittente "Liguria Design Group". Senza, gli inviti dall'admin arrivano solo agli indirizzi del team Supabase.
4. **Contenuti dall'admin**: foto per i 6 marchi che non ne hanno (sezione Marchi), telefono e social (Pagine e testi > Dati aziendali), conferma delle province nella mappa (Pagine e testi > Chi siamo).
5. Creare l'account di info@liguriadesigngroup.it (o di Gabriele e Francesca) dall'admin, sezione **Account > Invita una persona**, dopo aver fatto il punto 3.

### Claude può farlo da solo, dopo che il dominio funziona
6. Su Vercel aggiungere la variabile `VITE_SITE_URL=https://www.liguriadesigngroup.it` (o senza www, come scelto) e fare il redeploy: aggiorna canonical, sitemap, robots e JSON-LD.
7. Su Supabase > Auth > URL Configuration: impostare la Site URL sul dominio vero e aggiungere `https://liguriadesigngroup.it/**` e `https://www.liguriadesigngroup.it/**` tra i Redirect URLs.
8. Far reindirizzare `piccardo-design.vercel.app` al dominio vero (Vercel > Domains).
9. Lighthouse da mobile sul dominio vero e correzioni di velocità.

### Dopo la messa online (serve l'accesso dell'utente)
10. Google Search Console: verificare il dominio e inviare `/sitemap.xml`.
11. Scheda Google Business con lo stesso indirizzo di Imperia.

## 7. Note pratiche per il nuovo PC e il nuovo account

- **Clonare**: `git clone https://github.com/amirpiccardo/Piccardo-design.git`, poi `cd Piccardo-design/piccardo-design-group/frontend && npm install`.
- **GitHub**: il push richiede un account con accesso in scrittura al repository `amirpiccardo/Piccardo-design` (es. `gh auth login --web` con l'account amirpiccardo).
- **Accessi web che servono a Claude** (nel browser integrato o in Chrome): GitHub, Vercel (progetto piccardo-design) e Supabase (progetto liguria-design-group). L'utente fa il login; Claude non inserisce password né chiavi segrete: quelle le incolla sempre l'utente.
- **Modifiche al database**: si fanno dall'SQL Editor di Supabase. Gli script in `supabase/` si possono rieseguire.
- **Prova in locale**: `npm run build && npx vite preview --port 4173`. Per l'area riservata in locale la Site URL di Supabase deve includere `http://localhost:4173` (c'è già).
- **Regole di stile del codice** (da rispettare): CSS a token in `site.css` e `admin.css`, nessun Bootstrap, nessuna libreria UI; testi in italiano, frasi semplici, sentence case; niente maiuscolo per le etichette; un solo bottone primario per sezione, il resto link.

## 8. Cronologia dei commit principali

- `e1a4d28` Nuovo sito: Supabase al posto di MongoDB, redesign e area riservata a ruoli
- `471eb58` Completa il nuovo sito: configurazione Vercel, dipendenze, pagine e stili
- `e728071` Corregge l'accesso all'area riservata e la connessione delle funzioni a Supabase
- `2e6ef14` Collega il sito a Supabase anche senza file .env
- `3149919` Rimuove il vecchio backend Express/MongoDB
