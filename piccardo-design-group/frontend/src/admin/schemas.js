// Cosa si può modificare in ogni pagina, raggruppato come appare sul sito.
// Tipi: text, textarea, lines (una voce per riga), image, gallery.
const seo = {
  legend: "Google e condivisioni",
  fields: [
    { key: "seoTitle", label: "Titolo per Google", type: "text", max: 60, hint: "Circa 50-60 caratteri. Il nome dell'azienda viene aggiunto da solo." },
    { key: "seoDescription", label: "Descrizione per Google", type: "textarea", rows: 3, max: 160, hint: "Circa 140-160 caratteri: cosa trova chi apre la pagina." },
  ],
};

export const PAGE_SCHEMAS = [
  {
    key: "home",
    label: "Home",
    groups: [
      { legend: "Apertura", fields: [
        { key: "topPhoto", label: "Foto in alto", type: "image", hint: "Orizzontale, almeno 1600 px di larghezza. Il titolo ci va sopra in bianco: meglio una foto non troppo chiara in basso." },
        { key: "heroTitle", label: "Titolo", type: "text", max: 60 },
        { key: "heroText", label: "Frase sotto il titolo", type: "textarea", rows: 3, max: 180 },
      ] },
      { legend: "Indice delle pagine", fields: [
        { key: "dirTitle", label: "Titolo", type: "text" },
        { key: "dirIntro", label: "Introduzione", type: "text" },
        { key: "dirBrandsText", label: "Marchi: descrizione", type: "text", hint: "La foto è quella del primo marchio che ne ha una." },
        { key: "dirContractText", label: "Contract: descrizione", type: "text", hint: "La foto è quella del primo tipo di progetto." },
        { key: "dirAboutText", label: "Chi siamo: descrizione", type: "text" },
        { key: "dirAboutPhoto", label: "Chi siamo: foto", type: "image" },
        { key: "dirDealersText", label: "Per rivenditori: descrizione", type: "text" },
        { key: "dirDealersPhoto", label: "Per rivenditori: foto", type: "image" },
        { key: "dirContactText", label: "Contatti: descrizione", type: "text" },
        { key: "dirContactPhoto", label: "Contatti: foto", type: "image" },
      ] },
      { legend: "Chiusura (fascia blu)", fields: [
        { key: "closingTitle", label: "Titolo", type: "text" },
        { key: "closingText", label: "Testo", type: "textarea", rows: 2 },
      ] },
      seo,
    ],
  },
  {
    key: "about",
    label: "Chi siamo",
    sections: { title: "Cosa facciamo: righe", item: "attività", titleLabel: "Attività", textLabel: "Descrizione" },
    groups: [
      { legend: "Pagina", fields: [
        { key: "headerPhoto", label: "Foto in alto", type: "image" },
        { key: "title", label: "Titolo", type: "text" },
      ] },
      { legend: "Cosa facciamo", fields: [
        { key: "introTitle", label: "Titolo della sezione", type: "text" },
        { key: "intro1", label: "Testo nella colonna", type: "textarea", rows: 4 },
        { key: "aboutPhoto", label: "Foto nella colonna", type: "image" },
      ] },
      { legend: "Le persone", fields: [
        { key: "teamTitle", label: "Titolo", type: "text" },
        { key: "teamSubtitle", label: "Sottotitolo", type: "text", hint: "Le persone si modificano nella sezione Persone." },
      ] },
      { legend: "Dove lavoriamo", fields: [
        { key: "territoryTitle", label: "Titolo", type: "text" },
        { key: "territoryText", label: "Testo", type: "textarea", rows: 3 },
        { key: "territoryLiguria", label: "Città sulla costa, da ovest a est (la prima è evidenziata in oro)", type: "lines", rows: 5 },
        { key: "territoryPiemonte", label: "Città nell'entroterra, da ovest a est", type: "lines", rows: 4 },
      ] },
      seo,
    ],
  },
  {
    key: "brands",
    label: "Pagina Marchi",
    groups: [
      { legend: "Pagina", fields: [
        { key: "title", label: "Titolo", type: "text" },
        { key: "intro", label: "Introduzione", type: "textarea", rows: 3 },
      ] },
      seo,
    ],
  },
  {
    key: "contract",
    label: "Pagina Contract",
    groups: [
      { legend: "Pagina", fields: [
        { key: "headerPhoto", label: "Foto in alto", type: "image" },
        { key: "title", label: "Titolo", type: "text" },
        { key: "intro", label: "Introduzione", type: "textarea", rows: 3 },
        { key: "typesTitle", label: "Titolo elenco tipi di progetto", type: "text", hint: "I tipi di progetto e le foto si modificano nella sezione Contract." },
        { key: "typesIntro", label: "Introduzione elenco", type: "text" },
        { key: "brandsTitle", label: "Titolo elenco marchi contract", type: "text" },
      ] },
      seo,
    ],
  },
  {
    key: "dealers",
    label: "Per rivenditori",
    sections: { title: "Righe dei servizi", item: "servizio", titleLabel: "Servizio", textLabel: "Descrizione", ctaLabel: "Testo del link" },
    groups: [
      { legend: "Pagina", fields: [
        { key: "title", label: "Titolo", type: "text" },
        { key: "intro", label: "Introduzione", type: "textarea", rows: 3 },
        { key: "servicesTitle", label: "Titolo della sezione servizi", type: "text" },
        { key: "brandsTitle", label: "Titolo della sezione marchi", type: "text" },
      ] },
      { legend: "Come lavoriamo", fields: [
        { key: "methodTitle", label: "Titolo", type: "text" },
        { key: "step1Title", label: "Passo 1: parola", type: "text" }, { key: "step1Text", label: "Passo 1: continuazione", type: "text" },
        { key: "step2Title", label: "Passo 2: parola", type: "text" }, { key: "step2Text", label: "Passo 2: continuazione", type: "text" },
        { key: "step3Title", label: "Passo 3: parola", type: "text" }, { key: "step3Text", label: "Passo 3: continuazione", type: "text" },
        { key: "step4Title", label: "Passo 4: parola", type: "text" }, { key: "step4Text", label: "Passo 4: continuazione", type: "text" },
      ] },
      seo,
    ],
  },
  {
    key: "contact",
    label: "Contatti",
    groups: [
      { legend: "Pagina", fields: [
        { key: "title", label: "Titolo", type: "text" },
        { key: "intro", label: "Introduzione", type: "textarea", rows: 3 },
      ] },
      seo,
    ],
  },
  {
    key: "site",
    label: "Dati aziendali",
    groups: [
      { legend: "Usati in footer, contatti e Google", fields: [
        { key: "companyName", label: "Nome azienda", type: "text" },
        { key: "tagline", label: "Descrizione breve", type: "text" },
        { key: "address", label: "Indirizzo", type: "text" },
        { key: "city", label: "CAP e città", type: "text" },
        { key: "email", label: "Email", type: "email" },
        { key: "phone", label: "Telefono", type: "text" },
        { key: "vat", label: "Partita IVA", type: "text" },
        { key: "area", label: "Zona servita", type: "text" },
        { key: "replyTime", label: "Tempi di risposta", type: "text" },
        { key: "mapsUrl", label: "Link Google Maps", type: "url" },
      ] },
      { legend: "Social", fields: [
        { key: "instagram", label: "Instagram (indirizzo completo)", type: "url" },
        { key: "facebook", label: "Facebook (indirizzo completo)", type: "url" },
        { key: "linkedin", label: "LinkedIn aziendale (indirizzo completo)", type: "url" },
      ] },
    ],
  },
  { key: "faq", label: "FAQ", sections: { title: "Domande", item: "domanda", titleLabel: "Domanda", textLabel: "Risposta" }, groups: [] },
  { key: "privacy", label: "Privacy", sections: { title: "Sezioni", item: "sezione", titleLabel: "Titolo", textLabel: "Testo" }, groups: [] },
  { key: "cookie", label: "Cookie", sections: { title: "Sezioni", item: "sezione", titleLabel: "Titolo", textLabel: "Testo" }, groups: [] },
  { key: "terms", label: "Termini", sections: { title: "Sezioni", item: "sezione", titleLabel: "Titolo", textLabel: "Testo" }, groups: [] },
];
