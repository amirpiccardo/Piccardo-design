import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Torna su"
      style={{
        position: "fixed",
        bottom: "24px",
        left: "24px",
        width: "46px",
        height: "46px",
        borderRadius: "50%",
        border: "none",
        background: "#1b2a4a",
        color: "#fff",
        cursor: "pointer",
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        zIndex: 1040,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#c8a96e")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#1b2a4a")}
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </button>
  );
}

export default ScrollTopButton;
