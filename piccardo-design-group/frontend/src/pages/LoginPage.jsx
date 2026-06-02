import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSignInAlt, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import backgroundImage from "../assets/primosfondo.jpg";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
        navigate("/admin");
      } else {
        setError(data.message || "Credenziali non valide");
      }
    } catch {
      setError("Errore di connessione. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="col-md-5 col-lg-4">
        <div
          className="card shadow-lg"
          style={{
            borderRadius: "12px",
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            border: "none",
          }}
        >
          <div className="card-header text-center text-white" style={{ background: "transparent", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "24px" }}>
            <h3 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 300, letterSpacing: "0.1em" }}>
              Area Amministrativa
            </h3>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleLogin}>
              <div className="input-group mb-3">
                <span className="input-group-text" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}>
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
                />
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              {error && (
                <div className="alert alert-danger py-2" style={{ fontSize: "0.9rem" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn w-100 mt-2"
                disabled={loading}
                style={{
                  backgroundColor: "#c8a96e",
                  color: "#fff",
                  border: "none",
                  borderRadius: "30px",
                  padding: "12px",
                  fontSize: "1rem",
                  fontFamily: "Raleway, sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" />
                ) : (
                  <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                )}
                {loading ? "Accesso..." : "Accedi"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
