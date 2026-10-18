import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/site.css";
import App from "./App";

// I link di invito e di recupero password di Supabase possono atterrare su qualsiasi pagina:
// li porto alla pagina di accesso mantenendo i dati nel link.
if (/[#&](access_token|error_description)=/.test(location.hash) && location.pathname !== "/login") {
  location.replace(`/login${location.search}${location.hash}`);
}

const root = document.getElementById("root");
const data = window.__LDG_DATA__;
const app = (
  <BrowserRouter>
    <App initialContent={data} />
  </BrowserRouter>
);

// Le pagine pubbliche arrivano già scritte (prerender): React le "riattiva".
// L'area riservata parte invece da una pagina vuota.
const isPrivate = /^\/(admin|login|cataloghi)(\/|$)/.test(location.pathname);
if (data && root.firstElementChild && !isPrivate) hydrateRoot(root, app);
else {
  root.innerHTML = "";
  createRoot(root).render(app);
}
