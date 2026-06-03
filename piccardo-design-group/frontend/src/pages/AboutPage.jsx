import React from "react";
import aboutImage from "../assets/sfondoabout.png";
import ChatBot from "../components/ChatBot";

function AboutPage() {
  const pageStyle = {
    fontFamily: "Raleway, sans-serif",
    color: "#1a1a1a",
  };

  const heroStyle = {
    position: "relative",
    width: "100%",
    height: "clamp(260px, 40vh, 400px)",
    backgroundImage: `url(${aboutImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const heroOverlay = {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
  };

  const headingStyle = {
    position: "relative",
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    fontSize: "clamp(2.2rem, 6vw, 4rem)",
    color: "#fff",
    margin: 0,
    letterSpacing: "0.02em",
  };

  const textStyle = {
    fontFamily: "Raleway, sans-serif",
    fontWeight: 300,
    fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
    lineHeight: "1.9em",
    marginBottom: "20px",
    textAlign: "left",
    color: "#444",
  };

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <div style={heroOverlay} />
        <h1 style={headingStyle}>Chi Siamo</h1>
      </div>

      <div className="container py-5" style={{ maxWidth: "820px" }}>
        <p style={textStyle}>
          Il <strong>Piccardo Design Group</strong> è il partner con cui collaborare per
          raggiungere al meglio i tuoi obiettivi aziendali nel settore del design. Siamo
          consulenti esperti e determinati, un team unito che lavora professionalmente per
          intercettare le esigenze del mercato e offrire soluzioni innovative ai nostri partner.
        </p>
        <p style={textStyle}>
          Crediamo nelle relazioni durature con clienti, architetti e designer, nella crescita
          sostenibile e nella forza dell'eccellenza del design e del Made in Italy. Lavoriamo con
          serietà e affidabilità per offrire soluzioni personalizzate, di alta qualità e servizi
          di supporto alle imprese in ogni fase del loro percorso.
        </p>
        <p style={textStyle}>
          Collaborare con noi significa lavorare con un team orientato ai dettagli, composto da
          professionisti con trent'anni di esperienza nel settore, capace di stabilire un dialogo
          dinamico tra i propri clienti e le aziende partner, sfruttando nuove opportunità e
          tecnologie.
        </p>
        <p style={{ ...textStyle, fontWeight: 400, color: "#1a1a1a" }}>
          Affidati a noi per gestire la distribuzione dei tuoi marchi di arredamento.{" "}
          Scopri le nostre aziende partner o contattaci per collaborare.
        </p>
      </div>

      <ChatBot />
    </div>
  );
}

export default AboutPage;
