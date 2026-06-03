import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import teamImage from "../assets/team.jpg";
import ChatBot from "../components/ChatBot";
import Seo from "../components/Seo";

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

  const memberImageStyle = {
    width: "100%",
    height: "340px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "14px",
    transition: "transform 0.3s, box-shadow 0.3s",
  };

  const normalizePath = (p) => (p || "").replace(/\\/g, "/");

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
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={member._id}>
                <div
                  style={{ textAlign: "center" }}
                  onMouseEnter={(e) => {
                    const img = e.currentTarget.querySelector("img");
                    img.style.transform = "scale(1.03)";
                    img.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    const img = e.currentTarget.querySelector("img");
                    img.style.transform = "scale(1)";
                    img.style.boxShadow = "none";
                  }}
                >
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/${normalizePath(member.photo)}`}
                    alt={member.name}
                    style={memberImageStyle}
                    loading="lazy"
                  />
                  <p style={{ fontSize: "1.15rem", fontWeight: 500, margin: 0 }}>{member.name}</p>
                  <p style={{ fontSize: "0.95rem", color: "#888" }}>{member.role}</p>
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
