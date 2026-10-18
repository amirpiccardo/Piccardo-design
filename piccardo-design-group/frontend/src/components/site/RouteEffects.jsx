import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db as supabase } from "../../lib/supabase";
import { hasStatsConsent } from "./CookieBanner";

function track(pathname) {
  if (!supabase || !hasStatsConsent()) return;
  if (pathname.startsWith("/admin") || pathname.startsWith("/login") || pathname.startsWith("/cataloghi")) return;
  const referrer = document.referrer && !document.referrer.startsWith(location.origin) ? document.referrer.slice(0, 300) : "";
  supabase.from("page_views").insert({ path: pathname.slice(0, 200), referrer }).then(() => {}, () => {});
}

// Cambio pagina: torna in cima (salvo ancore) e registra la visita, solo con consenso.
export default function RouteEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
    track(pathname);
  }, [pathname, hash]);

  useEffect(() => {
    const onConsent = () => track(window.location.pathname);
    window.addEventListener("cookie-consent-changed", onConsent);
    return () => window.removeEventListener("cookie-consent-changed", onConsent);
  }, []);

  return null;
}
