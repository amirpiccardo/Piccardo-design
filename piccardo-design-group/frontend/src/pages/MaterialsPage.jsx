import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { fetchBrands } from "../services/apiServices";
import Seo from "../components/Seo";
import { mediaUrl } from "../utils/media";

function MaterialsPage() {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("Tutti");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands()
      .then((data) => { setBrands(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["Tutti", ...Array.from(new Set(brands.map((b) => b.category).filter(Boolean)))];

  const filtered = brands.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCat === "Tutti" || b.category === activeCat;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ fontFamily: "Raleway, sans-serif", minHeight: "60vh" }}>
      <Seo title="I nostri Brand" description="Scopri i brand rappresentati da Liguria Design Group: i migliori marchi di arredamento e illuminazione." />
      <div style={{ textAlign: "center", padding: "60px 20px 30px", backgroundColor: "#fafafa", borderBottom: "1px solid #eee" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.02em", marginBottom: "12px" }}>
          Le Aziende Che Ci Hanno Scelto
        </h1>
        <p style={{ color: "#777", fontSize: "1.1rem", marginBottom: "26px" }}>
          Clicca su un brand per visitare il sito ufficiale
        </p>
        <div style={{ maxWidth: "400px", margin: "0 auto 22px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Cerca brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderRadius: "30px", padding: "10px 20px", border: "1px solid #ddd" }}
          />
        </div>
        {categories.length > 1 && (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                style={{
                  padding: "7px 16px", borderRadius: "20px", fontSize: "0.85rem", cursor: "pointer",
                  border: "1px solid " + (activeCat === cat ? "#1b2a4a" : "#ddd"),
                  background: activeCat === cat ? "#1b2a4a" : "#fff",
                  color: activeCat === cat ? "#fff" : "#555", transition: "all 0.2s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <Container className="py-5">
        {loading ? (
          <div className="row justify-content-center">
            {Array.from({ length: 12 }).map((_, i) => (
              <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4 d-flex justify-content-center" key={i}>
                <div className="pdg-skeleton" style={{ width: "140px", height: "112px" }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted py-5">
            {brands.length === 0
              ? "I nostri partner saranno presto disponibili. Torna a trovarci!"
              : "Nessun brand trovato."}
          </p>
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
                    display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none",
                    padding: "16px", borderRadius: "10px", border: "1px solid #eee", width: "140px",
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                >
                  <img src={mediaUrl(brand.logo)} alt={brand.name} style={{ maxWidth: "100px", maxHeight: "60px", objectFit: "contain" }} />
                  <span style={{ fontSize: "0.78rem", color: "#444", marginTop: "10px", textAlign: "center" }}>
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
