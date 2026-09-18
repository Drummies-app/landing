import { useLang } from "../i18n/lang";
import { copy } from "../i18n/copy";
import { Icon } from "./Icon";
import { site } from "../site";
import type { ReactNode } from "react";

function Line({
  children,
  delay,
  accent,
}: {
  children: ReactNode;
  delay: number;
  accent?: boolean;
}) {
  return (
    <span className="hero__line reveal">
      <span
        className={accent ? "hero__accent" : undefined}
        style={{ "--d": `${delay}ms` } as React.CSSProperties}
      >
        {children}
      </span>
    </span>
  );
}

export function Hero({ studio }: { studio: ReactNode }) {
  const { t } = useLang();

  return (
    <section className="hero" id="story">
      <div className="shell hero__grid">
        <div>
          <h1>
            <Line delay={0}>{t(copy.hero.line1)}</Line>
            <Line delay={90} accent>
              {t(copy.hero.line2)}
            </Line>
          </h1>

          <div className="hero__body">
            <p>
              <strong>{t(copy.hero.intro)}</strong>
            </p>
            <p>{t(copy.hero.problem)}</p>
            <p className="hero__invite">{t(copy.hero.solution)}</p>
          </div>

          <div className="hero__actions">
            <a
              className="btn"
              href={site.twitch}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="play" size={16} />
              {t(copy.hero.cta)}
            </a>
            <a className="link" href="#live">
              {t(copy.nav.live)}
              <Icon name="arrow" size={15} />
            </a>
          </div>
        </div>

        {studio}
      </div>
    </section>
  );
}
