import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTags, faUsers, faFileContract, faAddressBook,
  faEnvelope, faSignOutAlt, faChartPie, faKey, faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import SessionExpiryBanner from "../components/SessionExpiryBanner";
import DashboardOverview from "../components/DashboardOverview";
import BrandManagement from "../components/BrandManagement";
import ContractBrandManagement from "../components/ContractBrandManagement";
import ContactManagement from "../components/ContactManagement";
import NewsletterManagement from "../components/NewsletterManagement";
import TeamManagement from "../components/TeamManagement";
import AccountSettings from "../components/AccountSettings";
import PageContentManagement from "../components/PageContentManagement";
import { fetchContacts } from "../services/apiServices";

const sections = [
  { key: "overview", label: "Panoramica", icon: faChartPie, comp: DashboardOverview },
  { key: "pages", label: "Pagine", icon: faFileLines, comp: PageContentManagement },
  { key: "brands", label: "Brand", icon: faTags, comp: BrandManagement },
  { key: "team", label: "Team", icon: faUsers, comp: TeamManagement },
  { key: "contracts", label: "Contract", icon: faFileContract, comp: ContractBrandManagement },
  { key: "contacts", label: "Contatti", icon: faAddressBook, comp: ContactManagement },
  { key: "newsletter", label: "Newsletter", icon: faEnvelope, comp: NewsletterManagement },
  { key: "account", label: "Account", icon: faKey, comp: AccountSettings },
];

function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [showLogout, setShowLogout] = useState(false);
  const [unreadContacts, setUnreadContacts] = useState(0);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchContacts()
      .then((data) => setUnreadContacts(Array.isArray(data) ? data.filter((c) => !c.read).length : 0))
      .catch(() => {});
  }, [active]);

  const Current = sections.find((s) => s.key === active)?.comp || DashboardOverview;
  const currentLabel = sections.find((s) => s.key === active)?.label || "";

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  const navItem = (s) => {
    const isActive = active === s.key;
    return (
      <button
        key={s.key}
        onClick={() => setActive(s.key)}
        style={{
          display: "flex", alignItems: "center", gap: "12px", width: "100%",
          padding: "12px 16px", border: "none", borderRadius: "10px", cursor: "pointer",
          background: isActive ? "rgba(200,169,110,0.18)" : "transparent",
          color: isActive ? "#c8a96e" : "rgba(255,255,255,0.78)",
          fontFamily: "Raleway, sans-serif", fontSize: "0.95rem", textAlign: "left",
          whiteSpace: "nowrap", transition: "background 0.2s, color 0.2s",
          borderLeft: isActive ? "3px solid #c8a96e" : "3px solid transparent",
        }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
      >
        <FontAwesomeIcon icon={s.icon} style={{ width: "18px" }} />
        {s.label}
        {s.key === "contacts" && unreadContacts > 0 && (
          <span className="badge bg-danger ms-auto">{unreadContacts}</span>
        )}
      </button>
    );
  };

  return (
    <div className="admin-shell" style={{ display: "flex", minHeight: "100vh", background: "#f4f5f7", fontFamily: "Raleway, sans-serif" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "240px", flexShrink: 0, background: "linear-gradient(180deg, #1b2a4a, #16233f)",
          padding: "24px 14px", display: "flex", flexDirection: "column",
          position: "sticky", top: 0, height: "100vh",
        }}
        className="admin-sidebar"
      >
        <div style={{ color: "#fff", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontWeight: 600, padding: "0 12px 18px", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "14px" }}>
Liguria<span style={{ color: "#c8a96e" }}>·</span>Admin
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, overflowY: "auto" }} className="admin-nav">
          {sections.map(navItem)}
        </nav>
        <button
          onClick={() => setShowLogout(true)}
          style={{
            display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "12px 16px",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", cursor: "pointer",
            background: "transparent", color: "rgba(255,255,255,0.85)", fontSize: "0.95rem", marginTop: "10px",
          }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} style={{ width: "18px" }} /> Esci
        </button>
      </aside>

      {/* Contenuto */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <SessionExpiryBanner />
        <div style={{ padding: "28px clamp(16px, 4vw, 40px)" }}>
          <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "1.8rem", marginBottom: "20px", color: "#1b2a4a" }}>
            {currentLabel}
          </h4>
          <Current />
        </div>
      </main>

      <ConfirmModal
        show={showLogout}
        title="Uscire dal pannello?"
        message="Verrai disconnesso dall'area amministrativa."
        confirmLabel="Esci"
        onConfirm={doLogout}
        onCancel={() => setShowLogout(false)}
      />

      <style>{`
        @media (max-width: 768px) {
          .admin-shell { flex-direction: column; }
          .admin-sidebar { position: static !important; width: 100% !important; height: auto !important; }
          .admin-nav { flex-direction: row !important; overflow-x: auto; padding-bottom: 6px; }
          .admin-nav button { width: auto !important; flex-shrink: 0; }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
