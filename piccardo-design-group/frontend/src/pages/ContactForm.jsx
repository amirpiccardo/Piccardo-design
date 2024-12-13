import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Invio in corso...");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setStatus("Messaggio inviato con successo!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("Errore durante l'invio del messaggio.");
      }
    } catch (error) {
      setStatus("Errore durante l'invio del messaggio.");
    }
  };

  const formContainerStyle = {
    backgroundColor: "#d2b48c",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "Raleway, sans-serif",
  };

  const headingStyle = {
    fontFamily: "'Playfair Display', serif",
    fontWeight: "700",
    fontSize: "2.5rem",
    textAlign: "center",
    marginBottom: "30px",
    color: "#fff",
  };

  const labelStyle = {
    fontFamily: "Georgia, serif",
    fontWeight: "500",
    fontSize: "1rem",
    color: "#fff",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    color: "#333",
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    fontSize: "1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.3s",
  };

  const iconStyle = {
    marginRight: "10px",
  };

  const statusStyle = {
    marginTop: "20px",
    fontFamily: "Georgia, serif",
    fontSize: "1rem",
    color: "#fff",
  };

  return (
    <section className="py-5">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <div style={formContainerStyle}>
              <h2 style={headingStyle}>Contattaci</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Nome:</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Messaggio:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </Form.Group>
                <Button
                  type="submit"
                  style={buttonStyle}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  <FontAwesomeIcon icon={faPaperPlane} style={iconStyle} />
                  Invia
                </Button>
              </Form>
              {status && <p style={statusStyle}>{status}</p>}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default ContactForm;
