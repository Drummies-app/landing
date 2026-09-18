import { useState } from "react";
import { useLang } from "../i18n/lang";
import { copy } from "../i18n/copy";

export function EasterEgg() {
  const { t } = useLang();
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);

  return (
    <section className="shell egg">
      {answer === null ? (
        <>
          <p>{t(copy.egg.question)}</p>
          <div className="egg__actions">
            <button
              type="button"
              className="btn btn--quiet btn--sm"
              onClick={() => setAnswer("yes")}
            >
              {t(copy.egg.yes)}
            </button>
            <button
              type="button"
              className="btn btn--quiet btn--sm"
              onClick={() => setAnswer("no")}
            >
              {t(copy.egg.no)}
            </button>
          </div>
        </>
      ) : (
        <div className="egg__reply" role="status">
          <p>{answer === "yes" ? t(copy.egg.yesReply) : t(copy.egg.noReply)}</p>
          <button
            type="button"
            className="btn btn--quiet btn--sm"
            onClick={() => setAnswer(null)}
          >
            {t(copy.egg.again)}
          </button>
        </div>
      )}
    </section>
  );
}
