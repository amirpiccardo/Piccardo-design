// Contenuti di default per le pagine gestibili dalla dashboard (sezione "Pagine").
// Fungono da fallback quando l'admin non ha ancora personalizzato nulla, e da
// punto di partenza precompilato quando apre l'editor per la prima volta.

export const HOME_FIELDS = [
  { key: "heroTitle", label: "Titolo principale (hero)", type: "text" },
  { key: "heroSubtitle", label: "Sottotitolo hero", type: "textarea" },
  { key: "servicesTitle", label: "Titolo sezione \"Cosa facciamo\"", type: "text" },
  { key: "servicesSubtitle", label: "Sottotitolo sezione \"Cosa facciamo\"", type: "textarea" },
  { key: "service1Title", label: "Servizio 1 — titolo", type: "text" },
  { key: "service1Text", label: "Servizio 1 — testo", type: "textarea" },
  { key: "service2Title", label: "Servizio 2 — titolo", type: "text" },
  { key: "service2Text", label: "Servizio 2 — testo", type: "textarea" },
  { key: "service3Title", label: "Servizio 3 — titolo", type: "text" },
  { key: "service3Text", label: "Servizio 3 — testo", type: "textarea" },
  { key: "statsLabel", label: "Etichetta statistica (es. \"Made in Italy\")", type: "text" },
  { key: "workTitle", label: "Titolo sezione \"Come lavoriamo\"", type: "text" },
  { key: "workSubtitle", label: "Sottotitolo sezione \"Come lavoriamo\"", type: "textarea" },
  { key: "step1Title", label: "Passo 1 — titolo", type: "text" },
  { key: "step1Text", label: "Passo 1 — testo", type: "textarea" },
  { key: "step2Title", label: "Passo 2 — titolo", type: "text" },
  { key: "step2Text", label: "Passo 2 — testo", type: "textarea" },
  { key: "step3Title", label: "Passo 3 — titolo", type: "text" },
  { key: "step3Text", label: "Passo 3 — testo", type: "textarea" },
  { key: "step4Title", label: "Passo 4 — titolo", type: "text" },
  { key: "step4Text", label: "Passo 4 — testo", type: "textarea" },
];

export const HOME_DEFAULTS = {
  heroTitle: "Liguria Design Group",
  heroSubtitle: "Consulenza su misura per aziende, architetti e progettisti nel settore dell'arredamento e dell'illuminazione.",
  servicesTitle: "Cosa facciamo",
  servicesSubtitle: "Un unico riferimento per l'arredamento e l'illuminazione, dalla consulenza alla fornitura.",
  service1Title: "Rappresentanza brand",
  service1Text: "Rappresentiamo aziende leader nel settore arredamento e illuminazione, curando i rapporti con i rivenditori.",
  service2Title: "Consulenza & preventivazione",
  service2Text: "Supportiamo rivenditori e clienti nella scelta e nella preventivazione dei prodotti più adatti.",
  service3Title: "Soluzioni contract",
  service3Text: "Consulenza dedicata per hotel, B&B, studentati e forniture di grandi progetti.",
  statsLabel: "Made in Italy",
  workTitle: "Come lavoriamo",
  workSubtitle: "Un metodo chiaro in quattro passi, dalla prima esigenza al supporto continuo.",
  step1Title: "Ascoltiamo",
  step1Text: "Analizziamo le tue esigenze e quelle del mercato per definire gli obiettivi.",
  step2Title: "Selezioniamo",
  step2Text: "Scegliamo i brand e le soluzioni più adatte tra i migliori marchi Made in Italy.",
  step3Title: "Forniamo",
  step3Text: "Gestiamo la distribuzione e la logistica con precisione e affidabilità.",
  step4Title: "Supportiamo",
  step4Text: "Ti affianchiamo in ogni fase, anche dopo, con consulenza tecnica dedicata.",
};

export const ABOUT_FIELDS = [
  { key: "intro1", label: "Paragrafo introduttivo 1", type: "textarea" },
  { key: "intro2", label: "Paragrafo introduttivo 2", type: "textarea" },
  { key: "intro3", label: "Paragrafo introduttivo 3", type: "textarea" },
  { key: "teamTitle", label: "Titolo sezione team", type: "text" },
  { key: "teamSubtitle", label: "Sottotitolo sezione team", type: "textarea" },
];

export const ABOUT_DEFAULTS = {
  intro1: "Liguria Design Group lavora per creare sinergie tra azienda, rivenditore e cliente, elevando l'arredamento e l'illuminazione con esperienza e passione.",
  intro2: "Siamo un'agenzia di rappresentanza: rappresentiamo aziende leader nel settore mobili e illuminazione, occupandoci di tutta la casa. Ci occupiamo di preventivazione e consulenza, supportando rivenditori e negozianti nel lavoro quotidiano con la nostra esperienza nel mondo del design, dell'arredamento e del marketing.",
  intro3: "Presentiamo la nostra esperienza nel settore dell'arredamento e illuminazione, unita a un approccio personalizzato che valorizza qualità e innovazione, per soddisfare pienamente le esigenze dei clienti della Liguria e del basso Piemonte.",
  teamTitle: "Il Nostro Team",
  teamSubtitle: "Conosci i professionisti che guidano Liguria Design Group con passione e competenza.",
};

export const PRIVACY_DEFAULT_SECTIONS = [
  { title: "1. Titolare del trattamento", text: "Il titolare del trattamento dei dati è Liguria Design Group, Via Vittorio Alfieri 18, 18100 Imperia (IM), P.IVA 01587610088. Per qualsiasi richiesta è possibile scrivere a info@liguriadesigngroup.it." },
  { title: "2. Dati raccolti", text: "Raccogliamo i dati che ci fornisci volontariamente tramite il modulo di contatto (nome, email, messaggio) e l'iscrizione alla newsletter (email). Non raccogliamo categorie particolari di dati." },
  { title: "3. Finalità e base giuridica", text: "I dati di contatto sono trattati per rispondere alle tue richieste (base giuridica: esecuzione di misure precontrattuali). L'email per la newsletter è trattata sulla base del tuo consenso, revocabile in qualsiasi momento." },
  { title: "4. Conservazione", text: "I dati sono conservati per il tempo necessario alle finalità indicate e comunque non oltre i termini previsti dalla legge. Puoi richiederne la cancellazione in qualsiasi momento." },
  { title: "5. Diritti dell'interessato", text: "Ai sensi degli artt. 15-22 del GDPR hai diritto di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione. Per esercitarli, scrivi a info@liguriadesigngroup.it. Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali." },
];

export const COOKIE_DEFAULT_SECTIONS = [
  { title: "1. Cosa sono i cookie", text: "I cookie sono piccoli file di testo che i siti visitati inviano al dispositivo dell'utente, dove vengono memorizzati per essere ritrasmessi agli stessi siti alla successiva visita." },
  { title: "2. Cookie tecnici", text: "Il sito utilizza cookie tecnici necessari al funzionamento (es. gestione del consenso). Non richiedono il tuo consenso." },
  { title: "3. Cookie di statistica", text: "Previo tuo consenso, utilizziamo cookie di statistica per analizzare in forma aggregata l'utilizzo del sito e migliorarne l'esperienza." },
  { title: "4. Gestione delle preferenze", text: "Puoi gestire le tue preferenze in qualsiasi momento tramite il banner cookie mostrato alla prima visita, oppure cancellando i cookie dalle impostazioni del tuo browser." },
];

export const TERMS_DEFAULT_SECTIONS = [
  { title: "1. Oggetto", text: "I presenti termini regolano l'utilizzo del sito di Liguria Design Group. Navigando il sito accetti le presenti condizioni." },
  { title: "2. Proprietà intellettuale", text: "Tutti i contenuti del sito (testi, immagini, logo, marchi) sono di proprietà di Liguria Design Group o dei rispettivi titolari e non possono essere riprodotti senza autorizzazione." },
  { title: "3. Limitazione di responsabilità", text: "Le informazioni presenti sul sito sono fornite a scopo informativo. Liguria Design Group non garantisce l'assenza di errori e non è responsabile per eventuali danni derivanti dall'uso del sito." },
  { title: "4. Link a siti esterni", text: "Il sito può contenere link a siti di terzi (es. brand partner). Non siamo responsabili dei contenuti o delle policy di tali siti." },
  { title: "5. Legge applicabile", text: "I presenti termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente il foro di Imperia." },
];

export const FAQ_DEFAULT_SECTIONS = [
  { title: "Di cosa si occupa Liguria Design Group?", text: "Siamo un'agenzia di rappresentanza nel settore mobili e illuminazione. Rappresentiamo aziende leader del settore e supportiamo rivenditori e negozianti con consulenza, preventivazione e assistenza quotidiana." },
  { title: "Come posso diventare rivenditore o richiedere una consulenza?", text: "Contattaci tramite il modulo nella pagina Contatti: il nostro team ti ricontatterà per valutare insieme le opportunità di collaborazione." },
  { title: "Fate anche consulenza contract?", text: "Sì. Offriamo consulenza per hotel, B&B, pensioni, studentati e altre strutture che richiedono forniture importanti di arredamento e illuminazione." },
  { title: "In quali zone operate?", text: "Operiamo principalmente in Liguria e nel basso Piemonte. Per richieste specifiche, contattaci e valuteremo insieme le esigenze." },
  { title: "Posso ricevere informazioni sui brand rappresentati?", text: "Scrivici tramite il modulo di contatto indicando i brand di tuo interesse e ti forniremo tutte le informazioni disponibili." },
];

// Unisce i campi salvati nel DB con i default (i default riempiono le chiavi mancanti)
export function mergeFields(defaults, dbFields) {
  if (!dbFields || typeof dbFields !== "object") return { ...defaults };
  return { ...defaults, ...dbFields };
}

// Le sezioni sono liste ordinate gestite per intero dall'admin: se nel DB ce ne
// sono (anche zero dopo una modifica intenzionale), quelle vincono sui default.
export function resolveSections(defaults, dbSections, dbUpdatedAt) {
  if (dbUpdatedAt && Array.isArray(dbSections)) return dbSections;
  return defaults;
}

export const PAGES_META = [
  { key: "home", label: "Home", type: "fields", fields: HOME_FIELDS, defaults: HOME_DEFAULTS },
  { key: "about", label: "Chi Siamo", type: "fields", fields: ABOUT_FIELDS, defaults: ABOUT_DEFAULTS },
  { key: "privacy", label: "Privacy Policy", type: "sections", defaults: PRIVACY_DEFAULT_SECTIONS, sectionTitleLabel: "Titolo sezione", sectionTextLabel: "Testo" },
  { key: "cookie", label: "Cookie Policy", type: "sections", defaults: COOKIE_DEFAULT_SECTIONS, sectionTitleLabel: "Titolo sezione", sectionTextLabel: "Testo" },
  { key: "terms", label: "Termini e Condizioni", type: "sections", defaults: TERMS_DEFAULT_SECTIONS, sectionTitleLabel: "Titolo sezione", sectionTextLabel: "Testo" },
  { key: "faq", label: "FAQ", type: "sections", defaults: FAQ_DEFAULT_SECTIONS, sectionTitleLabel: "Domanda", sectionTextLabel: "Risposta" },
];
