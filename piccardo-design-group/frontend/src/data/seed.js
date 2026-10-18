// Contenuti iniziali del sito.
// Servono a due cose: popolare Supabase la prima volta (scripts/make-seed-sql.mjs genera
// supabase/seed.sql da questo file) e fare da riserva se Supabase non risponde,
// così il sito non resta mai vuoto.

const foto = (name) => ({ url: `/img/foto/${name}-1600.webp`, alt: "" });
const img = (name, alt) => ({ ...foto(name), alt });

export const SEED_BRANDS = [
  {
    slug: "lapalma",
    name: "Lapalma",
    logo: "/img/brands/lapalma.webp",
    website: "https://www.lapalma.it",
    category: "Sedute e tavoli",
    description: "Sedute, sgabelli, tavoli e divani di design italiano, per la casa e per il contract.",
    photos: [img("lounge", "Area lounge con sedute Lapalma"), img("ufficio", "Ufficio arredato")],
    position: 1,
  },
  {
    slug: "pintdecor",
    name: "Pintdecor",
    logo: "/img/brands/pintdecor.jpg",
    website: "https://www.pintdecor.it",
    category: "Pannelli a parete",
    description: "Pannelli decorativi a parete Made in Italy, per abitazioni, negozi e locali.",
    photos: [img("bar-pannelli", "Pannelli decorativi Pintdecor in un bar")],
    position: 2,
  },
  {
    slug: "gb-group",
    name: "GB Group",
    logo: "/img/brands/gbgroupe.png",
    website: "https://gbgroupe.com",
    category: "Bagno",
    description: "Arredo bagno: mobili, lavabi e complementi.",
    photos: [],
    position: 3,
  },
  {
    slug: "imab-group",
    name: "Imab Group",
    logo: "/img/brands/imab.png",
    website: "https://www.imab.com",
    category: "Arredo casa",
    description: "Arredamento per la casa: camere, armadi e zona giorno.",
    photos: [],
    position: 4,
  },
  { slug: "team-italia", name: "Team Italia", logo: "/img/brands/teamitalia.png", website: "https://www.teamitaliailluminazione.it", category: "Illuminazione", description: "Lampade a sospensione, da terra, da parete, da soffitto e da tavolo, con una lunga esperienza nei sistemi LED.", photos: [], position: 5 },
  { slug: "confort-plus", name: "Confort Plus", logo: "/img/brands/confortplus.png", website: "https://confortplus.it", category: "Divani letto e letti", description: "Divani, divani letto, letti e materassi prodotti in Italia, con una linea dedicata al contract.", photos: [], position: 6 },
  { slug: "effe2", name: "Effe2", logo: "/img/brands/effe2.jpg", website: "https://www.effe2srl.it", category: "Elettrodomestici e complementi", description: "Distribuzione di elettrodomestici da incasso e complementi d'arredo per mobilieri e rivenditori.", photos: [], position: 7 },
  { slug: "san-lorenzo-home", name: "San Lorenzo Home", logo: "/img/brands/sanlorenzo.png", website: "https://sanlorenzohome.it", category: "Letti e materassi", description: "Letti, materassi e accessori per il riposo, prodotti in Toscana.", photos: [], position: 8 },
];

export const SEED_TEAM = [
  {
    name: "Gabriele Piccardo",
    role: "Co-fondatore e consulente",
    photo: "/img/team/gabriele-800.webp",
    bio: "Ha rappresentato negli anni marchi di mobili, complementi d'arredo e illuminazione, collaborando con aziende di alta gamma e studi di progettazione. Segue anche il marketing dei rivenditori.",
    linkedin: "",
    position: 1,
  },
  {
    name: "Francesca Zabbia",
    role: "Co-fondatrice e consulente",
    photo: "/img/team/francesca-800.webp",
    bio: "Arredatrice e venditrice nei negozi della provincia della Spezia dal 2005, poi in agenzie di rappresentanza. Dal 2025 è mandataria di marchi di arredamento per la casa, esperta di progettazione e consulenza d'arredo.",
    linkedin: "",
    position: 2,
  },
];

export const SEED_CONTRACT_TYPES = [
  { title: "Ristoranti e bar", text: "Sedute, tavoli, pannelli e luci per sale, banconi e dehors.", photo: "/img/foto/ristorante-1600.webp", position: 1 },
  { title: "Hotel e B&B", text: "Camere, sale colazioni e spazi comuni, dal progetto alla consegna.", photo: "/img/foto/sala-pranzo-1600.webp", position: 2 },
  { title: "Studentati e spazi comuni", text: "Arredi resistenti per aree studio, lounge e zone condivise.", photo: "/img/foto/lounge-1600.webp", position: 3 },
  { title: "Uffici", text: "Postazioni, sale riunioni e accoglienza.", photo: "/img/foto/ufficio-1600.webp", position: 4 },
];

export const SEED_CONTRACT_BRANDS = [];

const lines = (...l) => l.join("\n");

export const SEED_PAGES = {
  site: {
    fields: {
      companyName: "Liguria Design Group",
      tagline: "Agenzia di rappresentanza arredamento e illuminazione",
      address: "Via Vittorio Alfieri 18",
      city: "18100 Imperia (IM)",
      email: "info@liguriadesigngroup.it",
      phone: "",
      vat: "01587610088",
      area: "Liguria e basso Piemonte",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Via+Vittorio+Alfieri+18+Imperia",
      instagram: "",
      facebook: "",
      linkedin: "",
      replyTime: "Rispondiamo entro un giorno lavorativo.",
    },
    sections: [],
  },
  home: {
    fields: {
      topPhoto: foto("living"),
      heroTitle: "Arredo e luce per chi vende arredo e luce",
      heroText: "Agenzia di rappresentanza a Imperia: portiamo marchi italiani di arredo, bagno e illuminazione nei negozi di Liguria e basso Piemonte.",
      heroIntro: "Agenzia di rappresentanza, Imperia",
      heroAreas: lines("Liguria", "Basso Piemonte"),
      heroServices: lines("Rappresentanza marchi", "Preventivi e consulenza", "Forniture contract"),
      sheet1Title: "Living",
      sheet1Images: [foto("living"), foto("libreria"), foto("sala-pranzo"), foto("cucina-lago")],
      sheet2Title: "Contract",
      sheet2Images: [foto("lounge"), foto("ufficio"), foto("ristorante"), foto("bar-pannelli"), foto("showroom")],
      sheet3Title: "Cucine e bagno",
      sheet3Images: [foto("cucina-legno"), foto("cucina-scura"), foto("bagno-blu"), foto("armadio")],
      dirTitle: "Il campionario completo",
      dirIntro: "Ogni parte del nostro lavoro ha la sua pagina.",
      dirBrandsText: "I marchi che portiamo nei negozi, uno per pagina.",
      dirContractText: "Forniture per hotel, B&B, studentati, uffici e locali.",
      dirAboutText: "Chi siamo, come lavoriamo e dove.",
      dirAboutPhoto: foto("libreria"),
      dirDealersText: "Cataloghi, listini, preventivi e visite in negozio.",
      dirDealersPhoto: foto("showroom"),
      dirContactText: "Imperia, Liguria e basso Piemonte.",
      dirContactPhoto: foto("cucina-lago"),
      closingTitle: "Parliamone",
      closingText: "Siete un rivenditore, un progettista o un'azienda che cerca un agente in Liguria? Scriveteci.",
      seoTitle: "Rappresentanza arredamento e illuminazione in Liguria",
      seoDescription: "Liguria Design Group, agenzia di rappresentanza a Imperia: marchi italiani di arredo, bagno e illuminazione per rivenditori e contract in Liguria e basso Piemonte.",
    },
    sections: [],
  },
  about: {
    fields: {
      headerPhoto: foto("cucina-lago"),
      title: "Chi siamo",
      introTitle: "Cosa facciamo",
      intro1: "Siamo un'agenzia di rappresentanza: affianchiamo i rivenditori di arredamento e illuminazione dal primo contatto con un marchio fino all'assistenza dopo la vendita.",
      aboutPhoto: foto("libreria"),
      teamTitle: "Le persone",
      teamSubtitle: "Gabriele e Francesca seguono personalmente ogni rivenditore e ogni progetto.",
      territoryTitle: "Dove lavoriamo",
      territoryText: "Da Imperia visitiamo i negozi della costa ligure e dell'entroterra piemontese.",
      territoryLiguria: lines("Imperia", "Savona", "Genova", "La Spezia"),
      territoryPiemonte: lines("Cuneo", "Asti", "Alessandria"),
      seoTitle: "Chi siamo",
      seoDescription: "Gabriele Piccardo e Francesca Zabbia: chi c'è dietro Liguria Design Group, agenzia di rappresentanza arredamento a Imperia.",
    },
    sections: [
      { title: "Rappresentanza marchi", text: "Facciamo conoscere ai negozi i marchi che rappresentiamo, con campioni, cataloghi e novità." },
      { title: "Preventivi e progetti", text: "Progettiamo con 3CAD e Metron e prepariamo preventivi pronti da presentare al cliente finale." },
      { title: "Forniture contract", text: "Per hotel, B&B, studentati e locali seguiamo la fornitura dal sopralluogo alla consegna." },
      { title: "Assistenza", text: "Restiamo il riferimento per ordini, consegne e problemi anche dopo la vendita." },
    ],
  },
  brands: {
    fields: {
      title: "I marchi",
      intro: "I marchi italiani di arredo, bagno, pannelli e illuminazione che portiamo nei negozi di Liguria e basso Piemonte.",
      seoTitle: "Marchi rappresentati",
      seoDescription: "Lapalma, Pintdecor, GB Group, Imab Group e gli altri marchi di arredamento rappresentati da Liguria Design Group in Liguria e basso Piemonte.",
    },
    sections: [],
  },
  contract: {
    fields: {
      headerPhoto: foto("ristorante"),
      title: "Contract",
      intro: "Forniture per hotel, B&B, studentati, uffici e locali. Scegliamo i marchi, prepariamo il preventivo e seguiamo la consegna.",
      typesTitle: "Per chi lavoriamo",
      typesIntro: "Passate sopra un tipo di progetto per vedere un esempio.",
      brandsTitle: "Marchi per il contract",
      seoTitle: "Forniture contract per hotel e locali",
      seoDescription: "Arredamento e illuminazione contract in Liguria e basso Piemonte: hotel, B&B, studentati, uffici, ristoranti e bar.",
    },
    sections: [],
  },
  dealers: {
    fields: {
      title: "Per rivenditori",
      intro: "Avete un negozio di arredamento? Ecco cosa possiamo fare per voi.",
      servicesTitle: "Servizi",
      methodTitle: "Come lavoriamo",
      step1Title: "Ascoltiamo",
      step1Text: "cosa vende il negozio e cosa chiedono i suoi clienti.",
      step2Title: "Selezioniamo",
      step2Text: "i marchi adatti e portiamo i campioni.",
      step3Title: "Prepariamo",
      step3Text: "progetto e preventivo con 3CAD o Metron.",
      step4Title: "Restiamo",
      step4Text: "il riferimento per ordini, consegne e assistenza.",
      brandsTitle: "I marchi che portiamo",
      seoTitle: "Servizi per rivenditori di arredamento",
      seoDescription: "Cataloghi, listini, preventivi con 3CAD e Metron e visite in negozio per rivenditori di arredamento in Liguria e basso Piemonte.",
    },
    sections: [
      { title: "Cataloghi", text: "Le collezioni aggiornate di ogni marchio.", cta: "Richiedi" },
      { title: "Listini", text: "Prezzi riservati ai rivenditori, su richiesta.", cta: "Richiedi" },
      { title: "Preventivi", text: "Progetto con 3CAD o Metron e preventivo pronto per il cliente.", cta: "Invia un progetto" },
      { title: "Visita in negozio", text: "Campioni e novità, su appuntamento.", cta: "Prenota" },
    ],
  },
  contact: {
    fields: {
      title: "Scriveteci",
      intro: "Raccontateci di cosa avete bisogno: vi rispondiamo noi, di persona.",
      seoTitle: "Contatti",
      seoDescription: "Contatta Liguria Design Group: Via Vittorio Alfieri 18, Imperia. Agenzia di rappresentanza arredamento per Liguria e basso Piemonte.",
    },
    sections: [],
  },
  privacy: {
    fields: {},
    sections: [
      { title: "Titolare del trattamento", text: "Il titolare del trattamento dei dati è Liguria Design Group, Via Vittorio Alfieri 18, 18100 Imperia (IM), P.IVA 01587610088. Per qualsiasi richiesta è possibile scrivere a info@liguriadesigngroup.it." },
      { title: "Dati raccolti", text: "Raccogliamo i dati che ci fornisci volontariamente tramite il modulo di contatto (nome, email, telefono se indicato, messaggio) e l'iscrizione alla newsletter (email). Non raccogliamo categorie particolari di dati." },
      { title: "Finalità e base giuridica", text: "I dati di contatto sono trattati per rispondere alle tue richieste (base giuridica: esecuzione di misure precontrattuali). L'email per la newsletter è trattata sulla base del tuo consenso, revocabile in qualsiasi momento." },
      { title: "Fornitori", text: "I dati sono conservati su Supabase (database) e il sito è ospitato su Vercel. I messaggi del modulo arrivano anche per email alla casella info@liguriadesigngroup.it." },
      { title: "Conservazione", text: "I dati sono conservati per il tempo necessario alle finalità indicate e comunque non oltre i termini previsti dalla legge. Puoi richiederne la cancellazione in qualsiasi momento." },
      { title: "Diritti dell'interessato", text: "Ai sensi degli artt. 15-22 del GDPR hai diritto di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione. Per esercitarli, scrivi a info@liguriadesigngroup.it. Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali." },
    ],
  },
  cookie: {
    fields: {},
    sections: [
      { title: "Cosa sono i cookie", text: "I cookie sono piccoli file di testo che i siti visitati inviano al dispositivo dell'utente, dove vengono memorizzati per essere ritrasmessi agli stessi siti alla visita successiva." },
      { title: "Cookie tecnici", text: "Il sito usa solo strumenti tecnici necessari al funzionamento, come la memoria della tua scelta sul consenso. Non richiedono consenso." },
      { title: "Statistiche", text: "Solo se acconsenti, registriamo in forma anonima le pagine visitate per capire quali contenuti sono più utili. Non usiamo cookie di profilazione né strumenti pubblicitari." },
      { title: "Gestione delle preferenze", text: "Puoi cambiare la tua scelta in qualsiasi momento dal link \"Preferenze cookie\" nel footer, oppure cancellando i dati del sito dalle impostazioni del browser." },
    ],
  },
  terms: {
    fields: {},
    sections: [
      { title: "Oggetto", text: "I presenti termini regolano l'utilizzo del sito di Liguria Design Group. Navigando il sito accetti le presenti condizioni." },
      { title: "Proprietà intellettuale", text: "Tutti i contenuti del sito (testi, immagini, logo, marchi) sono di proprietà di Liguria Design Group o dei rispettivi titolari e non possono essere riprodotti senza autorizzazione." },
      { title: "Limitazione di responsabilità", text: "Le informazioni presenti sul sito sono fornite a scopo informativo. Liguria Design Group non garantisce l'assenza di errori e non è responsabile per eventuali danni derivanti dall'uso del sito." },
      { title: "Link a siti esterni", text: "Il sito può contenere link a siti di terzi, come i marchi rappresentati. Non siamo responsabili dei contenuti o delle policy di tali siti." },
      { title: "Legge applicabile", text: "I presenti termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente il foro di Imperia." },
    ],
  },
  faq: {
    fields: {},
    sections: [
      { title: "Di cosa si occupa Liguria Design Group?", text: "Siamo un'agenzia di rappresentanza nel settore mobili e illuminazione. Rappresentiamo aziende italiane e affianchiamo rivenditori e negozianti con consulenza, preventivi e assistenza quotidiana." },
      { title: "Come posso diventare rivenditore o richiedere una consulenza?", text: "Scriveteci dal modulo nella pagina Contatti: vi ricontattiamo per valutare insieme la collaborazione." },
      { title: "Fate anche forniture contract?", text: "Sì. Seguiamo hotel, B&B, studentati, uffici e locali che hanno bisogno di forniture importanti di arredamento e illuminazione." },
      { title: "In quali zone lavorate?", text: "In Liguria e nel basso Piemonte. Per richieste fuori zona scriveteci e valutiamo insieme." },
      { title: "Con quali software progettate?", text: "Usiamo 3CAD e Metron per progetti e preventivi pronti da presentare al cliente finale." },
      { title: "Posso avere cataloghi e listini?", text: "Sì, se siete un rivenditore. Chiedeteli dalla pagina Per rivenditori o dal modulo di contatto indicando i marchi che vi interessano." },
    ],
  },
};
