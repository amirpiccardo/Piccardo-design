import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faEnvelope, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Seo from "../components/Seo";

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot anti-spam (deve restare vuoto)
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Se il campo honeypot è compilato, è un bot: simuliamo successo e non inviamo
    if (website) {
      setStatus({ type: "success", text: "Messaggio inviato con successo!" });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (response.ok) {
        setStatus({ type: "success", text: "Messaggio inviato con successo! Ti risponderemo presto." });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        const data = await response.json().catch(() => ({}));
        setStatus({ type: "error", text: data.message || "Errore durante l'invio del messaggio." });
      }
    } catch {
      setStatus({ type: "error", text: "Errore di connessione. Riprova più tardi." });
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    fontFamily: "Raleway, sans-serif",
    fontWeight: 500,
    fontSize: "0.9rem",
    color: "#333",
    marginBottom: "6px",
    display: "block",
    letterSpacing: "0.02em",
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    marginBottom: "20px",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "1px solid #ddd",
    color: "#333",
    outline: "none",
    fontFamily: "Raleway, sans-serif",
  };

  return (
    <section style={{ backgroundColor: "#fafafa", minHeight: "70vh", padding: "60px 0", fontFamily: "Raleway, sans-serif" }}>
      <Seo title="Contattaci" description="Contatta Liguria Design Group per consulenza, preventivi o collaborazioni nel settore arredamento e illuminazione. Via Alfieri 18, Imperia." />
      <Container>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(2.2rem, 5vw, 3.2rem)", color: "#1a1a1a" }}>
            Contattaci
          </h1>
          <p style={{ color: "#666", fontSize: "1.05rem", maxWidth: "560px", margin: "0 auto" }}>
            Hai un progetto o vuoi collaborare con noi? Scrivici, ti risponderemo al più presto.
          </p>
        </div>

        <Row className="justify-content-center g-4">
          <Col xs={12} md={5} lg={4}>
            <div style={{ padding: "10px 20px" }}>
              <div style={{ marginBottom: "28px" }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: "#c8a96e", fontSize: "1.3rem", marginBottom: "8px" }} />
                <h6 style={{ fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.8rem", color: "#1a1a1a" }}>Sede</h6>
                <p style={{ color: "#666", margin: 0, lineHeight: "1.7" }}>
                  Via Vittorio Alfieri 18<br />Imperia, IM 18100<br />P.IVA 01587610088
                </p>
              </div>
              <div style={{ marginBottom: "24px" }}>
                <FontAwesomeIcon icon={faEnvelope} style={{ color: "#c8a96e", fontSize: "1.3rem", marginBottom: "8px" }} />
                <h6 style={{ fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.8rem", color: "#1a1a1a" }}>Email</h6>
                <p style={{ color: "#666", margin: 0 }}>info@liguriadesigngroup.it</p>
              </div>
              <iframe
                title="Sede Liguria Design Group"
                src="https://www.google.com/maps?q=Via%20Alfieri%2018,%20Imperia,%20IM&output=embed"
                width="100%"
                height="220"
                style={{ border: 0, borderRadius: "12px" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Col>

          <Col xs={12} md={7} lg={6}>
            <div style={{ background: "#fff", padding: "32px", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
              <form onSubmit={handleSubmit}>
                <label style={labelStyle}>Nome</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required placeholder="Il tuo nome" />

                <label style={labelStyle}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required placeholder="La tua email" />

                <label style={labelStyle}>Messaggio</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ ...inputStyle, resize: "vertical" }}
                  required
                  placeholder="Scrivi il tuo messaggio..."
                />

                {/* Honeypot anti-spam: nascosto agli utenti, riempito solo dai bot */}
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px",
                    backgroundColor: "#1b2a4a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "30px",
                    fontSize: "1rem",
                    letterSpacing: "0.05em",
                    cursor: loading ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  {loading ? <span className="spinner-border spinner-border-sm" /> : <FontAwesomeIcon icon={faPaperPlane} />}
                  {loading ? "Invio..." : "Invia messaggio"}
                </button>
              </form>

              {status && (
                <p style={{ marginTop: "18px", textAlign: "center", fontSize: "0.95rem", color: status.type === "success" ? "#2e7d32" : "#c0392b" }}>
                  {status.text}
                </p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default ContactForm;
