import React, { createContext, useState, useContext, useEffect, useRef } from "react";

const AuthContext = createContext();

function getExpiryMs(jwt) {
  try {
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const logoutTimer = useRef(null);

  const clearLogoutTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
  };

  const logout = () => {
    clearLogoutTimer();
    localStorage.removeItem("authToken");
    setToken(null);
    setIsAuthenticated(false);
    setExpiresAt(null);
  };

  const scheduleAutoLogout = (jwt) => {
    clearLogoutTimer();
    const expiryMs = getExpiryMs(jwt);
    setExpiresAt(expiryMs);
    if (expiryMs === null) return;
    const msLeft = expiryMs - Date.now();
    if (msLeft <= 0) {
      logout();
      return;
    }
    logoutTimer.current = setTimeout(logout, msLeft);
  };

  useEffect(() => {
    const stored = localStorage.getItem("authToken");
    if (!stored) return;

    const expiryMs = getExpiryMs(stored);
    if (expiryMs !== null && expiryMs <= Date.now()) {
      localStorage.removeItem("authToken");
      return;
    }

    setToken(stored);
    setIsAuthenticated(true);
    scheduleAutoLogout(stored);

    return clearLogoutTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (newToken) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    scheduleAutoLogout(newToken);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, expiresAt, login, logout, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
