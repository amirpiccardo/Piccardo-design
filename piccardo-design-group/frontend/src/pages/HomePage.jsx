import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import image from "../assets/primosfondo.jpg";
import additionalImage from "../assets/sfondodue.jpg";
import NewsletterBanner from "../components/NewsletterBanner";
import ChatBot from "../components/ChatBot";
import { Link } from "react-router-dom";

function HomePage() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/brands")
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
    height: "auto",
    marginTop: "40px",
    position: "relative",
  };

  const logoStyle = {
    width: "150px",
    height: "auto",
    margin: "10px",
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
  };

  const buttonOnImageStyle = {
    ...buttonStyle,
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
            <a href={brand.website} target="_blank" rel="noopener noreferrer">
              <img
                src={`http://localhost:5000/${normalizePath(brand.logo)}`}
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
            <Link to="/materials" style={buttonOnImageStyle}>
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