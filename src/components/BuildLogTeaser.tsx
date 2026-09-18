import { useLang } from "../i18n/lang";
import { copy } from "../i18n/copy";
import { Icon } from "./Icon";
import { buildLog } from "../lib/content";
import { formatLogDate, parseDay } from "../lib/time";

export function BuildLogTeaser({
  onOpen,
}: {
  onOpen: (event: React.MouseEvent, slug?: string) => void;
}) {
  const { t, tl, lang } = useLang();
  const entries = buildLog.slice(0, 3);

  return (
    <section className="section" id="log">
      <div className="shell">
        <div className="log__head">
          <div className="section__head">
            <h2>{t(copy.log.title)}</h2>
            <p>{t(copy.log.intro)}</p>
          </div>
          <a
            className="link"
            href="/build-log"
            onClick={(event) => onOpen(event)}
          >
            {t(copy.log.all)}
            <Icon name="arrow" size={15} />
          </a>
        </div>

        {entries.length === 0 ? (
          <div className="empty">
            <h3>{t(copy.log.empty)}</h3>
          </div>
        ) : (
          <div className="log__list">
            {entries.map((entry) => (
              <a
                className="entry"
                href={`/build-log#${entry.slug}`}
                onClick={(event) => onOpen(event, entry.slug)}
                key={entry.slug}
              >
                <span className="entry__no" aria-hidden="true">
                  #{String(entry.id).padStart(3, "0")}
                </span>
                <span className="entry__main">
                  <span className="entry__meta">
                    <span>{formatLogDate(parseDay(entry.date), lang)}</span>
                    {entry.tags[1] && <span>{entry.tags[1]}</span>}
                  </span>
                  <span className="entry__title">{tl(entry.title)}</span>
                  <span className="entry__sum">{tl(entry.summary)}</span>
                </span>
                <span className="entry__go">
                  <Icon name="arrow" size={18} />
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
