import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faTimes, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const QUICK = [
  { q: "Come posso collaborare con voi?", a: "Compila il modulo nella pagina Contatti: ti ricontatteremo per valutare insieme la collaborazione.", to: "/contact" },
  { q: "Quali brand rappresentate?", a: "Rappresentiamo i migliori marchi di arredamento e illuminazione Made in Italy. Scopri tutti i partner nella pagina Brand.", to: "/materials" },
  { q: "Fate anche consulenza contract?", a: "Sì, offriamo consulenza per hotel, B&B, studentati e forniture importanti. Vedi la sezione Contract.", to: "/contracts" },
  { q: "Dove siete?", a: "Siamo in Via Alfieri 18, Imperia (IM). Trovi mappa e contatti nella pagina Contatti.", to: "/contact" },
];

const WELCOME = { from: "bot", text: "Ciao! 👋 Sono l'assistente di Liguria Design Group. Come posso aiutarti?" };

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const bodyRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, open]);

  const ask = (item) => {
    setMessages((m) => [...m, { from: "user", text: item.q }]);
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: item.a, to: item.to }]);
    }, 450);
  };

  return (
    <>
      {/* Bolla flottante */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Apri chat"
        style={{
          position: "fixed", bottom: "24px", right: "24px", width: "60px", height: "60px",
          borderRadius: "50%", border: "none", cursor: "pointer", zIndex: 1045,
          background: "linear-gradient(135deg, #c8a96e, #b3925a)", color: "#fff",
          boxShadow: "0 6px 24px rgba(0,0,0,0.28)", fontSize: "1.4rem",
          transition: "transform 0.25s", display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <FontAwesomeIcon icon={open ? faTimes : faComments} />
      </button>

      {/* Pannello chat */}
      <div
        style={{
          position: "fixed", bottom: "96px", right: "24px", width: "min(360px, calc(100vw - 48px))",
          maxHeight: "70vh", background: "#fff", borderRadius: "18px", zIndex: 1045,
          boxShadow: "0 18px 50px rgba(0,0,0,0.25)", overflow: "hidden",
          display: "flex", flexDirection: "column", fontFamily: "Raleway, sans-serif",
          transformOrigin: "bottom right",
          transform: open ? "scale(1)" : "scale(0.85)", opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none", transition: "transform 0.28s cubic-bezier(0.22,1,0.36,1), opacity 0.28s",
        }}
      >
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #1b2a4a, #24375f)", color: "#fff", padding: "18px 20px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontWeight: 600 }}>
            Assistente LDG
          </div>
          <div style={{ fontSize: "0.78rem", opacity: 0.8, display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            Online · risponde subito
          </div>
        </div>

        {/* Messaggi */}
        <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: "16px", background: "#fafafa", minHeight: "180px" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", marginBottom: "10px" }}>
              <div
                onClick={() => m.to && navigate(m.to)}
                role={m.to ? "button" : undefined}
                tabIndex={m.to ? 0 : undefined}
                onKeyDown={(e) => {
                  if (m.to && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    navigate(m.to);
                  }
                }}
                style={{
                  maxWidth: "80%", padding: "10px 14px", borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.from === "user" ? "#1b2a4a" : "#fff", color: m.from === "user" ? "#fff" : "#333",
                  border: m.from === "user" ? "none" : "1px solid #eee", fontSize: "0.9rem", lineHeight: 1.5,
                  cursor: m.to ? "pointer" : "default", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                {m.text}
                {m.to && <div style={{ color: "#8a6d3f", fontSize: "0.78rem", marginTop: "4px", fontWeight: 600 }}>Vai alla pagina →</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Domande rapide */}
        <div style={{ padding: "12px", borderTop: "1px solid #eee", background: "#fff", display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {QUICK.map((item) => (
            <button
              key={item.q}
              onClick={() => ask(item)}
              style={{
                border: "1px solid #ddd", background: "#fff", borderRadius: "20px", padding: "7px 12px",
                fontSize: "0.78rem", cursor: "pointer", color: "#444", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1b2a4a"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#1b2a4a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#444"; e.currentTarget.style.borderColor = "#ddd"; }}
            >
              {item.q}
            </button>
          ))}
        </div>

        {/* CTA contatti */}
        <button
          onClick={() => navigate("/contact")}
          style={{ border: "none", background: "#c8a96e", color: "#fff", padding: "12px", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", letterSpacing: "0.03em" }}
        >
          <FontAwesomeIcon icon={faPaperPlane} /> Scrivici un messaggio
        </button>
      </div>
    </>
  );
}

export default ChatBot;
