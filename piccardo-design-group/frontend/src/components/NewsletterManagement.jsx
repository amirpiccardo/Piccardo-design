import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEnvelope, faFileCsv, faSearch } from "@fortawesome/free-solid-svg-icons";
import { fetchSubscribers, deleteSubscriber } from "../services/apiServices";
import { exportToCsv } from "../utils/csv";
import useConfirm from "../hooks/useConfirm";

const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");
  const [confirm, confirmUI] = useConfirm();

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
    if (!(await confirm({ title: "Rimuovere l'iscritto?", message: `${email} verrà rimosso dalla newsletter.`, danger: true, confirmLabel: "Rimuovi" }))) return;
    try {
      await deleteSubscriber(email);
      showFeedback("Iscritto rimosso");
      load();
    } catch {
      showFeedback("Errore durante la rimozione", "danger");
    }
  };

  const filtered = subscribers.filter((s) => (s.email || "").toLowerCase().includes(search.toLowerCase()));

  const handleExport = () => {
    exportToCsv("iscritti-newsletter.csv", filtered, [
      { label: "Email", value: (r) => r.email },
      { label: "Data iscrizione", value: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleDateString("it-IT") : "") },
    ]);
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border" /></div>;

  return (
    <div>
      {confirmUI}
      {feedback && <div className={`alert alert-${feedback.type}`}>{feedback.msg}</div>}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h5 className="mb-0">Iscritti alla newsletter ({filtered.length})</h5>
        <div className="d-flex gap-2">
          <div className="input-group input-group-sm" style={{ width: "220px" }}>
            <span className="input-group-text"><FontAwesomeIcon icon={faSearch} /></span>
            <input className="form-control" placeholder="Cerca email..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-sm btn-outline-dark" onClick={handleExport} disabled={filtered.length === 0}>
            <FontAwesomeIcon icon={faFileCsv} className="me-1" /> Esporta CSV
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted">{subscribers.length === 0 ? "Nessun iscritto." : "Nessun risultato."}</p>
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
              {filtered.map((sub) => (
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
