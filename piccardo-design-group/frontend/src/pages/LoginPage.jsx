import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSignInAlt, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.auth) {
        localStorage.setItem("authToken", data.token);
        navigate("/admin");
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Login failed. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const containerStyle = {
    marginTop: "100px",
  };

  const cardStyle = {
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const cardHeaderStyle = {
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    background: "linear-gradient(135deg, #6D5BBA 0%, #8D58BF 100%)",
  };

  const cardBodyStyle = {
    padding: "20px",
  };

  const inputGroupStyle = {
    marginBottom: "15px",
  };

  const iconStyle = {
    minWidth: "45px",
    textAlign: "center",
  };

  const submitButtonStyle = {
    backgroundColor: "#6D5BBA",
    borderColor: "#6D5BBA",
    transition: "transform 0.3s",
    fontSize: "16px",
  };

  return (
    <div className="container" style={containerStyle}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg" style={cardStyle}>
            <div className="card-header text-center text-white" style={cardHeaderStyle}>
              <h3>Admin Login</h3>
            </div>
            <div className="card-body p-4" style={cardBodyStyle}>
              <form onSubmit={handleLogin}>
                <div className="input-group" style={inputGroupStyle}>
                  <div className="input-group-prepend" style={iconStyle}>
                    <FontAwesomeIcon icon={faEnvelope} className="text-muted" />
                  </div>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group" style={inputGroupStyle}>
                  <div className="input-group-prepend" style={iconStyle}>
                    <FontAwesomeIcon icon={faLock} className="text-muted" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={togglePasswordVisibility}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary mt-4 w-100"
                  style={submitButtonStyle}
                  onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: "10px" }} />
                  Login
                </button>
                {error && <p className="text-danger mt-3">{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
