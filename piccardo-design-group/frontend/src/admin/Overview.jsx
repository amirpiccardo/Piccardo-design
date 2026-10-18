import React, { useEffect, useState } from "react";
import { pageStats, list, listContacts, listSubscribers } from "./api";
import { Loading } from "./ui";

const PAGE_NAMES = { "/": "Home", "/marchi": "Marchi", "/contract": "Contract", "/chi-siamo": "Chi siamo", "/rivenditori": "Per rivenditori", "/contatti": "Contatti", "/faq": "FAQ" };
const name = (p) => PAGE_NAMES[p] || (p.startsWith("/marchi/") ? `Marchio: ${p.slice(8)}` : p);

function last30(byDay) {
  const map = Object.fromEntries((byDay || []).map((d) => [d.day, d.count]));
  const out = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    out.push({ key, label: d.toLocaleDateString("it-IT", { day: "numeric", month: "short" }), count: map[key] || 0 });
  }
  return out;
}

export default function Overview({ go }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const len = (r) => (r.status === "fulfilled" ? r.value.length : 0);
    Promise.allSettled([pageStats(), list("brands"), list("team_members"), list("contract_types"), listContacts(), listSubscribers()]).then((r) => {
      setData({
        stats: r[0].status === "fulfilled" ? r[0].value : null,
        brands: len(r[1]), team: len(r[2]), types: len(r[3]),
        unread: r[4].status === "fulfilled" ? r[4].value.filter((c) => !c.read).length : 0,
        contacts: len(r[4]), subs: len(r[5]),
      });
    });
  }, []);

  if (!data) return <Loading />;
  const days = last30(data.stats?.byDay);
  const max = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="stack">
      <div className="kpis">
        <div className="kpi kpi--navy"><b>{data.stats?.last30 ?? 0}</b><span>Visite negli ultimi 30 giorni</span></div>
        <button type="button" className="kpi" onClick={() => go("contacts")}><b>{data.unread}</b><span>Messaggi da leggere su {data.contacts}</span></button>
        <button type="button" className="kpi" onClick={() => go("brands")}><b>{data.brands}</b><span>Marchi</span></button>
        <button type="button" className="kpi" onClick={() => go("team")}><b>{data.team}</b><span>Persone</span></button>
        <button type="button" className="kpi" onClick={() => go("contract")}><b>{data.types}</b><span>Tipi di progetto contract</span></button>
        <button type="button" className="kpi" onClick={() => go("newsletter")}><b>{data.subs}</b><span>Iscritti newsletter</span></button>
      </div>

      <div className="card">
        <h2>Visite giorno per giorno</h2>
        <p className="sub">Contano solo i visitatori che hanno accettato le statistiche nel banner cookie. Totale da sempre: {data.stats?.total ?? 0}.</p>
        <div className="bars" role="img" aria-label="Visite negli ultimi 30 giorni">
          {days.map((d) => <div key={d.key} style={{ height: `${(d.count / max) * 100}%` }} title={`${d.label}: ${d.count}`} />)}
        </div>
        <div className="bars-axis"><span>{days[0].label}</span><span>max {max} al giorno</span><span>{days[29].label}</span></div>
      </div>

      <div className="card">
        <h2>Pagine più viste</h2>
        {!data.stats?.topPages?.length ? <p className="sub">Ancora nessuna visita registrata.</p> : (
          <div className="tbl-wrap">
            <table className="tbl" style={{ minWidth: 0 }}>
              <thead><tr><th>Pagina</th><th style={{ textAlign: "right" }}>Visite</th></tr></thead>
              <tbody>{data.stats.topPages.map((p) => <tr key={p.path}><td>{name(p.path)}</td><td className="num" style={{ textAlign: "right" }}>{p.count}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
