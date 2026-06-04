import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

// Modale di conferma elegante, riutilizzabile (sostituisce window.confirm)
function ConfirmModal({ show, title = "Conferma", message, confirmLabel = "Conferma", cancelLabel = "Annulla", danger = false, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1080, padding: "20px",
        animation: "pdg-fade 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "16px", maxWidth: "400px", width: "100%",
          padding: "28px 26px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", textAlign: "center",
          fontFamily: "Raleway, sans-serif", animation: "pdg-pop 0.22s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div
          style={{
            width: "54px", height: "54px", borderRadius: "50%", margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: danger ? "rgba(192,57,43,0.1)" : "rgba(200,169,110,0.15)",
            color: danger ? "#c0392b" : "#c8a96e", fontSize: "1.4rem",
          }}
        >
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </div>
        <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "1.4rem", marginBottom: "8px", color: "#1b2a4a" }}>
          {title}
        </h5>
        {message && <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "22px" }}>{message}</p>}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: "11px", borderRadius: "30px", border: "1px solid #ddd", background: "#fff", color: "#444", cursor: "pointer", fontSize: "0.92rem" }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "11px", borderRadius: "30px", border: "none", cursor: "pointer", fontSize: "0.92rem",
              color: "#fff", background: danger ? "#c0392b" : "linear-gradient(135deg,#1b2a4a,#24375f)",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pdg-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pdg-pop { from { opacity: 0; transform: scale(0.92) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  );
}

export default ConfirmModal;
