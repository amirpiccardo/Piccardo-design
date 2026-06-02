import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e8e8e8",
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Piccardo Design Group" height="70" />
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Apri menu"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            {[
              { path: "/", label: "Home" },
              { path: "/about", label: "Chi Siamo" },
              { path: "/team", label: "Team" },
              { path: "/materials", label: "Brands" },
              { path: "/contracts", label: "Contracts" },
            ].map(({ path, label }) => (
              <li className="nav-item" key={path}>
                <Link
                  className="nav-link"
                  to={path}
                  style={{
                    color: isActive(path) ? "#000" : "#555",
                    fontFamily: "Raleway, sans-serif",
                    fontSize: "0.95rem",
                    letterSpacing: "0.03em",
                    borderBottom: isActive(path) ? "1px solid #000" : "none",
                    paddingBottom: isActive(path) ? "2px" : undefined,
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}

            <li className="nav-item ms-2">
              <Link
                to="/contact"
                className="btn"
                style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  borderRadius: "30px",
                  padding: "8px 22px",
                  fontFamily: "Raleway, sans-serif",
                  fontSize: "0.9rem",
                  letterSpacing: "0.05em",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#000")}
              >
                Contattaci
              </Link>
            </li>

            {isAuthenticated && (
              <li className="nav-item ms-1">
                <Link
                  to="/admin"
                  className="btn btn-outline-secondary btn-sm"
                  style={{ borderRadius: "30px", fontFamily: "Raleway, sans-serif" }}
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
