import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEnvelope, faUser, faComment } from "@fortawesome/free-solid-svg-icons";
import { fetchContacts, deleteContact } from "../services/apiServices";

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const load = () => {
    setLoading(true);
    fetchContacts()
      .then((data) => { setContacts(data); setLoading(false); })
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

  if (loading) return <div className="text-center py-5"><div className="spinner-border" /></div>;

  return (
    <div>
      {feedback && <div className={`alert alert-${feedback.type}`}>{feedback.msg}</div>}

      <h5 className="mb-3">Messaggi ricevuti ({contacts.length})</h5>

      {contacts.length === 0 ? (
        <p className="text-muted">Nessun messaggio ricevuto.</p>
      ) : (
        <div className="row">
          {contacts.map((contact) => (
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
