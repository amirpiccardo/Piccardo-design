import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { fetchContractBrands } from "../services/apiServices";
import { mediaUrl } from "../utils/media";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHotel, faBed, faSchool, faChair } from "@fortawesome/free-solid-svg-icons";

const services = [
  { icon: faHotel, title: "Hotel & B&B", text: "Arredamento e illuminazione per camere, hall e spazi comuni, su misura per ogni struttura ricettiva." },
  { icon: faSchool, title: "Studentati & Auditorium", text: "Forniture importanti per grandi ambienti: sale comuni, aule, spazi collettivi." },
  { icon: faChair, title: "Forniture importanti", text: "Sedute, tavoli e complementi per grandi progetti, con la qualità del Made in Italy." },
  { icon: faBed, title: "Consulenza dedicata", text: "Ti affianchiamo dalla scelta dei prodotti alla fornitura, per progetti di ogni dimensione." },
];

function Contracts() {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContractBrands()
      .then((data) => { setBrands(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

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
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            letterSpacing: "0.02em",
            marginBottom: "12px",
          }}
        >
          Contract
        </h1>
        <p style={{ color: "#777", fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto" }}>
          Consulenza e forniture di arredamento e illuminazione per grandi progetti:
          hotel, B&B, pensioni, studentati, auditorium e strutture che richiedono
          forniture importanti.
        </p>
      </div>

      <Container className="py-5">
        <div className="row g-4 mb-5">
          {services.map((s) => (
            <div className="col-6 col-lg-3" key={s.title}>
              <div className="pdg-tilt text-center" style={{ padding: "24px 16px", border: "1px solid #eee", borderRadius: "12px", height: "100%" }}>
                <FontAwesomeIcon icon={s.icon} style={{ fontSize: "1.8rem", color: "#c8a96e", marginBottom: "14px" }} />
                <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "8px" }}>{s.title}</h3>
                <p style={{ color: "#666", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        {brands.length > 0 && (
          <>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "1.8rem", textAlign: "center", marginBottom: "24px" }}>
              I nostri partner contract
            </h2>
            <div style={{ maxWidth: "400px", margin: "0 auto 30px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Cerca brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ borderRadius: "30px", padding: "10px 20px", border: "1px solid #ddd" }}
              />
            </div>
          </>
        )}

        {loading ? (
          <div className="row">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="col-12 col-sm-6 col-md-4 mb-4" key={i}>
                <div className="pdg-skeleton" style={{ width: "100%", height: "260px", borderRadius: "8px" }} />
              </div>
            ))}
          </div>
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
