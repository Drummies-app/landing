import { useEffect } from "react";
import { useLang } from "../i18n/lang";
import { copy } from "../i18n/copy";
import { Icon } from "../components/Icon";
import { buildLog } from "../lib/content";
import { renderMarkdown } from "../lib/markdown";
import { formatLogDate, parseDay } from "../lib/time";

export function BuildLogPage({
  onHome,
}: {
  onHome: (event: React.MouseEvent) => void;
}) {
  const { t, tl, lang } = useLang();

  useEffect(() => {
    const slug = window.location.hash.slice(1);
    if (slug) document.getElementById(slug)?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <div className="shell page">
      <a className="link page__back" href="/" onClick={onHome}>
        <Icon name="arrowLeft" size={15} />
        {t(copy.log.back)}
      </a>

      <div className="page__head">
        <h1>{t(copy.log.pageTitle)}</h1>
        <p>{t(copy.log.pageIntro)}</p>
      </div>

      {buildLog.length === 0 ? (
        <div className="empty">
          <h3>{t(copy.log.empty)}</h3>
        </div>
      ) : (
        buildLog.map((entry) => (
          <article className="article" key={entry.slug} id={entry.slug}>
            <div className="article__meta">
              <span>#{String(entry.id).padStart(3, "0")}</span>
              <span>{formatLogDate(parseDay(entry.date), lang)}</span>
              {entry.stream && (
                <span>
                  {t(copy.log.session)} {entry.stream.replace(/^build-/, "#")}
                </span>
              )}
            </div>
            <h2>{tl(entry.title)}</h2>
            <div
              className="article__body"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(tl(entry.body)),
              }}
            />
          </article>
        ))
      )}
    </div>
  );
}
