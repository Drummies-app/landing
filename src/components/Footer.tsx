import { useLang } from "../i18n/lang";
import { copy } from "../i18n/copy";
import { BrandIcon, Logo } from "./Icon";
import { site } from "../site";

const links = [
  { name: "twitch", label: "Twitch", href: site.twitch },
  { name: "youtube", label: "YouTube", href: site.youtube },
  { name: "github", label: "GitHub", href: site.github },
  { name: "x", label: "X", href: site.x },
] as const;

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__top">
          <div>
            <span className="brand">
              <Logo />
              drummies<em>.</em>
            </span>
            <p className="footer__tag">{t(copy.footer.built)}</p>
          </div>
          <nav className="footer__links" aria-label={t(copy.footer.follow)}>
            {links.map((link) => (
              <a
                className="social"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                key={link.name}
              >
                <BrandIcon name={link.name} size={16} />
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="footer__base">
          <span>{t(copy.footer.rights)}</span>
          <span>{t(copy.studio.wip)}</span>
        </div>
      </div>
    </footer>
  );
}
