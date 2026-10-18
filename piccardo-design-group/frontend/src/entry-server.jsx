import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { HeadProvider, headToHtml, SITE_URL } from "./lib/seo";

export { loadContent } from "./lib/content";
export { prerenderPaths } from "./routes";
export { headToHtml, SITE_URL };

export function render(url, content) {
  const collector = {};
  const html = renderToString(
    <HeadProvider collector={collector}>
      <StaticRouter location={url}>
        <App initialContent={content} live={false} />
      </StaticRouter>
    </HeadProvider>
  );
  return { html, head: collector.head };
}
