import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { PAGE_SCHEMAS } from "./schemas";
import { getPage, savePage } from "./api";
import { mergePage } from "../lib/content";
import { Field, ImageField, GalleryField, Loading, MoveButtons, useAdmin, useConfirm } from "./ui";
import { useRefreshContent } from "../context/ContentContext";

function Sections({ cfg, items, setItems }) {
  const update = (i, k, v) => setItems(items.map((s, j) => (j === i ? { ...s, [k]: v } : s)));
  const move = (i, d) => {
    const n = [...items];
    const j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    setItems(n);
  };
  return (
    <fieldset className="group">
      <legend>{cfg.title}</legend>
      <div className="rep">
        {items.map((s, i) => (
          <div className="rep__item" key={i}>
            <div className="rep__bar">
              <span>{cfg.item} {i + 1}</span>
              <span className="row" style={{ gap: 6 }}>
                <MoveButtons index={i} total={items.length} onMove={move} />
                <button type="button" className="b b--danger b--icon" onClick={() => setItems(items.filter((_, j) => j !== i))} aria-label={`Elimina ${cfg.item} ${i + 1}`}><FontAwesomeIcon icon={faTrash} /></button>
              </span>
            </div>
            <Field id={`s-${i}-t`} label={cfg.titleLabel} value={s.title} onChange={(v) => update(i, "title", v)} />
            <Field id={`s-${i}-x`} label={cfg.textLabel} type="textarea" rows={3} value={s.text} onChange={(v) => update(i, "text", v)} />
            {cfg.ctaLabel && <Field id={`s-${i}-c`} label={cfg.ctaLabel} value={s.cta} onChange={(v) => update(i, "cta", v)} />}
          </div>
        ))}
      </div>
      <div><button type="button" className="b b--ghost" onClick={() => setItems([...items, { title: "", text: "", ...(cfg.ctaLabel ? { cta: "Richiedi" } : {}) }])}><FontAwesomeIcon icon={faPlus} /> Aggiungi {cfg.item}</button></div>
    </fieldset>
  );
}

function renderField(f, value, set) {
  const id = `pf-${f.key}`;
  if (f.type === "image") return <ImageField key={f.key} id={id} label={f.label} hint={f.hint} value={value} onChange={set} />;
  if (f.type === "gallery") return <GalleryField key={f.key} label={f.label} hint={f.hint} value={value} onChange={set} />;
  return <Field key={f.key} id={id} label={f.label} hint={f.type === "lines" ? f.hint || "Una voce per riga." : f.hint} type={f.type} rows={f.rows} max={f.max} value={value} onChange={set} />;
}

export default function PagesEditor() {
  const [key, setKey] = useState(PAGE_SCHEMAS[0].key);
  const [page, setPage] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const { notify, changed } = useAdmin();
  const [confirm, confirmUI] = useConfirm();
  const refresh = useRefreshContent();
  const schema = PAGE_SCHEMAS.find((p) => p.key === key);

  useEffect(() => {
    let alive = true;
    setPage(null);
    getPage(key)
      .then((saved) => alive && setPage(mergePage(key, saved)))
      .catch((e) => { notify(e.message, "err"); alive && setPage(mergePage(key, null)); });
    setDirty(false);
    return () => { alive = false; };
  }, [key, notify]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const switchTo = async (k) => {
    if (k === key) return;
    if (dirty && !(await confirm({ title: "Modifiche non salvate", message: "Se cambi pagina perdi le modifiche fatte qui.", confirmLabel: "Cambia senza salvare", danger: true }))) return;
    setKey(k);
  };

  const setField = (k) => (v) => { setPage((p) => ({ ...p, fields: { ...p.fields, [k]: v } })); setDirty(true); };
  const setSections = (s) => { setPage((p) => ({ ...p, sections: s })); setDirty(true); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await savePage(key, page.fields, page.sections);
      setDirty(false);
      notify("Pagina salvata");
      changed();
      refresh();
    } catch (err) {
      notify(err.message, "err");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="stack">
      {confirmUI}
      <div className="row" role="tablist" aria-label="Pagine">
        {PAGE_SCHEMAS.map((p) => (
          <button key={p.key} type="button" role="tab" aria-selected={p.key === key} className={`b b--sm ${p.key === key ? "" : "b--ghost"}`} onClick={() => switchTo(p.key)}>{p.label}</button>
        ))}
      </div>
      {!page ? <Loading /> : (
        <form className="card" onSubmit={save}>
          <div className="row"><h2>{schema.label}</h2><span className="spacer" />{dirty && <span className="tag tag--warn">Modifiche non salvate</span>}</div>
          {schema.groups.map((g) => (
            <fieldset className="group" key={g.legend}>
              <legend>{g.legend}</legend>
              {g.fields.map((f) => renderField(f, page.fields[f.key], setField(f.key)))}
            </fieldset>
          ))}
          {schema.sections && <Sections cfg={schema.sections} items={page.sections || []} setItems={setSections} />}
          <div className="row" style={{ position: "sticky", bottom: 0, background: "var(--paper)", padding: "12px 0", borderTop: "1px solid var(--line)" }}>
            <button className="b" type="submit" disabled={saving || !dirty}>{saving ? <span className="spin" /> : null}Salva {schema.label}</button>
            {!dirty && <span className="sub">Tutto salvato</span>}
          </div>
        </form>
      )}
    </div>
  );
}
