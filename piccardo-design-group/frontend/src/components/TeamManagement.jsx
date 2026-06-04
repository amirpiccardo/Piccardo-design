import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { fetchTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from "../services/apiServices";
import { mediaUrl } from "../utils/media";
import useConfirm from "../hooks/useConfirm";

const TeamManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [form, setForm] = useState({ name: "", role: "", photo: null });
  const [editId, setEditId] = useState(null);
  const [confirm, confirmUI] = useConfirm();

  const load = () => {
    setLoading(true);
    fetchTeamMembers()
      .then((data) => { setMembers(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const reset = () => { setForm({ name: "", role: "", photo: null }); setEditId(null); };

  const showFeedback = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setForm({ ...form, photo: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.role) return showFeedback("Nome e ruolo sono obbligatori", "danger");
    if (!editId && !form.photo) return showFeedback("La foto è obbligatoria", "danger");
    setSaving(true);
    try {
      if (editId) {
        await updateTeamMember(editId, form);
        showFeedback("Membro aggiornato con successo");
      } else {
        await addTeamMember(form);
        showFeedback("Membro aggiunto con successo");
      }
      reset();
      load();
    } catch {
      showFeedback("Errore durante il salvataggio", "danger");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member) => {
    setEditId(member._id);
    setForm({ name: member.name, role: member.role, photo: null });
  };

  const handleDelete = async (id) => {
    if (!(await confirm({ title: "Eliminare il membro?", message: "L'operazione non è reversibile.", danger: true, confirmLabel: "Elimina" }))) return;
    try {
      await deleteTeamMember(id);
      showFeedback("Membro eliminato");
      load();
    } catch {
      showFeedback("Errore durante l'eliminazione", "danger");
    }
  };

  const normalizePath = (p) => (p || "").replace(/\\/g, "/");

  if (loading) return <div className="text-center py-5"><div className="spinner-border" /></div>;

  return (
    <div>
      {confirmUI}
      {feedback && <div className={`alert alert-${feedback.type}`}>{feedback.msg}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">{editId ? "Modifica Membro" : "Aggiungi Membro"}</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <input type="text" className="form-control" name="name" placeholder="Nome" value={form.name} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <input type="text" className="form-control" name="role" placeholder="Ruolo" value={form.role} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <input type="file" className="form-control" name="photo" accept="image/*" onChange={handleChange} />
              {editId && <small className="text-muted">Lascia vuoto per non cambiare la foto</small>}
              {form.photo instanceof File && (
                <img src={URL.createObjectURL(form.photo)} alt="anteprima" style={{ marginTop: 8, height: 56, width: 56, objectFit: "cover", borderRadius: "50%", border: "1px solid #eee" }} />
              )}
            </div>
          </div>
          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-dark" onClick={handleSubmit} disabled={saving}>
              {saving ? <span className="spinner-border spinner-border-sm me-1" /> : <FontAwesomeIcon icon={editId ? faSave : faPlus} className="me-1" />}
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
        {members.map((member) => (
          <div className="col-sm-6 col-md-4 col-lg-3 mb-3" key={member._id}>
            <div className="card h-100 text-center">
              <div className="card-body d-flex flex-column align-items-center">
                <img
                  src={mediaUrl(member.photo)}
                  alt={member.name}
                  style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }}
                />
                <p className="fw-semibold mb-0">{member.name}</p>
                <p className="text-muted small mb-2">{member.role}</p>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEdit(member)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(member._id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {members.length === 0 && <p className="text-muted">Nessun membro presente.</p>}
      </div>
    </div>
  );
};

export default TeamManagement;
