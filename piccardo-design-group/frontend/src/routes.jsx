import React from "react";
import { Navigate, useParams } from "react-router-dom";
import HomePage from "./pages/site/HomePage";
import BrandsPage from "./pages/site/BrandsPage";
import BrandPage from "./pages/site/BrandPage";
import NotFoundPage from "./pages/site/NotFoundPage";
import CatalogsPage from "./pages/site/CatalogsPage";
import { ContractPage, AboutPage, DealersPage, ContactPage, FaqPage, LegalPage } from "./pages/site/OtherPages";

function LegacyBrand() {
  const { slug } = useParams();
  return <Navigate to={`/marchi/${slug}`} replace />;
}

// Pagine pubbliche: generate già pronte al build (prerender) per velocità e SEO.
export const PUBLIC_ROUTES = [
  { path: "/", element: <HomePage /> },
  { path: "/marchi", element: <BrandsPage /> },
  { path: "/marchi/:slug", element: <BrandPage /> },
  { path: "/contract", element: <ContractPage /> },
  { path: "/chi-siamo", element: <AboutPage /> },
  { path: "/rivenditori", element: <DealersPage /> },
  { path: "/contatti", element: <ContactPage /> },
  { path: "/faq", element: <FaqPage /> },
  { path: "/privacy", element: <LegalPage pageKey="privacy" /> },
  { path: "/cookie-policy", element: <LegalPage pageKey="cookie" /> },
  { path: "/termini", element: <LegalPage pageKey="terms" /> },
  // Pagina nascosta per i rivenditori (non pre-generata, non in sitemap)
  { path: "/cataloghi/:key", element: <CatalogsPage /> },
  // Vecchi indirizzi (anche con redirect 301 in vercel.json)
  { path: "/about", element: <Navigate to="/chi-siamo" replace /> },
  { path: "/team", element: <Navigate to="/chi-siamo" replace /> },
  { path: "/materials", element: <Navigate to="/marchi" replace /> },
  { path: "/brand/:slug", element: <LegacyBrand /> },
  { path: "/contracts", element: <Navigate to="/contract" replace /> },
  { path: "/contact", element: <Navigate to="/contatti" replace /> },
  { path: "*", element: <NotFoundPage /> },
];

// Elenco degli URL da generare al build, a partire dai contenuti.
export function prerenderPaths(content) {
  return [
    "/", "/marchi", "/contract", "/chi-siamo", "/rivenditori", "/contatti", "/faq",
    "/privacy", "/cookie-policy", "/termini",
    ...content.brands.map((b) => `/marchi/${b.slug}`),
  ];
}
