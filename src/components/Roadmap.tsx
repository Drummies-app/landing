import { useState } from "react";
import { useLang } from "../i18n/lang";
import { copy } from "../i18n/copy";
import { roadmap } from "../lib/content";
import { Icon } from "./Icon";

export function Roadmap() {
  const { t, tl, lang } = useLang();
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="section roadmap" id="roadmap">
      <div className="shell">
        <div className="roadmap__head">
          <h2>{t(copy.roadmap.title)}</h2>
          <div className="roadmap__qa">
            <p>{tl(roadmap.question.ask)}</p>
            <p className="roadmap__answer">{tl(roadmap.question.answer)}</p>
            <p>
              {tl(roadmap.question.how)}{" "}
              {revealed ? (
                <span className="roadmap__deflect">
                  {tl(roadmap.question.deflection)}
                </span>
              ) : (
                <button
                  type="button"
                  className="roadmap__reveal"
                  onClick={() => setRevealed(true)}
                >
                  {t(copy.roadmap.reveal)}
                </button>
              )}
            </p>
          </div>
        </div>

        <ol className="roadmap__phases">
          {roadmap.phases.map((phase, i) => (
            <li
              className={`phase${i === 0 ? " phase--current" : ""}`}
              key={phase.id}
            >
              <span className="phase__stage">
                <i className="phase__dot" aria-hidden="true" />
                {tl(phase.label)}
              </span>
              <span className="phase__art" aria-hidden="true">
                {phase.icons.map((icon) => (
                  <Icon
                    key={icon}
                    name={icon}
                    size={i === 0 ? 38 : 30}
                    strokeWidth={1.3}
                  />
                ))}
                {phase.glyph && (
                  <span className="phase__glyph">{phase.glyph}</span>
                )}
              </span>
              {phase.items.map((item) => (
                <h3 className="phase__item" key={item.en}>
                  {item[lang] || item.en}
                </h3>
              ))}
              <p className="phase__note">{tl(phase.note)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
