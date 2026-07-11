import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import teamImage from "../assets/team.jpg";
import ChatBot from "../components/ChatBot";
import Seo from "../components/Seo";
import { mediaUrl } from "../utils/media";
import { FaLinkedin } from "react-icons/fa";

function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/team`)
      .then((response) => response.json())
      .then((data) => setTeamMembers(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error fetching team members:", error));
  }, []);

  const pageStyle = {
    backgroundColor: "#fff",
    fontFamily: "Raleway, sans-serif",
    color: "#1a1a1a",
  };

  const heroBannerStyle = {
    position: "relative",
    width: "100%",
    height: "clamp(320px, 50vh, 480px)",
    overflow: "hidden",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55))",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "20px",
  };

  const heroTitleStyle = {
    color: "#fff",
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    fontSize: "clamp(2rem, 6vw, 3.5rem)",
    margin: 0,
    lineHeight: "1.2em",
  };

  const heroSubtitleStyle = {
    color: "rgba(255,255,255,0.9)",
    fontWeight: 300,
    fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
    maxWidth: "620px",
    marginTop: "16px",
    lineHeight: "1.6em",
  };

  const introStyle = {
    fontFamily: "Raleway, sans-serif",
    fontWeight: 300,
    fontSize: "clamp(1.05rem, 2vw, 1.3rem)",
    lineHeight: "1.9em",
    color: "#444",
    maxWidth: "780px",
    margin: "0 auto",
    textAlign: "center",
  };

  const ctaBtn = {
    display: "inline-block",
    marginTop: "28px",
    padding: "13px 32px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: "30px",
    textDecoration: "none",
    fontSize: "0.95rem",
    letterSpacing: "0.05em",
    transition: "background-color 0.2s",
  };

  const headingStyle = {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
    marginBottom: "40px",
    textAlign: "center",
    color: "#1a1a1a",
  };

  return (
    <div style={pageStyle}>
      <Seo title="Il nostro Team" description="Il team di Piccardo Design Group: professionisti del design che danno vita alla tua visione con soluzioni innovative e personalizzate." />
      <div style={heroBannerStyle}>
        <img src={teamImage} alt="Il team di Piccardo Design Group" style={imageStyle} />
        <div style={overlayStyle}>
          <h1 style={heroTitleStyle}>La Nostra Agenzia</h1>
          <p style={heroSubtitleStyle}>
            Diamo vita alla tua visione attraverso soluzioni innovative e personalizzate.
          </p>
        </div>
      </div>

      <div className="container py-5">
        <p style={introStyle}>
          La nostra agenzia prospera sulla passione e sull'esperienza nel mondo del
          design. Con un team dedicato all'eccellenza, diamo vita alla tua visione
          attraverso soluzioni innovative e personalizzate. Collabora con noi per
          sperimentare la fusione di creatività e competenza che definisce il nostro lavoro.
        </p>
        <div style={{ textAlign: "center" }}>
          <Link
            to="/contact"
            style={ctaBtn}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a1a1a")}
          >
            Collabora con noi
          </Link>
        </div>
      </div>

      {teamMembers.length > 0 && (
        <div className="container pb-5">
          <h2 style={headingStyle}>Il Nostro Team</h2>
          <div className="row justify-content-center g-4">
            {teamMembers.map((member) => (
              <div className="col-12 col-md-6" key={member._id}>
                <div className="row g-0 h-100 align-items-stretch" style={{ border: "1px solid #eee", borderRadius: "12px", overflow: "hidden" }}>
                  <div className="col-5">
                    <img
                      src={mediaUrl(member.photo)}
                      alt={member.name}
                      style={{ width: "100%", height: "100%", minHeight: "220px", objectFit: "cover" }}
                      loading="lazy"
                    />
                  </div>
                  <div className="col-7 d-flex flex-column justify-content-center" style={{ padding: "22px" }}>
                    <p style={{ fontSize: "1.2rem", fontWeight: 600, margin: 0, color: "#1b2a4a" }}>{member.name}</p>
                    <p style={{ fontSize: "0.9rem", color: "#c8a96e", fontWeight: 600, marginBottom: "12px" }}>{member.role}</p>
                    {member.bio && (
                      <p style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.6, marginBottom: member.linkedin ? "12px" : 0 }}>
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

export default TeamPage;
