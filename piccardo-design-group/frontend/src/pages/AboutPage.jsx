import React, { useEffect, useState } from "react";
import aboutImage from "../assets/sfondoabout.png";
import ChatBot from "../components/ChatBot";
import Seo from "../components/Seo";
import { mediaUrl } from "../utils/media";
import { FaLinkedin } from "react-icons/fa";

function AboutPage() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/team`)
      .then((r) => r.json())
      .then((data) => setTeam(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const pageStyle = { fontFamily: "Raleway, sans-serif", color: "#1a1a1a" };

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

  const heroOverlay = { position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" };

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

  const teamHeadingStyle = {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
    marginBottom: "12px",
    textAlign: "center",
    color: "#1a1a1a",
  };

  return (
    <div style={pageStyle}>
      <Seo
        title="Chi Siamo"
        description="Liguria Design Group: agenzia di rappresentanza nel settore arredamento e illuminazione, guidata da Gabriele Piccardo e Francesca Zabbia."
      />
      <div style={heroStyle}>
        <div style={heroOverlay} />
        <h1 style={headingStyle}>Chi Siamo</h1>
      </div>

      <div className="container py-5" style={{ maxWidth: "820px" }}>
        <p style={textStyle}>
          <strong>Liguria Design Group</strong> lavora per creare sinergie tra azienda,
          rivenditore e cliente, elevando l'arredamento e l'illuminazione con esperienza
          e passione.
        </p>
        <p style={textStyle}>
          Siamo un'agenzia di rappresentanza: rappresentiamo aziende leader nel settore
          mobili e illuminazione, occupandoci di tutta la casa. Ci occupiamo di
          preventivazione e consulenza, supportando rivenditori e negozianti nel lavoro
          quotidiano con la nostra esperienza nel mondo del design, dell'arredamento e
          del marketing.
        </p>
        <p style={textStyle}>
          Presentiamo la nostra esperienza nel settore dell'arredamento e illuminazione,
          unita a un approccio personalizzato che valorizza qualità e innovazione, per
          soddisfare pienamente le esigenze dei clienti della Liguria e del basso Piemonte.
        </p>
      </div>

      {team.length > 0 && (
        <div className="container pb-5">
          <h2 style={teamHeadingStyle}>Il Nostro Team</h2>
          <p style={{ textAlign: "center", color: "#5a5a5a", marginBottom: "40px" }}>
            Conosci i professionisti che guidano Liguria Design Group con passione e competenza.
          </p>
          <div className="row justify-content-center g-4">
            {team.map((member) => (
              <div className="col-12 col-md-6" key={member._id}>
                <div className="row g-0 h-100 align-items-stretch" style={{ border: "1px solid #eee", borderRadius: "12px", overflow: "hidden" }}>
                  <div className="col-5">
                    <img
                      src={mediaUrl(member.photo)}
                      alt={member.name}
                      style={{ width: "100%", height: "100%", minHeight: "260px", objectFit: "cover" }}
                      loading="lazy"
                    />
                  </div>
                  <div className="col-7 d-flex flex-column justify-content-center" style={{ padding: "24px" }}>
                    <p style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0, color: "#1b2a4a" }}>{member.name}</p>
                    <p style={{ fontSize: "0.9rem", color: "#8a6d3f", fontWeight: 600, marginBottom: "12px" }}>{member.role}</p>
                    {member.bio && (
                      <p style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.7, marginBottom: member.linkedin ? "12px" : 0 }}>
                        {member.bio}
                      </p>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "#1b2a4a", fontSize: "1.3rem" }}>
                        <FaLinkedin />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ChatBot />
    </div>
  );
}

export default AboutPage;
