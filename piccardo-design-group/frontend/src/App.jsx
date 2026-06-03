import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollTopButton from "./components/ScrollTopButton";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import TeamPage from "./pages/TeamPage";
import MaterialsPage from "./pages/MaterialsPage";
import ContractsPage from "./pages/ContractsPage";
import LoginPage from "./pages/LoginPage";
import ContactForm from "./pages/ContactForm";
import NotFoundPage from "./pages/NotFoundPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import FaqPage from "./pages/FaqPage";
import CookieBanner from "./components/CookieBanner";

// L'area admin (con chart.js) è caricata solo quando serve
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />
          <div style={{ flex: "1" }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/contracts" element={<ContractsPage />} />
              <Route path="/contact" element={<ContactForm />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/termini" element={<TermsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<div className="text-center py-5"><div className="spinner-border" /></div>}>
                      <AdminDashboard />
                    </Suspense>
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <Footer />
          <ScrollTopButton />
          <CookieBanner />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
