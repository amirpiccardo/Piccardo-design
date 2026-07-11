import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faUsers, faFileContract, faAddressBook, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  fetchBrands, fetchTeamMembers,
  fetchContractBrands, fetchContacts, fetchSubscribers, fetchAnalyticsStats,
} from "../services/apiServices";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const cards = [
  { key: "brands", label: "Brand", icon: faTags, color: "#c8a96e" },
  { key: "team", label: "Team", icon: faUsers, color: "#1a1a1a" },
  { key: "contracts", label: "Contract", icon: faFileContract, color: "#9c7b54" },
  { key: "contacts", label: "Messaggi", icon: faAddressBook, color: "#2e7d32" },
  { key: "subscribers", label: "Iscritti", icon: faEnvelope, color: "#5b6abf" },
];

const DashboardOverview = () => {
  const [counts, setCounts] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.allSettled([
      fetchBrands(), fetchTeamMembers(),
      fetchContractBrands(), fetchContacts(), fetchSubscribers(),
    ]).then((res) => {
      const len = (r) => (r.status === "fulfilled" && Array.isArray(r.value) ? r.value.length : 0);
      setCounts({
        brands: len(res[0]), team: len(res[1]),
        contracts: len(res[2]), contacts: len(res[3]), subscribers: len(res[4]),
      });
    });
    fetchAnalyticsStats().then(setStats).catch(() => setStats(null));
  }, []);

  if (!counts) return <div className="text-center py-5"><div className="spinner-border" /></div>;

  const chartData = {
    labels: cards.map((c) => c.label),
    datasets: [{
      label: "Quantità",
      data: cards.map((c) => counts[c.key]),
      backgroundColor: cards.map((c) => c.color),
      borderRadius: 6,
    }],
  };

  const pageLabel = (p) => ({ "/": "Home", "/about": "Chi Siamo", "/materials": "Brand", "/contracts": "Contract", "/contact": "Contatti", "/faq": "FAQ" }[p] || p);

  return (
    <div>
      {/* Analytics interne */}
      {stats && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card text-center h-100" style={{ background: "linear-gradient(135deg,#1b2a4a,#24375f)", color: "#fff" }}>
              <div className="card-body">
                <div style={{ fontSize: "2.2rem", fontWeight: 700, color: "#c8a96e" }}>{stats.last30 ?? 0}</div>
                <div className="small" style={{ opacity: 0.85 }}>Visite (30 giorni)</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center h-100">
              <div className="card-body">
                <div style={{ fontSize: "2.2rem", fontWeight: 700 }}>{stats.total ?? 0}</div>
                <div className="text-muted small">Visite totali</div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="card-title mb-2">Pagine più viste</h6>
                {(stats.topPages || []).length === 0 ? (
                  <p className="text-muted small mb-0">Ancora nessuna visita registrata.</p>
                ) : (
                  <ol className="mb-0 ps-3 small">
                    {stats.topPages.map((p) => (
                      <li key={p._id}>{pageLabel(p._id)} — <strong>{p.count}</strong></li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-3 mb-4">
        {cards.map((c) => (
          <div className="col-6 col-md-4 col-lg-2" key={c.key}>
            <div className="card text-center h-100">
              <div className="card-body">
                <FontAwesomeIcon icon={c.icon} style={{ color: c.color, fontSize: "1.6rem" }} />
                <div style={{ fontSize: "2rem", fontWeight: 700, marginTop: "6px" }}>{counts[c.key]}</div>
                <div className="text-muted small">{c.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          <h6 className="card-title mb-3">Contenuti del sito</h6>
          <div style={{ maxHeight: "320px" }}>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
              }}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
