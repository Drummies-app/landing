import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/anton/400.css";
import "@fontsource-variable/archivo";
import "@fontsource/martian-mono/400.css";
import "@fontsource/martian-mono/700.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/app.css";
import { App } from "./App";
import { LangProvider } from "./i18n/lang";

// A GitHub Pages 404 bounce parks the original path here; put it back before
// the router reads location, so a deep link survives the round trip.
try {
  const redirect = sessionStorage.getItem("drummies.redirect");
  if (redirect) {
    sessionStorage.removeItem("drummies.redirect");
    window.history.replaceState({}, "", redirect);
  }
} catch {
  // Storage unavailable: the visitor simply stays on the front page.
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>,
);
