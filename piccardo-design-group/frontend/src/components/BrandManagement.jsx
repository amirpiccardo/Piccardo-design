import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { fetchBrands, addBrand, updateBrand, deleteBrand } from "../services/apiServices";
import { mediaUrl } from "../utils/media";

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [form, setForm] = useState({ name: "", logo: null, website: "" });
  const [editId, setEditId] = useState(null);

  const load = () => {
    setLoading(true);
    fetchBrands()
      .then((data) => { setBrands(data); setLoading(false); })
      .catch(() => { setError("Errore nel caricamento dei brand"); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const reset = () => { setForm({ name: "", logo: null, website: "" }); setEditId(null); };

  const showFeedback = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleChange = (e) => {
    if (e.target.name === "logo") {
      setForm({ ...form, logo: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    if (!form.name) return showFeedback("Il nome è obbligatorio", "danger");
    if (!editId && !form.logo) return showFeedback("Il logo è obbligatorio", "danger");
    setSaving(true);
    try {
      if (editId) {
        await updateBrand(editId, form);
        showFeedback("Brand aggiornato con successo");
      } else {
        await addBrand(form);
        showFeedback("Brand aggiunto con successo");
      }
      reset();
      load();
    } catch {
      showFeedback("Errore durante il salvataggio", "danger");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (brand) => {
    setEditId(brand._id);
    setForm({ name: brand.name, logo: null, website: brand.website || "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo brand?")) return;
    try {
      await deleteBrand(id);
      showFeedback("Brand eliminato");
      load();
    } catch {
      showFeedback("Errore durante l'eliminazione", "danger");
    }
  };

  const normalizePath = (p) => (p || "").replace(/\\/g, "/");

  if (loading) return <div className="text-center py-5"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      {feedback && (
        <div className={`alert alert-${feedback.type} alert-dismissible`}>
          {feedback.msg}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">{editId ? "Modifica Brand" : "Aggiungi Brand"}</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Nome brand"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                name="website"
                placeholder="Sito web (es. https://...)"
                value={form.website}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="file"
                className="form-control"
                name="logo"
                accept="image/*"
                onChange={handleChange}
              />
              {editId && <small className="text-muted">Lascia vuoto per non cambiare il logo</small>}
            </div>
          </div>
          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-dark" onClick={handleSubmit} disabled={saving}>
              {saving
                ? <span className="spinner-border spinner-border-sm me-1" />
                : <FontAwesomeIcon icon={editId ? faSave : faPlus} className="me-1" />}
              {editId ? "Salva" : "Aggiungi"}
            </button>
            {editId && (
              <button className="btn btn-outline-secondary" onClick={reset}>
                <FontAwesomeIcon icon={faTimes} className="me-1" /> Annulla
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        {brands.map((brand) => (
          <div className="col-sm-6 col-md-4 col-lg-3 mb-3" key={brand._id}>
            <div className="card h-100 text-center">
              <div className="card-body d-flex flex-column align-items-center justify-content-between">
                <img
                  src={mediaUrl(brand.logo)}
                  alt={brand.name}
                  style={{ maxHeight: "70px", maxWidth: "140px", objectFit: "contain", marginBottom: "10px" }}
                />
                <p className="fw-semibold mb-2">{brand.name}</p>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEdit(brand)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(brand._id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {brands.length === 0 && <p className="text-muted">Nessun brand presente.</p>}
      </div>
    </div>
  );
};

export default BrandManagement;
