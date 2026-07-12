import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faUserPlus, faEye, faEyeSlash, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { changePassword, registerUser } from "../services/apiServices";

function PasswordField({ label, value, onChange, helpText }) {
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  const checkCaps = (e) => {
    if (e.getModifierState) setCaps(e.getModifierState("CapsLock"));
  };

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="input-group">
        <input
          type={show ? "text" : "password"}
          className="form-control"
          value={value}
          onChange={onChange}
          onKeyDown={checkCaps}
          onKeyUp={checkCaps}
          required
          minLength={8}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Nascondi password" : "Mostra password"}
          tabIndex={-1}
        >
          <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
        </button>
      </div>
      {helpText && <small className="text-muted">{helpText}</small>}
      {caps && (
        <div className="d-flex align-items-center gap-1 mt-1" style={{ color: "#b7791f", fontSize: "0.82rem" }}>
          <FontAwesomeIcon icon={faTriangleExclamation} />
          Blocco maiuscole (Caps Lock) attivo
        </div>
      )}
    </div>
  );
}

const AccountSettings = () => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [regFeedback, setRegFeedback] = useState(null);
  const [regLoading, setRegLoading] = useState(false);

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

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegFeedback(null);
    if (newPassword !== newPasswordConfirm) {
      return setRegFeedback({ type: "danger", msg: "Le password non coincidono" });
    }
    if (newPassword.length < 8) {
      return setRegFeedback({ type: "danger", msg: "La password deve avere almeno 8 caratteri" });
    }
    setRegLoading(true);
    try {
      await registerUser(newUsername, newEmail, newPassword);
      setRegFeedback({ type: "success", msg: `Account "${newUsername}" creato con successo` });
      setNewUsername(""); setNewEmail(""); setNewPassword(""); setNewPasswordConfirm("");
    } catch (err) {
      setRegFeedback({ type: "danger", msg: err.message });
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="row justify-content-center g-4">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-3">
              <FontAwesomeIcon icon={faKey} className="me-2 text-secondary" />
              Cambia password
            </h5>
            {feedback && <div className={`alert alert-${feedback.type}`}>{feedback.msg}</div>}
            <form onSubmit={handleSubmit}>
              <PasswordField label="Password attuale" value={current} onChange={(e) => setCurrent(e.target.value)} />
              <PasswordField label="Nuova password" value={next} onChange={(e) => setNext(e.target.value)} helpText="Almeno 8 caratteri" />
              <PasswordField label="Conferma nuova password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              <button className="btn btn-dark" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-1" /> : null}
                Aggiorna password
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-3">
              <FontAwesomeIcon icon={faUserPlus} className="me-2 text-secondary" />
              Crea nuovo amministratore
            </h5>
            <p className="text-muted small">Crea un accesso per un altro titolare o collaboratore. Avrà gli stessi permessi del tuo account.</p>
            {regFeedback && <div className={`alert alert-${regFeedback.type}`}>{regFeedback.msg}</div>}
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label">Nome utente</label>
                <input type="text" className="form-control" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
              </div>
              <PasswordField label="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} helpText="Almeno 8 caratteri" />
              <PasswordField label="Conferma password" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} />
              <button className="btn btn-dark" disabled={regLoading}>
                {regLoading ? <span className="spinner-border spinner-border-sm me-1" /> : null}
                Crea account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
