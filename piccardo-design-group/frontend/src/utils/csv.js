// Esporta un array di oggetti in un file CSV scaricabile (lato client, zero dipendenze)
export function exportToCsv(filename, rows, columns) {
  if (!rows || rows.length === 0) return;
  const cols = columns || Object.keys(rows[0]);
  const escape = (val) => {
    const s = val == null ? "" : String(val);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = cols.map((c) => escape(c.label || c.key)).join(";");
  const body = rows
    .map((row) => cols.map((c) => escape(typeof c === "string" ? row[c] : c.value(row))).join(";"))
    .join("\n");
  const csv = "﻿" + header + "\n" + body; // BOM per Excel/UTF-8
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
