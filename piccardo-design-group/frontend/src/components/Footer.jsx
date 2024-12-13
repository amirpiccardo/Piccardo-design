import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  const token = localStorage.getItem("authToken");
  const isAuthenticated = !!token;
  const navigate = useNavigate();

  const handlePrivateAreaClick = () => {
    if (isAuthenticated) {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  const footerStyle = {
    backgroundColor: "#f8f9fa",
    padding: "20px 0",
    textAlign: "center",
    position: "relative",
    width: "100%",
    marginTop: "auto",
  };

  const linkContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  };

  const linkStyle = {
    margin: "0 15px",
    color: "#333",
    textDecoration: "none",
  };

  const iconStyle = {
    margin: "0 10px",
    color: "#333",
    fontSize: "24px",
  };

  const buttonLinkStyle = {
    ...linkStyle,
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
  };

  const infoContainerStyle = {
    position: "absolute",
    bottom: "0px",
    right: "20px",
    textAlign: "right",
    fontSize: "0.5rem",
    color: "#333",
  };

  return (
    <footer style={footerStyle}>
      <div style={linkContainerStyle}>
        <Link to="/" style={linkStyle}>
          Home
        </Link>
        <Link to="/about" style={linkStyle}>
          Chi Siamo
        </Link>
        <Link to="/team" style={linkStyle}>
          Team
        </Link>
        <Link to="/materials" style={linkStyle}>
          Brands
        </Link>
        <button
          className="btn btn-link"
          onClick={handlePrivateAreaClick}
          style={buttonLinkStyle}
        >
          Area Riservata
        </button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <a href="https://www.instagram.com" style={iconStyle}>
          <FaInstagram />
        </a>
        <a href="https://www.facebook.com" style={iconStyle}>
          <FaFacebook />
        </a>
        <a href="https://www.linkedin.com" style={iconStyle}>
          <FaLinkedin />
        </a>
      </div>
      <div style={infoContainerStyle}>
        <p>Piccardo Design Group</p>
        <p>Via Alfieri 18, Imperia, IM, 18100</p>
        <p>P.IVA 01587610088</p>
        <p>&copy; 2024 Piccardo Design Group. Tutti i diritti riservati.</p>
      </div>
    </footer>
  );
}

export default Footer;
