import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie, faFileLines, faTags, faUsers, faFileContract, faHandshake, faInbox, faEnvelope, faKey,
} from "@fortawesome/free-solid-svg-icons";
import "./admin.css";
import { AdminProvider, PublishBadge, Loading, useConfirm } from "./ui";
import { getSession, onAuthChange, myRole, signOut, listContacts } from "./api";
import { isSupabaseConfigured } from "../lib/supabase";
import Login from "./Login";
import Overview from "./Overview";
import PagesEditor from "./PagesEditor";
import CollectionEditor from "./CollectionEditor";
import { Contacts, Newsletter } from "./Inbox";
import Account, { ROLES } from "./Account";

const SECTIONS = [
  { key: "overview", label: "Panoramica", icon: faChartPie, intro: "Visite, messaggi e contenuti a colpo d'occhio.", roles: ["admin", "editor", "messages"] },
  { key: "pages", label: "Pagine e testi", icon: faFileLines, intro: "Testi, foto e descrizioni per Google di ogni pagina.", roles: ["admin", "editor"] },
  { key: "brands", label: "Marchi", icon: faTags, intro: "Ogni marchio ha la sua pagina sul sito. L'ordine qui è l'ordine sul sito.", roles: ["admin", "editor"] },
  { key: "team", label: "Persone", icon: faUsers, intro: "Le persone mostrate nella pagina Chi siamo.", roles: ["admin", "editor"] },
  { key: "contract", label: "Contract", icon: faFileContract, intro: "I tipi di progetto con le loro foto.", roles: ["admin", "editor"] },
  { key: "contractBrands", label: "Marchi contract", icon: faHandshake, intro: "Loghi mostrati nella pagina Contract (facoltativi).", roles: ["admin", "editor"] },
  { key: "contacts", label: "Messaggi", icon: faInbox, intro: "Le richieste arrivate dal modulo. Arrivano anche via email a info@liguriadesigngroup.it.", roles: ["admin", "editor", "messages"] },
  { key: "newsletter", label: "Newsletter", icon: faEnvelope, intro: "Chi si è iscritto dal footer del sito.", roles: ["admin", "editor", "messages"] },
  { key: "account", label: "Account", icon: faKey, intro: "Esci, cambia la password e gestisci chi ha accesso.", roles: ["admin", "editor", "messages"] },
];

function Dashboard({ session, role, section }) {
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [confirm, confirmUI] = useConfirm();
  const allowed = SECTIONS.filter((s) => s.roles.includes(role));
  const current = allowed.find((s) => s.key === section) || allowed[0];
  const go = (key) => navigate(key === "overview" ? "/admin/" : `/admin/${key}`);

  useEffect(() => {
    listContacts().then((r) => setUnread(r.filter((c) => !c.read).length)).catch(() => {});
  }, [section]);

  const logout = async () => {
    if (!(await confirm({ title: "Uscire dall'area riservata?", confirmLabel: "Esci" }))) return;
    await signOut();
    navigate("/login", { replace: true });
  };

  let body;
  switch (current.key) {
    case "pages": body = <PagesEditor />; break;
    case "brands": body = <CollectionEditor key="brands" kind="brands" />; break;
    case "team": body = <CollectionEditor key="team" kind="team" />; break;
    case "contract": body = <CollectionEditor key="ct" kind="contractTypes" />; break;
    case "contractBrands": body = <CollectionEditor key="cb" kind="contractBrands" />; break;
    case "contacts": body = <Contacts onUnread={setUnread} />; break;
    case "newsletter": body = <Newsletter />; break;
    case "account": body = <Account session={session} role={role} onLogout={logout} />; break;
    default: body = <Overview go={go} />;
  }

  return (
    <div className="adm adm-shell">
      {confirmUI}
      <aside className="adm-side">
        <div className="adm-brand">
          <a href="/" target="_blank" rel="noopener" title="Apri il sito in una nuova scheda">
            <img src="/img/logo-white.webp" alt="Liguria Design Group" width="640" height="270" />
          </a>
          <span>{session.user.email} · {ROLES[role]?.label}</span>
          <button type="button" className="adm-logout" onClick={logout}>Esci</button>
        </div>
        <nav className="adm-nav" aria-label="Sezioni">
          {allowed.map((s) => (
            <button key={s.key} type="button" aria-current={s.key === current.key ? "page" : undefined} onClick={() => go(s.key)}>
              <FontAwesomeIcon icon={s.icon} /> {s.label}
              {s.key === "contacts" && unread > 0 && <span className="count">{unread}</span>}
            </button>
          ))}
        </nav>
        <div className="adm-side__foot">
          <a href="/" target="_blank" rel="noopener">Apri il sito</a>
          <button type="button" className="adm-logout" onClick={logout}>Esci</button>
        </div>
      </aside>
      <main className="adm-main">
        <div className="adm-head">
          <div><h1>{current.label}</h1><p>{current.intro}</p></div>
          <PublishBadge />
        </div>
        {body}
      </main>
    </div>
  );
}

export default function AdminApp({ path }) {
  const [state, setState] = useState({ ready: false, session: null, role: null });

  useEffect(() => {
    if (!isSupabaseConfigured) { setState({ ready: true, session: null, role: null }); return; }
    let alive = true;
    const check = async (session) => {
      const role = session ? await myRole().catch(() => null) : null;
      if (alive) setState({ ready: true, session, role });
    };
    getSession().then(check);
    const sub = onAuthChange((s) => check(s));
    return () => { alive = false; sub.unsubscribe(); };
  }, []);

  useEffect(() => {
    let robots = document.head.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement("meta"); robots.name = "robots"; document.head.appendChild(robots); }
    robots.content = "noindex, nofollow";
    document.title = "Area riservata | Liguria Design Group";
  }, [path]);

  if (!state.ready) return <div className="adm" style={{ display: "grid", placeItems: "center" }}><Loading text="Verifica dell'accesso" /></div>;

  if (path.startsWith("/login")) {
    return <AdminProvider><Login session={state.role ? state.session : null} /></AdminProvider>;
  }
  if (!state.session || !state.role) return <Navigate to="/login" replace />;
  const section = path.replace(/^\/admin\/?/, "").split("/")[0] || "overview";
  return <AdminProvider><Dashboard session={state.session} role={state.role} section={section} /></AdminProvider>;
}
