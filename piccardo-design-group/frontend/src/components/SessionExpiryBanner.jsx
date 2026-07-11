import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";

const WARNING_WINDOW_MS = 2 * 60 * 1000; // avvisa 2 minuti prima della scadenza

function SessionExpiryBanner() {
  const { expiresAt } = useAuth();
  const [msLeft, setMsLeft] = useState(null);

  useEffect(() => {
    if (!expiresAt) {
      setMsLeft(null);
      return;
    }
    const tick = () => setMsLeft(expiresAt - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (msLeft === null || msLeft > WARNING_WINDOW_MS || msLeft <= 0) return null;

  const seconds = Math.max(0, Math.ceil(msLeft / 1000));
  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div
      style={{
        position: "sticky", top: 0, zIndex: 1050,
        background: "#fff3cd", color: "#664d03", borderBottom: "1px solid #ffe69c",
        padding: "10px 20px", fontSize: "0.9rem", fontFamily: "Raleway, sans-serif",
        display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
      }}
    >
      <FontAwesomeIcon icon={faTriangleExclamation} />
      Sessione in scadenza tra {mm}:{ss} — salva le modifiche in corso, poi effettua di nuovo l'accesso.
    </div>
  );
}

export default SessionExpiryBanner;
