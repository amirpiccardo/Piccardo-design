import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { ContentProvider } from "./context/ContentContext";
import { PUBLIC_ROUTES } from "./routes";
import Footer from "./components/site/Footer";
import CookieBanner from "./components/site/CookieBanner";
import RouteEffects from "./components/site/RouteEffects";

// Area riservata: caricata solo quando serve (con Bootstrap e grafici), mai nel sito pubblico.
const AdminApp = lazy(() => import("./admin/AdminApp"));

function SiteLayout() {
  return (
    <>
      <RouteEffects />
      <Outlet />
      <Footer />
      <CookieBanner />
    </>
  );
}

function AdminFallback() {
  return <div style={{ minHeight: "100svh", display: "grid", placeItems: "center", fontFamily: "system-ui", color: "#16213a" }}>Caricamento area riservata</div>;
}

class AdminErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("Errore area riservata:", error, info?.componentStack); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: 24, fontFamily: "system-ui", color: "#16213a" }}>
        <div style={{ maxWidth: 560, display: "grid", gap: 12 }}>
          <h1 style={{ fontSize: 24, margin: 0 }}>Qualcosa non ha funzionato nell'area riservata</h1>
          <pre id="admin-error" style={{ whiteSpace: "pre-wrap", background: "#f3f4f5", padding: 12, fontSize: 13 }}>{String(this.state.error?.stack || this.state.error)}</pre>
          <button type="button" onClick={() => location.reload()} style={{ justifySelf: "start", padding: "10px 16px" }}>Ricarica</button>
        </div>
      </div>
    );
  }
}

function AdminRoute() {
  const location = useLocation();
  return (
    <AdminErrorBoundary>
      <Suspense fallback={<AdminFallback />}>
        <AdminApp path={location.pathname} />
      </Suspense>
    </AdminErrorBoundary>
  );
}

export default function App({ initialContent, live = true }) {
  return (
    <ContentProvider initial={initialContent} live={live}>
      <Routes>
        <Route path="/login" element={<AdminRoute />} />
        <Route path="/admin/*" element={<AdminRoute />} />
        <Route element={<SiteLayout />}>
          {PUBLIC_ROUTES.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>
      </Routes>
    </ContentProvider>
  );
}
