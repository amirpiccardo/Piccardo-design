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
import { faTags, faUsers, faBoxOpen, faFileContract, faAddressBook, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  fetchBrands, fetchTeamMembers, fetchMaterialBrands,
  fetchContractBrands, fetchContacts, fetchSubscribers,
} from "../services/apiServices";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const cards = [
  { key: "brands", label: "Brands", icon: faTags, color: "#c8a96e" },
  { key: "team", label: "Team", icon: faUsers, color: "#1a1a1a" },
  { key: "materials", label: "Materiali", icon: faBoxOpen, color: "#7a8b99" },
  { key: "contracts", label: "Contract", icon: faFileContract, color: "#9c7b54" },
  { key: "contacts", label: "Messaggi", icon: faAddressBook, color: "#2e7d32" },
  { key: "subscribers", label: "Iscritti", icon: faEnvelope, color: "#5b6abf" },
];

const DashboardOverview = () => {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    Promise.allSettled([
      fetchBrands(), fetchTeamMembers(), fetchMaterialBrands(),
      fetchContractBrands(), fetchContacts(), fetchSubscribers(),
    ]).then((res) => {
      const len = (r) => (r.status === "fulfilled" && Array.isArray(r.value) ? r.value.length : 0);
      setCounts({
        brands: len(res[0]), team: len(res[1]), materials: len(res[2]),
        contracts: len(res[3]), contacts: len(res[4]), subscribers: len(res[5]),
      });
    });
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

  return (
    <div>
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
