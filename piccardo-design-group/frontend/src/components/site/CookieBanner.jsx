import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const COOKIE_CONSENT_KEY = "pdg_cookie_consent";
const OPEN_EVENT = "cookie-preferences-open";

const read = () => { try { return localStorage.getItem(COOKIE_CONSENT_KEY); } catch { return null; } };
export const hasStatsConsent = () => read() === "all";
export const openCookiePreferences = () => window.dispatchEvent(new Event(OPEN_EVENT));

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!read()) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const open = () => setVisible(true);
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const decide = (value) => {
    try { localStorage.setItem(COOKIE_CONSENT_KEY, value); } catch { /* memoria non disponibile */ }
    window.dispatchEvent(new Event("cookie-consent-changed"));
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <div className="cookie" role="dialog" aria-label="Preferenze cookie">
      <p>
        Usiamo solo strumenti tecnici necessari al sito. Se acconsenti, contiamo in forma anonima le pagine visitate per migliorare i contenuti.{" "}
        <Link to="/cookie-policy">Cookie policy</Link>
      </p>
      <div className="row-btns">
        <button type="button" className="btn btn--light" onClick={() => decide("necessary")}>Solo necessari</button>
        <button type="button" className="btn btn--gold" onClick={() => decide("all")}>Accetta statistiche</button>
      </div>
    </div>
  );
}
