import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { loadContent, SEED_CONTENT } from "../lib/content";
import { isSupabaseConfigured } from "../lib/supabase";

const ContentContext = createContext({ content: SEED_CONTENT, refresh: async () => {} });

// initial: i contenuti con cui la pagina è stata generata al build (o i default).
// Nel browser li aggiorniamo subito da Supabase, così le modifiche dell'admin
// si vedono anche prima che il sito venga rigenerato.
export function ContentProvider({ initial, children, live = true }) {
  const [content, setContent] = useState(initial || SEED_CONTENT);

  const refresh = useCallback(async () => {
    const fresh = await loadContent();
    if (fresh.source === "supabase") setContent(fresh);
    return fresh;
  }, []);

  useEffect(() => {
    if (live && isSupabaseConfigured) refresh();
  }, [live, refresh]);

  return <ContentContext.Provider value={{ content, refresh }}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext).content;
export const useRefreshContent = () => useContext(ContentContext).refresh;
export const usePage = (key) => useContent().pages[key] || { fields: {}, sections: [] };
export const useSite = () => usePage("site").fields;
