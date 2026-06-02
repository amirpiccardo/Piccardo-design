import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { fetchSubscribers, deleteSubscriber } from "../services/apiServices";

const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const load = () => {
    setLoading(true);
    fetchSubscribers()
      .then((data) => { setSubscribers(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showFeedback = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (email) => {
    if (!window.confirm(`Rimuovere ${email} dalla newsletter?`)) return;
    try {
      await deleteSubscriber(email);
      showFeedback("Iscritto rimosso");
      load();
    } catch {
      showFeedback("Errore durante la rimozione", "danger");
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border" /></div>;

  return (
    <div>
      {feedback && <div className={`alert alert-${feedback.type}`}>{feedback.msg}</div>}

      <h5 className="mb-3">Iscritti alla newsletter ({subscribers.length})</h5>

      {subscribers.length === 0 ? (
        <p className="text-muted">Nessun iscritto.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th><FontAwesomeIcon icon={faEnvelope} className="me-2" />Email</th>
                <th>Data iscrizione</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub._id || sub.email}>
                  <td>{sub.email}</td>
                  <td>
                    {sub.createdAt
                      ? new Date(sub.createdAt).toLocaleDateString("it-IT")
                      : "—"}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(sub.email)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NewsletterManagement;
