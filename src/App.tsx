import { useEffect, useMemo } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { BuildLogPage } from "./pages/BuildLogPage";
import { useLang } from "./i18n/lang";
import { copy } from "./i18n/copy";
import { useNow, useRoute } from "./lib/hooks";
import { useLiveStatus } from "./lib/live";
import { schedule } from "./lib/content";
import { nextUp, pastSessions, resolveSchedule } from "./lib/time";

const BASE = import.meta.env.BASE_URL;

export function App() {
  const { t, lang } = useLang();
  const now = useNow();
  const { path, navigate } = useRoute();
  const status = useLiveStatus(BASE);

  const states = useMemo(() => resolveSchedule(schedule, now), [now]);
  const next = useMemo(() => nextUp(states), [states]);
  const latest = useMemo(() => pastSessions(states)[0] ?? null, [states]);

  const go = (to: string) => (event: React.MouseEvent, hash?: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
      return;
    event.preventDefault();
    navigate(hash ? `${to}#${hash}` : to);
  };

  const isLog = path.replace(/\/$/, "").endsWith("/build-log");

  // Title and share text follow the visitor's language and the current route,
  // so a link shared from the pt-BR site does not preview in English.
  useEffect(() => {
    document.title = isLog ? t(copy.meta.logTitle) : t(copy.meta.title);
    const description = isLog
      ? t(copy.meta.logDescription)
      : t(copy.meta.description);
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
  }, [isLog, lang, t]);

  return (
    <>
      <a className="skip-link" href="#main">
        {t(copy.nav.skip)}
      </a>
      <Header onHome={go(`${BASE}`)} />
      <main id="main">
        {isLog ? (
          <BuildLogPage onHome={go(`${BASE}`)} />
        ) : (
          <Home
            states={states}
            next={next}
            latest={latest}
            now={now}
            status={status}
            onOpenLog={go(`${BASE}build-log`)}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
