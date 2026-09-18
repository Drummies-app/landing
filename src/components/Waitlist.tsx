import { useId, useState } from "react";
import { useLang } from "../i18n/lang";
import { copy } from "../i18n/copy";
import { Icon } from "./Icon";
import { joinWaitlist } from "../lib/waitlist";
import type { WaitlistResult } from "../lib/waitlist";

export function Waitlist() {
  const { t } = useLang();
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<WaitlistResult | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setResult(null);
    const outcome = await joinWaitlist(email);
    setResult(outcome);
    setPending(false);
    if (outcome.kind === "ok") setEmail("");
  };

  const message =
    result &&
    {
      ok: t(copy.waitlist.ok),
      invalid: t(copy.waitlist.invalid),
      failed: t(copy.waitlist.failed),
      unconfigured: t(copy.waitlist.unconfigured),
    }[result.kind];

  const isError = result !== null && result.kind !== "ok";

  return (
    <section className="waitlist" id="waitlist">
      <div className="shell">
        <div className="waitlist__block">
          <div>
            <h2>
              {t(copy.waitlist.title1)}
              <span>{t(copy.waitlist.title2)}</span>
            </h2>
            <p className="waitlist__lead">{t(copy.waitlist.body)}</p>

            {result?.kind === "ok" ? (
              <p className="waitlist__msg" role="status">
                <Icon name="check" size={18} strokeWidth={2.2} />
                {message}
              </p>
            ) : (
              <form className="waitlist__form" onSubmit={submit} noValidate>
                <span className="waitlist__field">
                  <label className="visually-hidden" htmlFor={inputId}>
                    {t(copy.waitlist.label)}
                  </label>
                  <input
                    id={inputId}
                    className="waitlist__input"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder={t(copy.waitlist.placeholder)}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-invalid={isError}
                    aria-describedby={message ? `${inputId}-msg` : undefined}
                    required
                  />
                </span>
                <button
                  className="btn btn--onCoral"
                  type="submit"
                  disabled={pending}
                >
                  {pending ? t(copy.waitlist.sending) : t(copy.waitlist.submit)}
                  {!pending && <Icon name="arrow" size={15} />}
                </button>
              </form>
            )}

            {message && result?.kind !== "ok" && (
              <p className="waitlist__msg" id={`${inputId}-msg`} role="alert">
                <Icon name="alert" size={17} strokeWidth={2} />
                {message}
              </p>
            )}

            {result?.kind !== "ok" && (
              <p className="waitlist__note">{t(copy.waitlist.note)}</p>
            )}
          </div>

          <div className="waitlist__side">
            <h3>{t(copy.waitlist.side)}</h3>
            <p>{t(copy.waitlist.sideBody)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
