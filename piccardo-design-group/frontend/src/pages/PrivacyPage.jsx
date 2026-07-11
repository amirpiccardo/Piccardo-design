import React from "react";
import Seo from "../components/Seo";

const sectionTitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 600, marginTop: "32px", marginBottom: "12px", color: "#1a1a1a" };
const text = { color: "#555", lineHeight: 1.8, fontSize: "1rem" };

function PrivacyPage() {
  return (
    <div style={{ fontFamily: "Raleway, sans-serif", minHeight: "70vh" }}>
      <Seo title="Privacy & Cookie Policy" description="Informativa sulla privacy e sui cookie di Liguria Design Group ai sensi del GDPR (Reg. UE 2016/679)." />
      <div className="container py-5" style={{ maxWidth: "820px" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 600, marginBottom: "8px" }}>
          Privacy &amp; Cookie Policy
        </h1>
        <p style={{ color: "#999", fontSize: "0.9rem", marginBottom: "24px" }}>Ultimo aggiornamento: giugno 2026</p>

        <h2 style={sectionTitle}>1. Titolare del trattamento</h2>
        <p style={text}>
          Il titolare del trattamento dei dati è Liguria Design Group, Via Alfieri 18, 18100 Imperia (IM),
          P.IVA 01587610088. Per qualsiasi richiesta è possibile scrivere a info@liguriadesigngroup.it.
        </p>

        <h2 style={sectionTitle}>2. Dati raccolti</h2>
        <p style={text}>
          Raccogliamo i dati che ci fornisci volontariamente tramite il modulo di contatto (nome, email,
          messaggio) e l'iscrizione alla newsletter (email). Non raccogliamo categorie particolari di dati.
        </p>

        <h2 style={sectionTitle}>3. Finalità e base giuridica</h2>
        <p style={text}>
          I dati di contatto sono trattati per rispondere alle tue richieste (base giuridica: esecuzione di
          misure precontrattuali). L'email per la newsletter è trattata sulla base del tuo consenso, revocabile
          in qualsiasi momento.
        </p>

        <h2 style={sectionTitle}>4. Conservazione</h2>
        <p style={text}>
          I dati sono conservati per il tempo necessario alle finalità indicate e comunque non oltre i termini
          previsti dalla legge. Puoi richiederne la cancellazione in qualsiasi momento.
        </p>

        <h2 style={sectionTitle}>5. Cookie</h2>
        <p style={text}>
          Il sito utilizza <strong>cookie tecnici</strong> necessari al funzionamento (non richiedono consenso) e,
          previo consenso, <strong>cookie di statistica</strong> per analizzare in forma aggregata l'utilizzo del
          sito. Puoi gestire le preferenze tramite il banner cookie o le impostazioni del browser.
        </p>

        <h2 style={sectionTitle}>6. Diritti dell'interessato</h2>
        <p style={text}>
          Ai sensi degli artt. 15-22 del GDPR hai diritto di accesso, rettifica, cancellazione, limitazione,
          portabilità e opposizione. Per esercitarli, scrivi a info@liguriadesigngroup.it. Hai inoltre diritto di
          proporre reclamo al Garante per la protezione dei dati personali.
        </p>

        <p style={{ ...text, marginTop: "32px", fontStyle: "italic", fontSize: "0.9rem" }}>
          Questo testo è un modello di base. Si consiglia di farlo verificare da un professionista per la piena
          conformità alla tua specifica attività.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPage;
