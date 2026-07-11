import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const STORAGE_KEY = "pdg_newsletter_dismissed";
const SHOW_DELAY_MS = 18000; // 18s
const REMEMBER_DAYS = 7;

const NewsletterBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Non mostrare se l'utente l'ha già chiuso/iscritto di recente
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - Number(dismissedAt);
      if (elapsed < REMEMBER_DAYS * 24 * 60 * 60 * 1000) return;
    }
    const timer = setTimeout(() => setShowBanner(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const remember = () => localStorage.setItem(STORAGE_KEY, String(Date.now()));

  const handleClose = () => {
    remember();
    setShowBanner(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("✓ Iscrizione avvenuta con successo!");
        remember();
        setTimeout(() => setShowBanner(false), 1800);
      } else {
        setMessage(data.message || "Errore durante l'iscrizione.");
      }
    } catch {
      setMessage("Errore di connessione. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  if (!showBanner) return null;

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1050,
    backdropFilter: "blur(4px)",
    padding: "20px",
  };

  const bannerStyle = {
    background: "#fff",
    padding: "40px 32px",
    borderRadius: "16px",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
    width: "100%",
    maxWidth: "460px",
    textAlign: "center",
    position: "relative",
    color: "#1a1a1a",
    fontFamily: "Raleway, sans-serif",
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    margin: "8px 0 16px",
    fontSize: "1rem",
    borderRadius: "30px",
    border: "1px solid #ddd",
    color: "#333",
    outline: "none",
  };

  const submitButtonStyle = {
    width: "100%",
    padding: "13px 20px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    cursor: loading ? "default" : "pointer",
    fontSize: "0.95rem",
    letterSpacing: "0.05em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "14px",
    right: "16px",
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#6e6e6e",
    lineHeight: 1,
  };

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div style={bannerStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={handleClose} aria-label="Chiudi">
          &times;
        </button>
        <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: "1.8rem", color: "#c8a96e", marginBottom: "12px" }} />
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "1.8rem", marginBottom: "8px" }}>
          Resta aggiornato
        </h3>
        <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "20px" }}>
          Iscriviti alla newsletter per ricevere novità, nuovi brand e ispirazioni di design.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            placeholder="La tua email"
          />
          <button type="submit" style={submitButtonStyle} disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm" />}
            {loading ? "Invio..." : "Iscriviti"}
          </button>
        </form>
        {message && (
          <p style={{ marginTop: "14px", fontSize: "0.9rem", color: message.startsWith("✓") ? "#2e7d32" : "#c0392b" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default NewsletterBanner;
