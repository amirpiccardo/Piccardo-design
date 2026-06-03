import React from "react";
import Seo from "../components/Seo";

const sectionTitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 600, marginTop: "32px", marginBottom: "12px", color: "#1a1a1a" };
const text = { color: "#555", lineHeight: 1.8, fontSize: "1rem" };

function TermsPage() {
  return (
    <div style={{ fontFamily: "Raleway, sans-serif", minHeight: "70vh" }}>
      <Seo title="Termini e Condizioni" description="Termini e condizioni d'uso del sito Piccardo Design Group." />
      <div className="container py-5" style={{ maxWidth: "820px" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 600, marginBottom: "8px" }}>
          Termini e Condizioni
        </h1>
        <p style={{ color: "#999", fontSize: "0.9rem", marginBottom: "24px" }}>Ultimo aggiornamento: giugno 2026</p>

        <h2 style={sectionTitle}>1. Oggetto</h2>
        <p style={text}>
          I presenti termini regolano l'utilizzo del sito di Piccardo Design Group. Navigando il sito accetti le
          presenti condizioni.
        </p>

        <h2 style={sectionTitle}>2. Proprietà intellettuale</h2>
        <p style={text}>
          Tutti i contenuti del sito (testi, immagini, logo, marchi) sono di proprietà di Piccardo Design Group o
          dei rispettivi titolari e non possono essere riprodotti senza autorizzazione.
        </p>

        <h2 style={sectionTitle}>3. Limitazione di responsabilità</h2>
        <p style={text}>
          Le informazioni presenti sul sito sono fornite a scopo informativo. Piccardo Design Group non garantisce
          l'assenza di errori e non è responsabile per eventuali danni derivanti dall'uso del sito.
        </p>

        <h2 style={sectionTitle}>4. Link a siti esterni</h2>
        <p style={text}>
          Il sito può contenere link a siti di terzi (es. brand partner). Non siamo responsabili dei contenuti o
          delle policy di tali siti.
        </p>

        <h2 style={sectionTitle}>5. Legge applicabile</h2>
        <p style={text}>
          I presenti termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente il foro di
          Imperia.
        </p>

        <p style={{ ...text, marginTop: "32px", fontStyle: "italic", fontSize: "0.9rem" }}>
          Questo testo è un modello di base. Si consiglia di farlo verificare da un professionista.
        </p>
      </div>
    </div>
  );
}

export default TermsPage;
