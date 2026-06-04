import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { fetchContractBrands } from "../services/apiServices";
import { mediaUrl } from "../utils/media";

function Contracts() {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContractBrands()
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
          Contratti
        </h1>
        <p style={{ color: "#777", fontSize: "1.1rem", marginBottom: "30px" }}>
          Esplora i nostri partner contract
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
          <div className="row">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="col-12 col-sm-6 col-md-4 mb-4" key={i}>
                <div className="pdg-skeleton" style={{ width: "100%", height: "260px", borderRadius: "8px" }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted py-5">
            {brands.length === 0
              ? "I nostri contract saranno presto disponibili. Torna a trovarci!"
              : `Nessun brand trovato per "${search}"`}
          </p>
        ) : (
          <div className="row">
            {filtered.map((brand) => (
              <div className="col-12 col-sm-6 col-md-4 mb-4" key={brand._id}>
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="pdg-tilt"
                    style={{
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #eee",
                    }}
                  >
                    <img
                      src={mediaUrl(brand.logo)}
                      alt={brand.name}
                      style={{ width: "100%", height: "220px", objectFit: "cover" }}
                    />
                    <div style={{ padding: "12px 16px", backgroundColor: "#fff" }}>
                      <p style={{ margin: 0, fontWeight: 500, color: "#333" }}>{brand.name}</p>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default Contracts;
