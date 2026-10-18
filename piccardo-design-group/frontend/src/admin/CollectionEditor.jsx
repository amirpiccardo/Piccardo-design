import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { list, insert, update, remove, reorder, deleteImage, slugify } from "./api";
import { Field, ImageField, GalleryField, Loading, MoveButtons, useAdmin, useConfirm } from "./ui";
import { useRefreshContent } from "../context/ContentContext";
import { imgUrl } from "../lib/media";
import { CatalogsField, CatalogsLink } from "./Catalogs";

// Configurazione delle raccolte gestibili (marchi, persone, contract).
export const COLLECTIONS = {
  brands: {
    table: "brands",
    noun: "marchio",
    title: (r) => r.name,
    subtitle: (r) => [r.category, `/marchi/${r.slug}`].filter(Boolean).join(" · "),
    thumb: (r) => r.logo,
    empty: { name: "", slug: "", logo: "", website: "", category: "", description: "", photos: [] },
    required: ["name", "logo"],
    fields: [
      { key: "name", label: "Nome del marchio", type: "text" },
      { key: "slug", label: "Indirizzo della pagina", type: "slug", hint: "Si crea dal nome. Cambialo solo se serve: il vecchio link smette di funzionare." },
      { key: "logo", label: "Logo", type: "logo", hint: "PNG con sfondo trasparente o SVG, se possibile." },
      { key: "category", label: "Categoria", type: "text", hint: "Esempio: Bagno, Sedute e tavoli. Serve anche per i filtri." },
      { key: "description", label: "Descrizione", type: "textarea", rows: 3, hint: "Due righe su cosa produce. Appare nella pagina del marchio e su Google." },
      { key: "website", label: "Sito ufficiale", type: "url" },
      { key: "photos", label: "Foto del marchio", type: "gallery", hint: "La prima è quella che appare nell'indice dei marchi in home." },
      { key: "catalogs", type: "catalogs" },
    ],
  },
  team: {
    table: "team_members",
    noun: "persona",
    title: (r) => r.name,
    subtitle: (r) => r.role,
    thumb: (r) => r.photo,
    cover: true,
    empty: { name: "", role: "", photo: "", bio: "", linkedin: "" },
    required: ["name", "role"],
    fields: [
      { key: "name", label: "Nome e cognome", type: "text" },
      { key: "role", label: "Ruolo", type: "text" },
      { key: "photo", label: "Foto", type: "photo", hint: "Verticale, viso ben illuminato. Sul sito diventa in bianco e nero su fondo colorato." },
      { key: "bio", label: "Presentazione", type: "textarea", rows: 4 },
      { key: "linkedin", label: "Profilo LinkedIn", type: "url" },
    ],
  },
  contractTypes: {
    table: "contract_types",
    noun: "tipo di progetto",
    title: (r) => r.title,
    subtitle: (r) => r.text,
    thumb: (r) => r.photo,
    cover: true,
    empty: { title: "", text: "", photo: "" },
    required: ["title", "photo"],
    fields: [
      { key: "title", label: "Tipo di progetto", type: "text", hint: "Esempio: Hotel e B&B" },
      { key: "text", label: "Descrizione breve", type: "textarea", rows: 2 },
      { key: "photo", label: "Foto", type: "photo" },
    ],
  },
  contractBrands: {
    table: "contract_brands",
    noun: "marchio contract",
    title: (r) => r.name,
    subtitle: (r) => r.category || r.website,
    thumb: (r) => r.logo,
    empty: { name: "", logo: "", website: "", category: "", description: "" },
    required: ["name", "logo"],
    fields: [
      { key: "name", label: "Nome", type: "text" },
      { key: "logo", label: "Logo", type: "logo" },
      { key: "category", label: "Categoria", type: "text" },
      { key: "website", label: "Sito ufficiale", type: "url" },
      { key: "description", label: "Descrizione", type: "textarea", rows: 2 },
    ],
  },
};

const LABEL = { name: "il nome", logo: "il logo", role: "il ruolo", title: "il titolo", photo: "la foto" };

export default function CollectionEditor({ kind }) {
  const cfg = COLLECTIONS[kind];
  const [rows, setRows] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const { notify, changed } = useAdmin();
  const [confirm, confirmUI] = useConfirm();
  const refresh = useRefreshContent();

  const load = useCallback(() => list(cfg.table).then(setRows).catch((e) => { notify(e.message, "err"); setRows([]); }), [cfg.table, notify]);
  useEffect(() => { setForm(null); setRows(null); load(); }, [load]);

  const after = () => { changed(); refresh(); load(); };

  const save = async (e) => {
    e.preventDefault();
    const missing = cfg.required.find((k) => !imgUrl(form[k]) && !String(form[k] || "").trim());
    if (missing) return notify(`Manca ${LABEL[missing] || missing}.`, "err");
    if (form.website && !/^https?:\/\//.test(form.website)) return notify("Il sito deve iniziare con https://", "err");
    const data = { ...form };
    delete data.id; delete data.created_at; delete data.updated_at;
    if (kind === "brands") {
      data.slug = slugify(data.slug || data.name);
      if (!data.slug) return notify("Indirizzo della pagina non valido.", "err");
    }
    setSaving(true);
    try {
      if (form.id) await update(cfg.table, form.id, data);
      else await insert(cfg.table, { ...data, position: (rows?.length || 0) + 1 });
      notify(form.id ? "Modifiche salvate" : `Aggiunto: ${cfg.title(data)}`);
      setForm(null);
      after();
    } catch (err) {
      notify(err.message, "err");
    } finally {
      setSaving(false);
    }
  };

  const del = async (r) => {
    if (!(await confirm({ title: `Eliminare ${cfg.title(r)}?`, message: "Sparisce dal sito. L'operazione non si può annullare.", confirmLabel: "Elimina", danger: true }))) return;
    try {
      await remove(cfg.table, r.id);
      [r.logo, r.photo, ...(r.photos || []).map(imgUrl)].forEach((u) => deleteImage(u));
      notify("Eliminato");
      after();
    } catch (err) {
      notify(err.message, "err");
    }
  };

  const move = async (i, d) => {
    const n = [...rows];
    const j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    setRows(n);
    try { await reorder(cfg.table, n); changed(); refresh(); } catch (err) { notify(err.message, "err"); load(); }
  };

  const set = (k) => (v) => setForm((f) => {
    const next = { ...f, [k]: v };
    if (kind === "brands" && k === "name" && !f.id && (!f.slug || f.slug === slugify(f.name))) next.slug = slugify(v);
    return next;
  });

  const renderField = (f) => {
    const id = `cf-${f.key}`;
    const v = form[f.key];
    if (f.type === "logo") return <ImageField key={f.key} id={id} label={f.label} hint={f.hint} value={v} onChange={set(f.key)} kind="logo" folder="loghi" withAlt={false} />;
    if (f.type === "photo") return <ImageField key={f.key} id={id} label={f.label} hint={f.hint} value={v} onChange={set(f.key)} withAlt={false} />;
    if (f.type === "catalogs") return <CatalogsField key={f.key} brandId={form.id} />;
    if (f.type === "gallery") return <GalleryField key={f.key} label={f.label} hint={f.hint} value={v} onChange={set(f.key)} />;
    if (f.type === "slug") return <Field key={f.key} id={id} label={f.label} hint={`${f.hint} Risultato: /marchi/${slugify(v || form.name) || "..."}`} value={v} onChange={set(f.key)} />;
    return <Field key={f.key} id={id} label={f.label} hint={f.hint} type={f.type} rows={f.rows} value={v} onChange={set(f.key)} />;
  };

  return (
    <div className="stack">
      {confirmUI}
      {kind === "brands" && !form && <CatalogsLink />}
      {form ? (
        <form className="card" onSubmit={save}>
          <h2>{form.id ? `Modifica ${cfg.title(form) || cfg.noun}` : `Nuovo ${cfg.noun}`}</h2>
          <div className="stack">{cfg.fields.map(renderField)}</div>
          <div className="row">
            <button className="b" type="submit" disabled={saving}>{saving && <span className="spin" />}{form.id ? "Salva modifiche" : "Aggiungi"}</button>
            <button className="b b--ghost" type="button" onClick={() => setForm(null)}>Annulla</button>
          </div>
        </form>
      ) : (
        <div className="row"><button className="b" type="button" onClick={() => setForm({ ...cfg.empty })}><FontAwesomeIcon icon={faPlus} /> Aggiungi {cfg.noun}</button></div>
      )}

      {!rows ? <Loading /> : rows.length === 0 ? (
        <div className="empty">Nessun elemento. Aggiungi il primo con il pulsante qui sopra.</div>
      ) : (
        <div className="items">
          {rows.map((r, i) => (
            <div className="item" key={r.id}>
              <div className="item__img">{imgUrl(cfg.thumb(r)) && <img className={cfg.cover ? "cover" : ""} src={imgUrl(cfg.thumb(r))} alt="" loading="lazy" />}</div>
              <div className="item__body"><b>{cfg.title(r)}</b><span>{cfg.subtitle(r)}</span></div>
              <div className="item__actions">
                <MoveButtons index={i} total={rows.length} onMove={move} />
                <button type="button" className="b b--ghost b--sm" onClick={() => { setForm({ ...cfg.empty, ...r }); window.scrollTo({ top: 0, behavior: "smooth" }); }}><FontAwesomeIcon icon={faPen} /> Modifica</button>
                <button type="button" className="b b--danger b--sm" onClick={() => del(r)}><FontAwesomeIcon icon={faTrash} /> Elimina</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
