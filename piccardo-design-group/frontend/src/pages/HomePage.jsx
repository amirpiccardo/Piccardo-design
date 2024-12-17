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
      .then((data) => setBrands(data))
      .catch((error) => console.error("Error fetching brands:", error));
  }, []);

  const headingStyle = {
    textAlign: "center",
    marginTop: "40px",
    fontFamily: "Raleway, serif",
    fontWeight: "400",
    fontSize: "4rem",
    lineHeight: "1.4em",
    marginBottom: "20px",
  };

  const imageStyle = {
    width: "100%",
    height: "700px",
    marginTop: "40px",
    position: "relative",
    objectFit: "cover",
  };

  const logoStyle = {
    width: "150px",
    height: "auto",
    margin: "10px",
    transition: "transform 0.3s",
  };

  const buttonStyle = {
    display: "inline-block",
    padding: "15px 30px",
    margin: "10px",
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: "30px",
    textAlign: "center",
    textDecoration: "none",
    fontSize: "18px",
    transition: "transform 0.3s",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const normalizePath = (path) => path.replace(/\\/g, "/");

  return (
    <Container fluid>
      <Row>
        <Col>
          <div style={headingStyle}>
            <h1>Transforming Spaces, Inspiring Lives</h1>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <img src={image} alt="Design Image" style={imageStyle} />
        </Col>
      </Row>
      <Row className="d-flex justify-content-center align-items-center flex-wrap">
        {brands.map((brand, index) => (
          <Col
            xs={6}
            sm={4}
            md={3}
            className="my-2 d-flex justify-content-center"
            key={index}
          >
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={(e) =>
                (e.currentTarget.querySelector("img").style.transform =
                  "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.querySelector("img").style.transform =
                  "scale(1)")
              }
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}/${normalizePath(
                  brand.logo
                )}`}
                alt={brand.name}
                style={logoStyle}
              />
            </a>
          </Col>
        ))}
      </Row>
      <Row>
        <Col>
          <div style={{ position: "relative", marginBottom: "0" }}>
            <img
              src={additionalImage}
              alt="Additional Design Image"
              style={imageStyle}
            />
            <Link
              to="/materials"
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Scopri di più
            </Link>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <ChatBot />
        </Col>
      </Row>
      <Row>
        <Col>
          <NewsletterBanner />
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
