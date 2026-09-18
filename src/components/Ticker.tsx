import { useLang } from "../i18n/lang";
import { copy } from "../i18n/copy";
import { Icon } from "./Icon";

export function Ticker() {
  const { t } = useLang();
  const words = copy.ticker.map((entry) => t(entry));
  const group = (
    <div className="ticker__group" aria-hidden="true">
      {[0, 1].map((round) =>
        words.map((word) => (
          <span className="ticker__item" key={`${round}-${word}`}>
            {word}
            <Icon name="spark" size={13} strokeWidth={2.4} />
          </span>
        )),
      )}
    </div>
  );

  return (
    <div className="ticker">
      <p className="visually-hidden">{words.join(". ")}.</p>
      <div className="ticker__track">
        {group}
        {group}
      </div>
    </div>
  );
}
