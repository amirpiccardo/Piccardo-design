import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import image from "../assets/primosfondo.jpg";
import additionalImage from "../assets/sfondodue.jpg";
import NewsletterBanner from "../components/NewsletterBanner";
import ChatBot from "../components/ChatBot";
import { Link } from "react-router-dom";

function HomePage() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/brands`)
      .then((response) => response.json())
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error fetching brands:", error));
  }, []);

  const headingStyle = {
    textAlign: "center",
    marginTop: "60px",
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 500,
    fontSize: "clamp(2.2rem, 6vw, 4rem)",
    lineHeight: "1.2em",
    marginBottom: "16px",
    color: "#1a1a1a",
    letterSpacing: "0.01em",
  };

  const subheadingStyle = {
    textAlign: "center",
    fontFamily: "Raleway, sans-serif",
    fontWeight: 300,
    fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
    color: "#666",
    maxWidth: "640px",
    margin: "0 auto 28px",
    lineHeight: "1.7em",
  };

  const ctaRowStyle = {
    display: "flex",
    gap: "14px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "40px",
  };

  const primaryBtn = {
    display: "inline-block",
    padding: "13px 30px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: "30px",
    textDecoration: "none",
    fontSize: "0.95rem",
    fontFamily: "Raleway, sans-serif",
    letterSpacing: "0.05em",
    transition: "background-color 0.2s",
  };

  const secondaryBtn = {
    ...primaryBtn,
    backgroundColor: "transparent",
    color: "#1a1a1a",
    border: "1px solid #1a1a1a",
  };

  const imageStyle = {
    width: "100%",
    height: "clamp(320px, 60vh, 640px)",
    marginTop: "20px",
    position: "relative",
    objectFit: "cover",
  };

  const logoStyle = {
    width: "140px",
    height: "auto",
    margin: "10px",
    transition: "transform 0.3s",
    objectFit: "contain",
  };

  const overlayButtonStyle = {
    display: "inline-block",
    padding: "14px 32px",
    backgroundColor: "rgba(0,0,0,0.85)",
    color: "#fff",
    borderRadius: "30px",
    textAlign: "center",
    textDecoration: "none",
    fontSize: "1rem",
    fontFamily: "Raleway, sans-serif",
    letterSpacing: "0.05em",
    transition: "transform 0.3s",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const normalizePath = (path) => (path || "").replace(/\\/g, "/");

  return (
    <Container fluid className="px-0">
      <Row className="g-0">
        <Col>
          <div style={headingStyle}>
            <h1 style={{ margin: 0 }}>Trasformiamo gli spazi, ispiriamo la vita</h1>
          </div>
          <p style={subheadingStyle}>
            Distribuiamo i migliori brand di arredamento e design Made in Italy,
            offrendo soluzioni su misura per aziende, architetti e progettisti.
          </p>
          <div style={ctaRowStyle}>
            <Link
              to="/materials"
              style={primaryBtn}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a1a1a")}
            >
              Scopri i nostri partner
            </Link>
            <Link
              to="/contact"
              style={secondaryBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1a1a1a";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#1a1a1a";
              }}
            >
              Contattaci
            </Link>
          </div>
        </Col>
      </Row>

      <Row className="g-0">
        <Col>
          <img src={image} alt="Interni di design Piccardo Design Group" style={imageStyle} />
        </Col>
      </Row>

      {brands.length > 0 && (
        <Row className="d-flex justify-content-center align-items-center flex-wrap py-4">
          {brands.map((brand) => (
            <Col
              xs={6}
              sm={4}
              md={3}
              lg={2}
              className="my-3 d-flex justify-content-center"
              key={brand._id}
            >
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                title={brand.name}
                onMouseEnter={(e) =>
                  (e.currentTarget.querySelector("img").style.transform = "scale(1.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.querySelector("img").style.transform = "scale(1)")
                }
              >
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/${normalizePath(brand.logo)}`}
                  alt={brand.name}
                  style={logoStyle}
                  loading="lazy"
                />
              </a>
            </Col>
          ))}
        </Row>
      )}

      <Row className="g-0">
        <Col>
          <div style={{ position: "relative", marginBottom: "0" }}>
            <img
              src={additionalImage}
              alt="Soluzioni di arredamento contract"
              style={imageStyle}
              loading="lazy"
            />
            <Link
              to="/materials"
              style={overlayButtonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)")}
            >
              Scopri di più
            </Link>
          </div>
        </Col>
      </Row>

      <Row className="g-0">
        <Col>
          <ChatBot />
        </Col>
      </Row>

      <NewsletterBanner />
    </Container>
  );
}

export default HomePage;
