import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEnvelope, faUser, faComment, faFileCsv, faSearch } from "@fortawesome/free-solid-svg-icons";
import { fetchContacts, deleteContact, markContactRead } from "../services/apiServices";
import { exportToCsv } from "../utils/csv";
import useConfirm from "../hooks/useConfirm";

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");
  const [confirm, confirmUI] = useConfirm();

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
    if (!(await confirm({ title: "Eliminare il messaggio?", message: "L'operazione non è reversibile.", danger: true, confirmLabel: "Elimina" }))) return;
    try {
      await deleteContact(id);
      showFeedback("Messaggio eliminato");
      load();
    } catch {
      showFeedback("Errore durante l'eliminazione", "danger");
    }
  };

  const handleOpen = (contact) => {
    if (contact.read) return;
    setContacts((prev) => prev.map((c) => (c._id === contact._id ? { ...c, read: true } : c)));
    markContactRead(contact._id).catch(() => {});
  };

  const unreadCount = contacts.filter((c) => !c.read).length;

  const filtered = contacts
    .filter((c) => {
      const q = search.toLowerCase();
      return (c.name || "").toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q) || (c.message || "").toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (!a.read !== !b.read) return a.read ? 1 : -1;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
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
      {confirmUI}
      {feedback && <div className={`alert alert-${feedback.type}`}>{feedback.msg}</div>}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h5 className="mb-0">
          Messaggi ricevuti ({filtered.length})
          {unreadCount > 0 && (
            <span className="badge bg-danger ms-2" style={{ verticalAlign: "middle" }}>{unreadCount} nuovi</span>
          )}
        </h5>
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
              <div
                className="card h-100"
                onClick={() => handleOpen(contact)}
                style={{
                  borderLeft: contact.read ? "1px solid #dee2e6" : "3px solid #c8a96e",
                  background: contact.read ? "#fff" : "#fffdf7",
                  cursor: contact.read ? "default" : "pointer",
                }}
              >
                <div className="card-body">
                  <p className="mb-1 d-flex align-items-center justify-content-between">
                    <span>
                      <FontAwesomeIcon icon={faUser} className="me-2 text-secondary" />
                      <strong>{contact.name}</strong>
                    </span>
                    {!contact.read && <span className="badge bg-warning text-dark">Nuovo</span>}
                  </p>
                  <p className="mb-1 small">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2 text-secondary" />
                    <a href={`mailto:${contact.email}`} onClick={(e) => e.stopPropagation()}>{contact.email}</a>
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
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={(e) => { e.stopPropagation(); handleDelete(contact._id); }}
                  >
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
