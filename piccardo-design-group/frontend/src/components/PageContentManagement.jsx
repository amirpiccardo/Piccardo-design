import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPlus, faTrash, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { fetchPageContent, savePageContent } from "../services/apiServices";
import { PAGES_META, mergeFields, resolveSections } from "../data/pageDefaults";

const PageContentManagement = () => {
  const [activeKey, setActiveKey] = useState(PAGES_META[0].key);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [fields, setFields] = useState({});
  const [sections, setSections] = useState([]);

  const meta = PAGES_META.find((p) => p.key === activeKey);

  useEffect(() => {
    setLoading(true);
    setFeedback(null);
    fetchPageContent(activeKey)
      .then((page) => {
        if (meta.type === "fields") {
          setFields(mergeFields(meta.defaults, page.fields));
        } else {
          setSections(resolveSections(meta.defaults, page.sections, page.updatedAt));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  const showFeedback = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (meta.type === "fields") {
        await savePageContent(activeKey, { fields, sections: [] });
      } else {
        await savePageContent(activeKey, { fields: {}, sections });
      }
      showFeedback("Pagina aggiornata con successo");
    } catch (err) {
      showFeedback(err.message || "Errore durante il salvataggio", "danger");
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (i, key, value) => {
    setSections((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  };

  const addSection = () => setSections((prev) => [...prev, { title: "", text: "" }]);
  const removeSection = (i) => setSections((prev) => prev.filter((_, idx) => idx !== i));
  const moveSection = (i, dir) => {
    setSections((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 mb-4">
        {PAGES_META.map((p) => (
          <button
            key={p.key}
            onClick={() => setActiveKey(p.key)}
            className={`btn btn-sm ${activeKey === p.key ? "btn-dark" : "btn-outline-secondary"}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {feedback && <div className={`alert alert-${feedback.type}`}>{feedback.msg}</div>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" /></div>
      ) : (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-3">{meta.label}</h5>

            {meta.type === "fields" && (
              <div className="row g-3">
                {meta.fields.map((f) => (
                  <div className="col-12" key={f.key}>
                    <label className="form-label small text-muted">{f.label}</label>
                    {f.type === "textarea" ? (
                      <textarea
                        className="form-control"
                        rows={3}
                        value={fields[f.key] || ""}
                        onChange={(e) => setFields((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        value={fields[f.key] || ""}
                        onChange={(e) => setFields((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {meta.type === "sections" && (
              <div>
                {sections.map((s, i) => (
                  <div key={i} className="border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small text-muted">#{i + 1}</span>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-secondary" disabled={i === 0} onClick={() => moveSection(i, -1)}>
                          <FontAwesomeIcon icon={faArrowUp} />
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" disabled={i === sections.length - 1} onClick={() => moveSection(i, 1)}>
                          <FontAwesomeIcon icon={faArrowDown} />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeSection(i)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                    <label className="form-label small text-muted">{meta.sectionTitleLabel}</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={s.title}
                      onChange={(e) => updateSection(i, "title", e.target.value)}
                    />
                    <label className="form-label small text-muted">{meta.sectionTextLabel}</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={s.text}
                      onChange={(e) => updateSection(i, "text", e.target.value)}
                    />
                  </div>
                ))}
                <button className="btn btn-sm btn-outline-dark" onClick={addSection}>
                  <FontAwesomeIcon icon={faPlus} className="me-1" /> Aggiungi
                </button>
              </div>
            )}

            <div className="mt-4">
              <button className="btn btn-dark" onClick={handleSave} disabled={saving}>
                {saving ? <span className="spinner-border spinner-border-sm me-1" /> : <FontAwesomeIcon icon={faSave} className="me-1" />}
                Salva modifiche
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageContentManagement;
