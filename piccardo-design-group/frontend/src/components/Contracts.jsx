import React, { useState, useEffect } from "react";

function Contracts() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/contract/brands`)
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
    padding: "20px 40px",
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
    color: "#2c3e50",
  };

  const subHeadingStyle = {
    fontFamily: "Georgia, serif",
    fontWeight: "400",
    fontSize: "1.5rem",
    lineHeight: "1.8em",
    marginBottom: "20px",
    color: "#2c3e50",
  };

  const logosRowStyle = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: "20px",
    flexWrap: "wrap",
  };

  const logoStyle = {
    width: "450px",
    height: "350px",
    objectFit: "cover",
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

  const brandChunks = chunkArray(brands, 3);

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Esplora i Nostri Contratti</h1>
      <p style={subHeadingStyle}>Clicca sul contract di tuo interesse per vedere più dettagli.</p>
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
                src={`${import.meta.env.VITE_BASE_URL}/${brand.logo}`}
                alt={brand.name}
                style={logoStyle}
              />
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Contracts;
