import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { fetchMaterialBrands } from "../services/apiServices";

function MaterialsPage() {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterialBrands()
      .then((data) => { setBrands(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const normalizePath = (p) => (p || "").replace(/\\/g, "/");

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "Raleway, sans-serif", minHeight: "60vh" }}>
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px 30px",
          backgroundColor: "#fafafa",
          borderBottom: "1px solid #eee",
        }}
      >
        <h1
          style={{
            fontWeight: 300,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            letterSpacing: "0.05em",
            marginBottom: "12px",
          }}
        >
          I Nostri Partner
        </h1>
        <p style={{ color: "#777", fontSize: "1.1rem", marginBottom: "30px" }}>
          Clicca sul logo per visitare il sito del brand
        </p>
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Cerca brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderRadius: "30px", padding: "10px 20px", border: "1px solid #ddd" }}
          />
        </div>
      </div>

      <Container className="py-5">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted py-5">Nessun brand trovato per "{search}"</p>
        ) : (
          <div className="row justify-content-center">
            {filtered.map((brand) => (
              <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4 d-flex justify-content-center" key={brand._id}>
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={brand.name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textDecoration: "none",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #eee",
                    width: "140px",
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/${normalizePath(brand.logo)}`}
                    alt={brand.name}
                    style={{ maxWidth: "100px", maxHeight: "60px", objectFit: "contain" }}
                  />
                  <span style={{ fontSize: "0.75rem", color: "#666", marginTop: "8px", textAlign: "center" }}>
                    {brand.name}
                  </span>
                </a>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default MaterialsPage;
