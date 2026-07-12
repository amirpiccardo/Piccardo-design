import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollTopButton from "./components/ScrollTopButton";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import CookieBanner from "./components/CookieBanner";

// Pagine secondarie caricate solo quando servono, per ridurre il bundle iniziale
const AboutPage = lazy(() => import("./pages/AboutPage"));
const MaterialsPage = lazy(() => import("./pages/MaterialsPage"));
const ContractsPage = lazy(() => import("./pages/ContractsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ContactForm = lazy(() => import("./pages/ContactForm"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const CookiePage = lazy(() => import("./pages/CookiePage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
// L'area admin (con chart.js) è caricata solo quando serve
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const PageFallback = () => (
  <div className="text-center py-5">
    <div className="spinner-border" />
  </div>
);

function PrivateRoute({ children }) {
  const { isAuthenticated, authChecked } = useAuth();
  const location = useLocation();
  if (!authChecked) return <PageFallback />;
  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="pdg-page" style={{ flex: "1" }}>
      <Suspense fallback={<PageFallback />}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<Navigate to="/about" replace />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/contracts" element={<ContractsPage />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cookie-policy" element={<CookiePage />} />
          <Route path="/termini" element={<TermsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />
          <AnimatedRoutes />
          <Footer />
          <ScrollTopButton />
          <CookieBanner />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
