import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Raleway, sans-serif",
        textAlign: "center",
        padding: "40px 20px",
      }}
    >
      <h1 style={{ fontSize: "6rem", fontWeight: 200, color: "#ccc", margin: 0 }}>404</h1>
      <h2 style={{ fontWeight: 300, color: "#333", marginBottom: "16px" }}>Pagina non trovata</h2>
      <p style={{ color: "#5a5a5a", marginBottom: "32px" }}>
        La pagina che stai cercando non esiste o è stata spostata.
      </p>
      <Link
        to="/"
        style={{
          backgroundColor: "#000",
          color: "#fff",
          padding: "12px 32px",
          borderRadius: "30px",
          textDecoration: "none",
          fontSize: "0.95rem",
          letterSpacing: "0.05em",
        }}
      >
        Torna alla Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
