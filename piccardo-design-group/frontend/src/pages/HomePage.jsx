import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import image from "../assets/primosfondo.jpg";
import additionalImage from "../assets/sfondodue.jpg";
import NewsletterBanner from "../components/NewsletterBanner";
import ChatBot from "../components/ChatBot";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import CountUp from "../components/CountUp";
import Magnetic from "../components/Magnetic";
import ParallaxImage from "../components/ParallaxImage";
import { mediaUrl } from "../utils/media";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCouch, faHandshake, faDraftingCompass } from "@fortawesome/free-solid-svg-icons";

const services = [
  { icon: faCouch, title: "Distribuzione brand", text: "Selezioniamo e distribuiamo i migliori marchi di arredamento e design Made in Italy." },
  { icon: faDraftingCompass, title: "Soluzioni contract", text: "Progetti su misura per hotel, uffici e spazi commerciali, dalla A alla Z." },
  { icon: faHandshake, title: "Consulenza & partnership", text: "Affianchiamo aziende, architetti e progettisti con esperienza trentennale." },
];

const stats = [
  { value: "30+", label: "Anni di esperienza" },
  { value: "20+", label: "Brand partner" },
  { value: "100%", label: "Made in Italy" },
];

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
      <Seo description="Piccardo Design Group distribuisce i migliori brand di arredamento e design Made in Italy. Soluzioni contract e consulenza per aziende, architetti e progettisti." />
      <Row className="g-0">
        <Col>
          <div style={headingStyle}>
            <h1 style={{ margin: 0 }}>
              <span className="pdg-mask"><span style={{ animationDelay: "0.05s" }}>Trasformiamo gli spazi,</span></span>{" "}
              <span className="pdg-mask"><span style={{ animationDelay: "0.18s" }}>ispiriamo la vita</span></span>
            </h1>
          </div>
          <p style={subheadingStyle}>
            Distribuiamo i migliori brand di arredamento e design Made in Italy,
            offrendo soluzioni su misura per aziende, architetti e progettisti.
          </p>
          <div style={ctaRowStyle}>
            <Magnetic>
              <Link
                to="/materials"
                style={primaryBtn}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a1a1a")}
              >
                Scopri i nostri partner
              </Link>
            </Magnetic>
            <Magnetic>
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
            </Magnetic>
          </div>
        </Col>
      </Row>

      <Row className="g-0">
        <Col>
          <ParallaxImage src={image} alt="Interni di design Piccardo Design Group" style={{ marginTop: "20px" }} />
        </Col>
      </Row>

      {/* Sezione Servizi */}
      <div style={{ padding: "70px 20px", backgroundColor: "#fff" }}>
        <Reveal as="h2" style={{ textAlign: "center", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 600, marginBottom: "12px", color: "#1a1a1a" }}>
          Cosa facciamo
        </Reveal>
        <Reveal as="p" delay={80} style={{ textAlign: "center", color: "#666", maxWidth: "600px", margin: "0 auto 48px", fontSize: "1.05rem" }}>
          Un unico partner per la distribuzione di arredamento di design e le soluzioni contract.
        </Reveal>
        <div className="container">
          <div className="row g-4 justify-content-center">
            {services.map((s, i) => (
              <div className="col-12 col-md-4" key={s.title}>
                <Reveal delay={i * 120}>
                  <div
                    className="pdg-tilt"
                    style={{
                      textAlign: "center",
                      padding: "36px 24px",
                      border: "1px solid #eee",
                      borderRadius: "14px",
                      height: "100%",
                      background: "#fff",
                    }}
                  >
                    <FontAwesomeIcon icon={s.icon} style={{ fontSize: "2.2rem", color: "#c8a96e", marginBottom: "18px" }} />
                    <h3 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: "12px" }}>{s.title}</h3>
                    <p style={{ color: "#666", lineHeight: "1.7", margin: 0 }}>{s.text}</p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sezione Numeri */}
      <div style={{ background: "linear-gradient(135deg, #1b2a4a, #24375f)", padding: "70px 20px" }}>
        <div className="container">
          <div className="row text-center">
            {stats.map((s, i) => (
              <div className="col-4" key={s.label}>
                <Reveal delay={i * 120}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 6vw, 3.5rem)", fontWeight: 600, color: "#c8a96e" }}>
                    <CountUp value={s.value} />
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(0.8rem, 2vw, 1rem)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    {s.label}
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </div>

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
                  src={mediaUrl(brand.logo)}
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
          <ParallaxImage
            src={additionalImage}
            alt="Soluzioni di arredamento contract"
            overlay={<div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)" }} />}
          >
            <Magnetic style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
              <Link
                to="/materials"
                style={{
                  display: "inline-block", padding: "14px 32px", backgroundColor: "rgba(0,0,0,0.85)",
                  color: "#fff", borderRadius: "30px", textDecoration: "none", fontSize: "1rem",
                  fontFamily: "Raleway, sans-serif", letterSpacing: "0.05em",
                }}
              >
                Scopri di più
              </Link>
            </Magnetic>
          </ParallaxImage>
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
