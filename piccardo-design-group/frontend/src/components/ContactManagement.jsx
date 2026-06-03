import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEnvelope, faUser, faComment, faFileCsv, faSearch } from "@fortawesome/free-solid-svg-icons";
import { fetchContacts, deleteContact } from "../services/apiServices";
import { exportToCsv } from "../utils/csv";

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    fetchContacts()
      .then((data) => { setContacts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showFeedback = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Eliminare questo messaggio?")) return;
    try {
      await deleteContact(id);
      showFeedback("Messaggio eliminato");
      load();
    } catch {
      showFeedback("Errore durante l'eliminazione", "danger");
    }
  };

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (c.name || "").toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q) || (c.message || "").toLowerCase().includes(q);
  });

  const handleExport = () => {
    exportToCsv("contatti.csv", filtered, [
      { label: "Nome", value: (r) => r.name },
      { label: "Email", value: (r) => r.email },
      { label: "Messaggio", value: (r) => r.message },
      { label: "Data", value: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleString("it-IT") : "") },
    ]);
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border" /></div>;

  return (
    <div>
      {feedback && <div className={`alert alert-${feedback.type}`}>{feedback.msg}</div>}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h5 className="mb-0">Messaggi ricevuti ({filtered.length})</h5>
        <div className="d-flex gap-2">
          <div className="input-group input-group-sm" style={{ width: "220px" }}>
            <span className="input-group-text"><FontAwesomeIcon icon={faSearch} /></span>
            <input className="form-control" placeholder="Cerca..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-sm btn-outline-dark" onClick={handleExport} disabled={filtered.length === 0}>
            <FontAwesomeIcon icon={faFileCsv} className="me-1" /> Esporta CSV
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted">{contacts.length === 0 ? "Nessun messaggio ricevuto." : "Nessun risultato."}</p>
      ) : (
        <div className="row">
          {filtered.map((contact) => (
            <div className="col-md-6 col-lg-4 mb-3" key={contact._id}>
              <div className="card h-100">
                <div className="card-body">
                  <p className="mb-1">
                    <FontAwesomeIcon icon={faUser} className="me-2 text-secondary" />
                    <strong>{contact.name}</strong>
                  </p>
                  <p className="mb-1 small">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2 text-secondary" />
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </p>
                  <hr className="my-2" />
                  <p className="mb-2 small">
                    <FontAwesomeIcon icon={faComment} className="me-2 text-secondary" />
                    {contact.message}
                  </p>
                  {contact.createdAt && (
                    <p className="text-muted" style={{ fontSize: "0.75rem" }}>
                      {new Date(contact.createdAt).toLocaleDateString("it-IT", {
                        day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  )}
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(contact._id)}>
                    <FontAwesomeIcon icon={faTrash} className="me-1" /> Elimina
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactManagement;
