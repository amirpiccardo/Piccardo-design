import React, { useState, useEffect } from "react";
import ChatBot from "../components/ChatBot";

function MaterialsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/materialpage/brands`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setBrands(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const pageStyle = {
    backgroundColor: "#ffffff",
    padding: "20px",
    fontFamily: "Raleway, sans-serif",
    color: "#333",
    textAlign: "center",
  };

  const headingStyle = {
    fontFamily: "Raleway, serif",
    fontWeight: "400",
    fontSize: "4rem",
    lineHeight: "1.4em",
    marginBottom: "20px",
  };

  const subHeadingStyle = {
    fontFamily: "Raleway, sans-serif",
    fontWeight: "300",
    fontSize: "1.5rem",
    lineHeight: "1.8em",
    marginBottom: "20px",
  };

  const logosRowStyle = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: "20px",
    flexWrap: "wrap",
  };

  const logoStyle = {
    width: "150px",
    height: "auto",
    margin: "10px",
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching brands: {error.message}</div>;
  }

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const brandChunks = chunkArray(brands, 4);

  return (
    <div>
      <div style={pageStyle}>
        <h1 style={headingStyle}>Scopri i Nostri Partner</h1>
        <p style={subHeadingStyle}>
          Clicca sul logo per vedere il catalogo del brand specifico.
        </p>
        {brandChunks.map((chunk, idx) => (
          <div style={logosRowStyle} key={idx}>
            {chunk.map((brand) => (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                style={logoStyle}
                key={brand._id}
              >
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/${brand.logo}`}
                  alt={brand.name}
                  style={logoStyle}
                />
              </a>
            ))}
          </div>
        ))}
      </div>
      <ChatBot />
    </div>
  );
}

export default MaterialsPage;
