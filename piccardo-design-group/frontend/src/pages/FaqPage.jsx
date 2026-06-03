import React, { useState } from "react";
import Seo from "../components/Seo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const faqs = [
  {
    q: "Di cosa si occupa Piccardo Design Group?",
    a: "Distribuiamo brand di arredamento e design Made in Italy, offrendo soluzioni contract e consulenza ad aziende, architetti e progettisti.",
  },
  {
    q: "Come posso diventare partner o rivenditore?",
    a: "Contattaci tramite il modulo nella pagina Contatti: il nostro team ti ricontatterà per valutare insieme le opportunità di collaborazione.",
  },
  {
    q: "Lavorate anche su progetti contract?",
    a: "Sì. Realizziamo soluzioni su misura per hotel, uffici e spazi commerciali, seguendo il progetto in ogni fase.",
  },
  {
    q: "In quali zone operate?",
    a: "Operiamo su tutto il territorio italiano. Per richieste specifiche, contattaci e valuteremo insieme le esigenze.",
  },
  {
    q: "Posso ricevere il catalogo dei brand?",
    a: "Scrivici tramite il modulo di contatto indicando i brand di tuo interesse e ti forniremo le informazioni disponibili.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #eee" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          textAlign: "left",
          background: "none",
          border: "none",
          padding: "20px 0",
          fontSize: "1.1rem",
          fontWeight: 500,
          color: "#1a1a1a",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
        }}
        aria-expanded={open}
      >
        {q}
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{ transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "none", color: "#c8a96e" }}
        />
      </button>
      <div style={{ maxHeight: open ? "300px" : "0", overflow: "hidden", transition: "max-height 0.3s ease" }}>
        <p style={{ color: "#666", lineHeight: 1.8, paddingBottom: "20px", margin: 0 }}>{a}</p>
      </div>
    </div>
  );
}

function FaqPage() {
  return (
    <div style={{ fontFamily: "Raleway, sans-serif", minHeight: "70vh" }}>
      <Seo title="Domande frequenti" description="Risposte alle domande più frequenti su Piccardo Design Group: partnership, contract, cataloghi e zone servite." />
      <div style={{ textAlign: "center", padding: "60px 20px 20px", backgroundColor: "#fafafa", borderBottom: "1px solid #eee" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
          Domande frequenti
        </h1>
        <p style={{ color: "#666" }}>Tutto quello che vuoi sapere su di noi</p>
      </div>
      <div className="container py-5" style={{ maxWidth: "760px" }}>
        {faqs.map((f) => (
          <FaqItem key={f.q} {...f} />
        ))}
      </div>
    </div>
  );
}

export default FaqPage;
