import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { COOKIE_CONSENT_KEY as STORAGE_KEY } from "../utils/cookieConsent";

function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const decide = (value) => {
    localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new Event("cookie-consent-changed"));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Informativa cookie"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1060,
        background: "#1a1a1a",
        color: "#fff",
        padding: "18px 20px",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.25)",
        fontFamily: "Raleway, sans-serif",
      }}
    >
      <div
        className="container"
        style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}
      >
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#ddd", maxWidth: "680px", lineHeight: 1.6 }}>
          Utilizziamo cookie tecnici necessari al funzionamento del sito. Con il tuo consenso
          possiamo usare cookie di statistica per migliorare l'esperienza. Leggi la{" "}
          <Link to="/cookie-policy" style={{ color: "#c8a96e", textDecoration: "underline" }}>
            Cookie Policy
          </Link>
          .
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => decide("essential")}
            style={{
              padding: "10px 22px",
              borderRadius: "30px",
              border: "1px solid #555",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Solo necessari
          </button>
          <button
            onClick={() => decide("all")}
            style={{
              padding: "10px 22px",
              borderRadius: "30px",
              border: "none",
              background: "#c8a96e",
              color: "#1a1a1a",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            Accetta tutti
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieBanner;
