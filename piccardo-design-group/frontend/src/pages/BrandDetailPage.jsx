import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { fetchMaterialBrandById } from "../services/apiServices";
import { mediaUrl } from "../utils/media";
import Seo from "../components/Seo";

function BrandDetailPage() {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchMaterialBrandById(id)
      .then((data) => {
        if (data && data._id) setBrand(data);
        else setNotFound(true);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <div className="text-center py-5" style={{ minHeight: "60vh" }}><div className="spinner-border" /></div>;

  if (notFound || !brand)
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Raleway, sans-serif" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }}>Brand non trovato</h2>
        <Link to="/materials" style={{ color: "#c8a96e" }}>← Torna ai brand</Link>
      </div>
    );

  return (
    <div style={{ fontFamily: "Raleway, sans-serif", minHeight: "70vh" }}>
      <Seo title={brand.name} description={brand.description || `${brand.name}, brand partner di Piccardo Design Group.`} />

      <div style={{ background: "#fafafa", borderBottom: "1px solid #eee", padding: "28px 20px" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <Link to="/materials" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Tutti i brand
          </Link>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: "900px" }}>
        <div className="row g-5 align-items-center">
          <div className="col-md-5 text-center">
            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: "16px", padding: "40px", boxShadow: "0 6px 24px rgba(0,0,0,0.05)" }}>
              <img src={mediaUrl(brand.logo)} alt={brand.name} style={{ maxWidth: "100%", maxHeight: "140px", objectFit: "contain" }} />
            </div>
          </div>
          <div className="col-md-7">
            {brand.category && (
              <span style={{ display: "inline-block", background: "rgba(200,169,110,0.15)", color: "#b3925a", padding: "5px 14px", borderRadius: "20px", fontSize: "0.78rem", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "14px" }}>
                {brand.category}
              </span>
            )}
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(2rem, 5vw, 3rem)", color: "#1b2a4a", marginBottom: "16px" }}>
              {brand.name}
            </h1>
            <p style={{ color: "#555", lineHeight: 1.9, fontSize: "1.05rem", marginBottom: "28px" }}>
              {brand.description || "Brand partner selezionato da Piccardo Design Group per qualità ed eccellenza nel design Made in Italy."}
            </p>
            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "linear-gradient(135deg,#1b2a4a,#24375f)", color: "#fff", padding: "13px 28px", borderRadius: "30px", textDecoration: "none", letterSpacing: "0.04em", fontSize: "0.95rem" }}
              >
                Visita il sito ufficiale
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandDetailPage;
