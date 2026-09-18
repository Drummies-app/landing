import { useLang } from "../i18n/lang";
import { copy } from "../i18n/copy";

export function About() {
  const { t } = useLang();
  return (
    <section className="section about" id="about">
      <div className="shell about__grid">
        <h2>
          {t(copy.about.kicker1)}
          <span>{t(copy.about.kicker2)}</span>
        </h2>
        <div className="about__body">
          <p>{t(copy.about.body)}</p>
          <p>{t(copy.about.body2)}</p>
          <p className="about__note">{t(copy.about.note)}</p>
        </div>
      </div>
    </section>
  );
}
