import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { changePassword } from "../services/apiServices";

const AccountSettings = () => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    if (next !== confirm) {
      return setFeedback({ type: "danger", msg: "Le nuove password non coincidono" });
    }
    if (next.length < 8) {
      return setFeedback({ type: "danger", msg: "La nuova password deve avere almeno 8 caratteri" });
    }
    setLoading(true);
    try {
      await changePassword(current, next);
      setFeedback({ type: "success", msg: "Password aggiornata con successo" });
      setCurrent(""); setNext(""); setConfirm("");
    } catch (err) {
      setFeedback({ type: "danger", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-3">
              <FontAwesomeIcon icon={faKey} className="me-2 text-secondary" />
              Cambia password
            </h5>
            {feedback && <div className={`alert alert-${feedback.type}`}>{feedback.msg}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Password attuale</label>
                <input type="password" className="form-control" value={current} onChange={(e) => setCurrent(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Nuova password</label>
                <input type="password" className="form-control" value={next} onChange={(e) => setNext(e.target.value)} required minLength={8} />
                <small className="text-muted">Almeno 8 caratteri</small>
              </div>
              <div className="mb-3">
                <label className="form-label">Conferma nuova password</label>
                <input type="password" className="form-control" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
              <button className="btn btn-dark" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-1" /> : null}
                Aggiorna password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
