export const COOKIE_CONSENT_KEY = "pdg_cookie_consent";

export function hasStatsConsent() {
  return localStorage.getItem(COOKIE_CONSENT_KEY) === "all";
}
