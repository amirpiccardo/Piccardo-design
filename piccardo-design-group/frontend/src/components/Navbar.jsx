import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const token = localStorage.getItem("authToken");
  const isAuthenticated = !!token;
  const navigate = useNavigate();
  const location = useLocation();

  const handlePrivateAreaClick = () => {
    if (isAuthenticated) {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  const navbarStyle = {
    position: "sticky",
    top: "0",
    width: "100%",
    zIndex: "1000",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #ddd",
  };

  const buttonStyle = {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: "30px",
    textAlign: "center",
    textDecoration: "none",
    fontSize: "16px",
    transition: "transform 0.3s",
  };

  const navItemStyle = {
    display: "flex",
    alignItems: "center",
  };

  const navLinkStyle = (path) => ({
    color: location.pathname === path ? "#000" : "#555",
    position: "relative",
    textDecoration: "none",
    paddingBottom: "2px",
  });

  const activeLinkStyle = {
    borderBottom: "1px solid #000",
    marginBottom: "-1px",
  };

  return (
    <nav style={navbarStyle} className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="PICCARDO DESIGN GROUP" height="80" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto" style={navItemStyle}>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
                style={
                  location.pathname === "/"
                    ? { ...navLinkStyle("/"), ...activeLinkStyle }
                    : navLinkStyle("/")
                }
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/about"
                style={
                  location.pathname === "/about"
                    ? { ...navLinkStyle("/about"), ...activeLinkStyle }
                    : navLinkStyle("/about")
                }
              >
                Chi Siamo
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/team"
                style={
                  location.pathname === "/team"
                    ? { ...navLinkStyle("/team"), ...activeLinkStyle }
                    : navLinkStyle("/team")
                }
              >
                Team
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/fairs"
                style={
                  location.pathname === "/fairs"
                    ? { ...navLinkStyle("/fairs"), ...activeLinkStyle }
                    : navLinkStyle("/fairs")
                }
              >
                Fiere
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/materials"
                style={
                  location.pathname === "/materials"
                    ? { ...navLinkStyle("/materials"), ...activeLinkStyle }
                    : navLinkStyle("/materials")
                }
              >
                Brands
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/contracts"
                style={
                  location.pathname === "/contracts"
                    ? { ...navLinkStyle("/contracts"), ...activeLinkStyle }
                    : navLinkStyle("/contracts")
                }
              >
                Contracts
              </Link>
            </li>
            <li className="nav-item">
              <a
                href="/contact"
                style={buttonStyle}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                Contattaci
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
