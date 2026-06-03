import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer
      style={{
        backgroundColor: "#1a1a1a",
        color: "#ccc",
        padding: "40px 0 20px",
        fontFamily: "Raleway, sans-serif",
      }}
    >
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <h6 style={{ color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.8rem" }}>
              Piccardo Design Group
            </h6>
            <p style={{ fontSize: "0.85rem", color: "#b3b3b3", lineHeight: "1.8" }}>
              Via Alfieri 18<br />
              Imperia, IM 18100<br />
              P.IVA 01587610088
            </p>
          </div>

          <div className="col-md-4 mb-3">
            <h6 style={{ color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.8rem" }}>
              Navigazione
            </h6>
            <ul className="list-unstyled" style={{ fontSize: "0.85rem" }}>
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "Chi Siamo" },
                { to: "/team", label: "Team" },
                { to: "/materials", label: "Brands" },
                { to: "/contracts", label: "Contracts" },
                { to: "/contact", label: "Contattaci" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} style={{ color: "#b3b3b3", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.target.style.color = "#fff")}
                    onMouseLeave={(e) => (e.target.style.color = "#b3b3b3")}>
                    {label}
                  </Link>
                </li>
              ))}
              {isAuthenticated && (
                <li>
                  <Link to="/admin" style={{ color: "#b3b3b3", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.target.style.color = "#fff")}
                    onMouseLeave={(e) => (e.target.style.color = "#b3b3b3")}>
                    Area Admin
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="col-md-4 mb-3">
            <h6 style={{ color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.8rem" }}>
              Seguici
            </h6>
            <div className="d-flex gap-3 mt-2">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#b3b3b3", fontSize: "1.4rem" }}>
                <FaInstagram />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#b3b3b3", fontSize: "1.4rem" }}>
                <FaFacebook />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: "#b3b3b3", fontSize: "1.4rem" }}>
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: "#333" }} />
        <div style={{ display: "flex", justifyContent: "center", gap: "18px", flexWrap: "wrap", marginBottom: "10px" }}>
          {[
            { to: "/faq", label: "FAQ" },
            { to: "/privacy", label: "Privacy & Cookie" },
            { to: "/termini", label: "Termini" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{ color: "#b3b3b3", textDecoration: "none", fontSize: "0.78rem" }}
              onMouseEnter={(e) => (e.target.style.color = "#fff")}
              onMouseLeave={(e) => (e.target.style.color = "#b3b3b3")}
            >
              {label}
            </Link>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#666", margin: 0 }}>
          &copy; {new Date().getFullYear()} Piccardo Design Group. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
