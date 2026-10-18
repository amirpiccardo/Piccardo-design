import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faTrash, faUpload, faCopy, faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { listCatalogs, uploadCatalog, updateCatalog, deleteCatalog, reorderCatalogs, getCatalogsKey, renewCatalogsKey } from "./api";
import { MoveButtons, useAdmin, useConfirm } from "./ui";

export const formatSize = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1).replace(".", ",")} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

// Cataloghi PDF di un marchio: si salvano subito, senza premere "Salva modifiche".
export function CatalogsField({ brandId }) {
  const { notify } = useAdmin();
  const [confirm, confirmUI] = useConfirm();
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(0);

  const load = useCallback(() => listCatalogs(brandId).then(setRows).catch((e) => notify(e.message, "err")), [brandId, notify]);
  useEffect(() => { if (brandId) load(); }, [brandId, load]);

  if (!brandId) {
    return (
      <div className="f">
        <span className="lbl">Cataloghi PDF per i rivenditori</span>
        <span className="hint">Aggiungi prima il marchio: poi, da Modifica, potrai caricare i cataloghi.</span>
      </div>
    );
  }

  const add = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    if (!files.length) return;
    setBusy(files.length);
    let pos = rows.length;
    for (const file of files) {
      try { await uploadCatalog(brandId, file, ++pos); } catch (err) { notify(`${file.name}: ${err.message}`, "err"); }
      setBusy((n) => n - 1);
    }
    notify("Cataloghi caricati");
    load();
  };

  const rename = async (r, title) => {
    if (!title.trim() || title === r.title) return;
    try { await updateCatalog(r.id, { title: title.trim() }); load(); } catch (err) { notify(err.message, "err"); }
  };

  const del = async (r) => {
    if (!(await confirm({ title: `Eliminare "${r.title}"?`, message: "Il PDF non sarà più scaricabile dai rivenditori.", confirmLabel: "Elimina", danger: true }))) return;
    try { await deleteCatalog(r); notify("Catalogo eliminato"); load(); } catch (err) { notify(err.message, "err"); }
  };

  const move = async (i, d) => {
    const n = [...rows];
    const j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    setRows(n);
    try { await reorderCatalogs(n); } catch (err) { notify(err.message, "err"); load(); }
  };

  return (
    <div className="f">
      {confirmUI}
      <span className="lbl">Cataloghi PDF per i rivenditori</span>
      <span className="hint">Visibili solo dalla pagina nascosta dei cataloghi. Massimo 50 MB per file. Si salvano subito.</span>
      <div className="items">
        {rows.map((r, i) => (
          <div className="item" key={r.id}>
            <div className="item__img"><FontAwesomeIcon icon={faFilePdf} size="2x" /></div>
            <div className="item__body">
              <input aria-label="Nome del catalogo" defaultValue={r.title} onBlur={(e) => rename(r, e.target.value)} style={{ minHeight: 38, padding: "6px 10px", border: "1px solid var(--line)", borderRadius: 4, fontSize: 15 }} />
              <span>{formatSize(r.size)} · <a href={r.file} target="_blank" rel="noreferrer">apri</a></span>
            </div>
            <div className="item__actions">
              <MoveButtons index={i} total={rows.length} onMove={move} />
              <button type="button" className="b b--danger b--sm" onClick={() => del(r)}><FontAwesomeIcon icon={faTrash} /> Elimina</button>
            </div>
          </div>
        ))}
      </div>
      <div className="row">
        <label className="b b--ghost b--sm file">
          {busy ? <span className="spin" aria-hidden="true" /> : <FontAwesomeIcon icon={faUpload} />}
          {busy ? `Caricamento (${busy})` : "Carica PDF"}
          <input type="file" accept="application/pdf,.pdf" multiple onChange={add} disabled={busy > 0} />
        </label>
      </div>
    </div>
  );
}

// Il link da dare ai rivenditori, con copia e rinnovo.
export function CatalogsLink() {
  const { notify } = useAdmin();
  const [confirm, confirmUI] = useConfirm();
  const [key, setKey] = useState("");
  useEffect(() => { getCatalogsKey().then(setKey).catch((e) => notify(e.message, "err")); }, [notify]);
  const url = key ? `${window.location.origin}/cataloghi/${key}` : "";

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); notify("Link copiato"); } catch { notify("Copia non riuscita: seleziona il link e copialo a mano.", "err"); }
  };
  const renew = async () => {
    if (!(await confirm({ title: "Creare un link nuovo?", message: "Il link attuale smette subito di funzionare: dovrai mandare quello nuovo a tutti i rivenditori.", confirmLabel: "Crea link nuovo", danger: true }))) return;
    try { setKey(await renewCatalogsKey()); notify("Link nuovo creato"); } catch (err) { notify(err.message, "err"); }
  };

  return (
    <div className="card">
      {confirmUI}
      <h3>Pagina cataloghi per i rivenditori</h3>
      <p className="sub">Pagina nascosta: non è nel menu né su Google. Ci arriva solo chi ha questo link. I PDF si caricano dentro ogni marchio, con Modifica.</p>
      <input readOnly value={url || "Caricamento"} onFocus={(e) => e.target.select()} aria-label="Link della pagina cataloghi" style={{ minHeight: 42, padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 4, fontSize: 14, width: "100%" }} />
      <div className="row">
        <button type="button" className="b b--sm" onClick={copy} disabled={!url}><FontAwesomeIcon icon={faCopy} /> Copia link</button>
        <a className="b b--ghost b--sm" href={url || undefined} target="_blank" rel="noreferrer">Apri la pagina</a>
        <button type="button" className="b b--ghost b--sm" onClick={renew} disabled={!url}><FontAwesomeIcon icon={faArrowsRotate} /> Crea un link nuovo</button>
      </div>
    </div>
  );
}
