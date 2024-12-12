import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import TeamPage from "./pages/TeamPage";
import FairsPage from "./pages/FairsPage";
import MaterialsPage from "./pages/MaterialsPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ContactForm from "./pages/ContactForm";
import Footer from "./components/Footer";
import ContractsPage from "./pages/ContractsPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verifyToken`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.auth) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("authToken");
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error verifying token:", error);
          localStorage.removeItem("authToken");
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const appStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  };

  const contentStyle = {
    flex: "1",
  };

  return (
    <BrowserRouter>
      <div style={appStyle}>
        <Navbar />
        <div style={contentStyle}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/fairs" element={<FairsPage />} />
            <Route path="/materials" element={<MaterialsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contracts" element={<ContractsPage />} />
            <Route
              path="/admin"
              element={
                isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />
              }
            />
            <Route path="/contact" element={<ContactForm />} />
            <Route
              path="/private"
              element={
                isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
