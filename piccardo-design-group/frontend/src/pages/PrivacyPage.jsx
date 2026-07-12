import React, { useEffect, useState } from "react";
import Seo from "../components/Seo";
import { fetchPageContent } from "../services/apiServices";
import { PRIVACY_DEFAULT_SECTIONS, resolveSections } from "../data/pageDefaults";

const sectionTitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 600, marginTop: "32px", marginBottom: "12px", color: "#1a1a1a" };
const text = { color: "#555", lineHeight: 1.8, fontSize: "1rem" };

function PrivacyPage() {
  const [sections, setSections] = useState(PRIVACY_DEFAULT_SECTIONS);

  useEffect(() => {
    fetchPageContent("privacy")
      .then((page) => setSections(resolveSections(PRIVACY_DEFAULT_SECTIONS, page.sections, page.updatedAt)))
      .catch(() => {});
  }, []);

  return (
    <div style={{ fontFamily: "Raleway, sans-serif", minHeight: "70vh" }}>
      <Seo title="Privacy Policy" description="Informativa sulla privacy di Liguria Design Group ai sensi del GDPR (Reg. UE 2016/679)." />
      <div className="container py-5" style={{ maxWidth: "820px" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 600, marginBottom: "8px" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "#6e6e6e", fontSize: "0.9rem", marginBottom: "24px" }}>Ultimo aggiornamento: giugno 2026</p>

        {sections.map((s, i) => (
          <React.Fragment key={i}>
            <h2 style={sectionTitle}>{s.title}</h2>
            <p style={text}>{s.text}</p>
          </React.Fragment>
        ))}

        <p style={{ ...text, marginTop: "32px", fontStyle: "italic", fontSize: "0.9rem" }}>
          Questo testo è un modello di base. Si consiglia di farlo verificare da un professionista per la piena
          conformità alla tua specifica attività.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPage;
