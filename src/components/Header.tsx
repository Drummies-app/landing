import { useEffect, useState } from "react";
import { useLang } from "../i18n/lang";
import { copy, LANGS } from "../i18n/copy";
import { Icon, Logo } from "./Icon";

export function Header({
  onHome,
}: {
  onHome: (event: React.MouseEvent) => void;
}) {
  const { lang, setLang, t } = useLang();
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menu]);

  const sections = [
    ["#story", t(copy.nav.story)],
    ["#live", t(copy.nav.live)],
    ["#roadmap", t(copy.nav.roadmap)],
    ["#log", t(copy.nav.log)],
  ] as const;

  return (
    <header className={`header${menu ? " header--open" : ""}`}>
      <div className="shell header__bar">
        <a className="brand" href="/" onClick={onHome} aria-label="Drummies">
          <Logo />
          drummies<em>.</em>
        </a>

        <nav
          className="header__nav"
          id="navigation"
          aria-label={t(copy.nav.main)}
        >
          {sections.map(([href, label]) => (
            <a href={href} key={href} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>

        <div className="header__right">
          <div
            className="langswitch"
            role="group"
            aria-label={t(copy.nav.language)}
          >
            {LANGS.map((code, i) => (
              <span key={code} style={{ display: "contents" }}>
                {i > 0 && <span aria-hidden="true">/</span>}
                <button
                  type="button"
                  lang={code}
                  aria-pressed={lang === code}
                  onClick={() => setLang(code)}
                >
                  {code === "en" ? "EN" : "PT"}
                </button>
              </span>
            ))}
          </div>

          <a
            className="btn btn--sm header__cta"
            href="#waitlist"
            onClick={() => setMenu(false)}
          >
            <span className="header__ctaLong">{t(copy.nav.join)}</span>
            <span className="header__ctaShort">{t(copy.nav.joinShort)}</span>
            <Icon name="arrow" size={15} />
          </a>

          <button
            type="button"
            className="header__menu"
            aria-controls="navigation"
            aria-expanded={menu}
            aria-label={menu ? t(copy.nav.close) : t(copy.nav.menu)}
            onClick={() => setMenu(!menu)}
          >
            <Icon name={menu ? "close" : "menu"} size={22} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
}
