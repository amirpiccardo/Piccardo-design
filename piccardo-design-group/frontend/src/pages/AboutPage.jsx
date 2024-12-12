import React from "react";
import aboutImage from "../assets/sfondoabout.png";
import ChatBot from "../components/ChatBot";
function AboutPage() {
  const pageStyle = {
    backgroundColor: "#f8f9fa",
    fontFamily: "Raleway",
    color: "#333",
    padding: "20px",
    backgroundImage: `url(${aboutImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const columnStyle = {
    flex: "1",
    padding: "10px",
  };

  const centerColumnStyle = {
    flex: "3",
    padding: "20px",
  };

  const headingStyle = {
    fontFamily: "Raleway, serif",
    fontWeight: "400",
    fontSize: "4rem",
    lineHeight: "1.4em",
    marginBottom: "20px",
    textAlign: "center",
    color: "#2c3e50",
  };

  const textStyle = {
    fontFamily: "Georgia, serif",
    fontWeight: "300",
    fontSize: "1.3rem",
    lineHeight: "1.8em",
    marginBottom: "20px",
    textAlign: "justify",
  };

  return (
    <div>
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={columnStyle}></div>
          <div style={centerColumnStyle}>
            <h1 style={headingStyle}>Chi Siamo</h1>
            <p style={textStyle}>
              Il Piccardo Design Group è il partner con cui collaborare per
              raggiungere al meglio i tuoi obiettivi aziendali nel settore del
              design. Siamo consulenti esperti e determinati, un team unito che
              lavora professionalmente per intercettare le esigenze del mercato
              e offrire soluzioni innovative ai nostri partner. Crediamo nelle
              relazioni durature con clienti, architetti, designer, nella
              crescita sostenibile e nella forza dell'eccellenza del design e
              del Made in Italy. Lavoriamo con serietà e affidabilità per
              offrire soluzioni personalizzate, di alta qualità e servizi di
              supporto alle imprese in ogni fase del loro percorso. Collaborare
              con noi significa lavorare con un team orientato ai dettagli,
              composto da professionisti con trent'anni di esperienza nel
              settore, ma che allo stesso tempo ha compreso l'evoluzione del
              mercato ed è stato in grado di stabilire un dialogo dinamico tra i
              propri clienti e le aziende partner, sfruttando nuove opportunità
              e tecnologie. Affidati a noi per gestire la distribuzione dei tuoi
              marchi di arredamento, contattaci. Scopri le nostre aziende
              partner.
            </p>
          </div>
          <div style={columnStyle}></div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
}

export default AboutPage;
