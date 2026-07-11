import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { hasStatsConsent } from "../utils/cookieConsent";

function track(pathname) {
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return;
  if (!hasStatsConsent()) return;
  try {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer: document.referrer || "" }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignora */
  }
}

// Riporta in cima ad ogni cambio rotta + registra la visita (analytics interne, solo con consenso)
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    track(pathname);

    const onConsentChange = () => track(pathname);
    window.addEventListener("cookie-consent-changed", onConsentChange);
    return () => window.removeEventListener("cookie-consent-changed", onConsentChange);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
