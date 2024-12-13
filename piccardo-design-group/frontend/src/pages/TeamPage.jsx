import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import teamImage from "../assets/team.jpg";
import ChatBot from "../components/ChatBot";

function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/team`)
      .then((response) => response.json())
      .then((data) => setTeamMembers(data))
      .catch((error) => console.error("Error fetching team members:", error));
  }, []);

  const pageStyle = {
    backgroundColor: "#f8f9fa",
    fontFamily: "Raleway, sans-serif",
    color: "#333",
  };

  const headingStyle = {
    fontFamily: "Raleway, sans-serif",
    fontWeight: "300",
    fontSize: "3rem",
    lineHeight: "1.4em",
    marginBottom: "40px",
    textAlign: "center",
  };

  const textStyle = {
    fontFamily: "Georgia, serif",
    fontWeight: "300",
    fontSize: "1.6rem",
    lineHeight: "1.8em",
    marginTop: "50px",
    marginBottom: "100px",
    textAlign: "left",
    marginLeft: "-100px",
  };

  const heroBannerStyle = {
    position: "relative",
    width: "100vw",
    height: "500px",
    overflow: "hidden",
    marginBottom: "40px",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "top",
    position: "absolute",
    top: "0",
    left: "0",
  };

  const heroTextStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#fff",
    textAlign: "center",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
    fontSize: "4rem",
    fontFamily: "Raleway, serif",
    lineHeight: "1.4em",
  };

  const heroButtonStyle = {
    padding: "10px 24px",
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: "30px",
    textAlign: "center",
    textDecoration: "none",
    fontSize: "25px",
    position: "absolute",
    bottom: "-100px",
    right: "200px",
    transition: "transform 0.3s",
  };

  const teamContainerStyle = {
    textAlign: "center",
    marginBottom: "40px",
  };

  const memberContainerStyle = {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "60px",
  };

  const memberStyle = {
    width: "350px",
    margin: "20px",
    textAlign: "center",
    transition: "transform 0.3s",
  };

  const memberImageStyle = {
    width: "100%",
    height: "450px",
    objectFit: "cover",
    borderRadius: "0",
    marginBottom: "10px",
    transition: "transform 0.3s, box-shadow 0.3s",
  };

  const memberHoverStyle = {
    transform: "scale(1.05)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  };

  const memberNameStyle = {
    fontSize: "1.2rem",
    fontWeight: "500",
  };

  const memberRoleStyle = {
    fontSize: "1rem",
    fontWeight: "400",
    color: "#666",
  };

  return (
    <div style={pageStyle}>
      <div className="container-fluid p-0">
        <div style={heroBannerStyle}>
          <img src={teamImage} alt="Team Photo" style={imageStyle} />
          <div style={heroTextStyle}>
            <h1>La Nostra Agenzia</h1>
            <p>
              Diamo vita alla tua visione attraverso soluzioni innovative e
              personalizzate.
            </p>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8 d-flex">
            <div className="col-md-8" style={{ flexBasis: "65%" }}>
              <p style={textStyle}>
                La nostra agenzia prospera sulla passione e sull'esperienza nel
                mondo del design. Con un team dedicato all'eccellenza, diamo
                vita alla tua visione attraverso soluzioni innovative e
                personalizzate. Collabora con noi per sperimentare la fusione di
                creatività e competenza che definisce il nostro lavoro.
              </p>
            </div>
            <div
              className="col-md-4 d-flex align-items-start justify-content-end"
              style={{ flexBasis: "35%" }}
            >
              <Link
                to="/contact"
                style={heroButtonStyle}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                Collabora con Noi
              </Link>
            </div>
          </div>
        </div>
        <div style={teamContainerStyle}>
          <h2 style={headingStyle}>Il Nostro Team</h2>
          <div
            className="row justify-content-center"
            style={memberContainerStyle}
          >
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="col-12 col-sm-6 col-lg-4"
                style={memberStyle}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, memberHoverStyle)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.currentTarget.style, memberStyle)
                }
              >
                <img
                  src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${member.photo}`}
                  alt={member.name}
                  className="img-fluid mb-2"
                  style={memberImageStyle}
                  onMouseEnter={(e) =>
                    Object.assign(e.target.style, memberHoverStyle)
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.target.style, memberImageStyle)
                  }
                />
                <p style={memberNameStyle}>{member.name}</p>
                <p style={memberRoleStyle}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
}

export default TeamPage;
