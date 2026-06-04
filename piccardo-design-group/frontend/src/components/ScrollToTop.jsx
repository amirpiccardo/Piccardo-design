import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Riporta in cima ad ogni cambio rotta + registra la visita (analytics interne)
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

    // tracking visita (fire-and-forget, non blocca nulla)
    if (!pathname.startsWith("/admin") && !pathname.startsWith("/login")) {
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
  }, [pathname]);

  return null;
}

export default ScrollToTop;
