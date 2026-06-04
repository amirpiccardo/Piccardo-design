import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSignInAlt, faEnvelope, faLock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/admin";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.auth) {
        login(data.token);
        navigate(from, { replace: true });
      } else {
        setError(data.message || "Credenziali non valide");
      }
    } catch {
      setError("Errore di connessione. Il server potrebbe essere in fase di avvio: riprova tra qualche secondo.");
    } finally {
      setLoading(false);
    }
  };

  const inputWrapStyle = {
    display: "flex",
    alignItems: "center",
    background: "#f6f7f9",
    border: "1px solid #e3e6ea",
    borderRadius: "12px",
    padding: "0 14px",
    marginBottom: "16px",
  };
  const inputStyle = {
    flex: 1,
    border: "none",
    background: "transparent",
    padding: "14px 10px",
    fontSize: "1rem",
    outline: "none",
    color: "#1a1a1a",
    fontFamily: "Raleway, sans-serif",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "linear-gradient(135deg, #1b2a4a 0%, #24375f 100%)",
        fontFamily: "Raleway, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
            padding: "40px 34px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "26px" }}>
            <img src={logo} alt="Piccardo Design Group" style={{ height: "64px", marginBottom: "10px" }} />
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "1.6rem", margin: 0, color: "#1b2a4a" }}>
              Area Riservata
            </h3>
            <p style={{ color: "#888", fontSize: "0.9rem", margin: "4px 0 0" }}>Accedi al pannello di amministrazione</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={inputWrapStyle}>
              <FontAwesomeIcon icon={faEnvelope} style={{ color: "#c8a96e" }} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
                autoComplete="username"
              />
            </div>
            <div style={inputWrapStyle}>
              <FontAwesomeIcon icon={faLock} style={{ color: "#c8a96e" }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                style={{ border: "none", background: "transparent", color: "#999", cursor: "pointer" }}
                aria-label={showPassword ? "Nascondi password" : "Mostra password"}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {error && (
              <div style={{ background: "#fdecea", color: "#c0392b", padding: "10px 14px", borderRadius: "10px", fontSize: "0.88rem", marginBottom: "16px" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #1b2a4a, #24375f)",
                color: "#fff",
                border: "none",
                borderRadius: "30px",
                fontSize: "1rem",
                letterSpacing: "0.04em",
                cursor: loading ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "opacity 0.2s",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? <span className="spinner-border spinner-border-sm" /> : <FontAwesomeIcon icon={faSignInAlt} />}
              {loading ? "Accesso in corso..." : "Accedi"}
            </button>
          </form>
        </div>

        <div style={{ textAlign: "center", marginTop: "18px" }}>
          <Link to="/" style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: "0.9rem" }}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Torna al sito
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
