import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const NewsletterBanner = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleClose = () => {
    setShowBanner(false);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Iscrizione avvenuta con successo!");
      } else {
        setMessage(data.message);
      }
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      setMessage("Errore durante l'iscrizione.");
    }
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(5px)",
  };

  const bannerStyle = {
    background: "#d2b48c",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "80%",
    maxWidth: "600px",
    textAlign: "center",
    position: "relative",
    color: "#fff",
    fontFamily: "'Playfair Display', serif",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    color: "#333",
  };

  const submitButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.3s",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#fff",
  };

  return (
    <div>
      {showBanner && (
        <div style={overlayStyle}>
          <div style={bannerStyle}>
            <button style={closeButtonStyle} onClick={handleClose}>
              &times;
            </button>
            <h3>Iscriviti alla nostra Newsletter!</h3>
            <p>
              Inserisci la tua email per rimanere aggiornato sulle ultime novità
              e offerte speciali.
            </p>
            <form onSubmit={handleSubmit} style={formStyle}>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
                placeholder="Inserisci la tua email"
              />
              <button
                type="submit"
                style={submitButtonStyle}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{ marginRight: "10px" }}
                />
                Iscriviti
              </button>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterBanner;
