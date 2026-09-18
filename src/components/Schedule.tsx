import { useLang } from "../i18n/lang";
import { copy } from "../i18n/copy";
import { Icon } from "./Icon";
import { formatDay, formatTime, localTimeZone } from "../lib/time";
import type { StreamState } from "../types";

function StatusTag({ state }: { state: StreamState }) {
  const { t } = useLang();
  return (
    <span className={`tag tag--${state.status}`}>
      {t(copy.schedule.status[state.status])}
    </span>
  );
}

function Row({ state, isNext }: { state: StreamState; isNext: boolean }) {
  const { t, tl, lang } = useLang();
  const isPast = state.status === "departed";

  return (
    <li
      className={`sched__row${isNext ? " sched__row--next" : ""}${isPast ? " sched__row--past" : ""}`}
    >
      <div className="sched__when">
        <span className="sched__day">{formatDay(state.startsAt, lang)}</span>
        <span className="sched__time">{formatTime(state.startsAt, lang)}</span>
      </div>
      <p className="sched__title">{tl(state.stream.title)}</p>
      <div className="sched__side">
        {isPast &&
          (state.stream.recordingUrl ? (
            <a
              className="link"
              href={state.stream.recordingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(copy.schedule.recording)}
              <Icon name="arrow" size={14} />
            </a>
          ) : (
            <span className="sched__note">{t(copy.schedule.noRecording)}</span>
          ))}
        <StatusTag state={state} />
      </div>
    </li>
  );
}

export function Schedule({
  states,
  next,
}: {
  states: StreamState[];
  next: StreamState | null;
}) {
  const { t } = useLang();
  const upcoming = states.filter((s) => s.status !== "departed");
  const past = states.filter((s) => s.status === "departed").reverse();

  return (
    <section className="section" id="schedule">
      <div className="shell">
        <div className="section__head">
          <h2>{t(copy.schedule.title)}</h2>
          <p>{t(copy.schedule.intro)}</p>
        </div>

        {upcoming.length + past.length === 0 ? (
          <div className="empty">
            <Icon name="calendar" size={22} />
            <h3>{t(copy.schedule.empty)}</h3>
            <p>{t(copy.schedule.emptyBody)}</p>
          </div>
        ) : (
          <>
            <ol className="sched__list">
              {upcoming.map((state) => (
                <Row
                  key={state.stream.id}
                  state={state}
                  isNext={next?.stream.id === state.stream.id}
                />
              ))}
            </ol>

            {past.length > 0 && (
              <>
                <h3 className="sched__past">{t(copy.schedule.past)}</h3>
                <ol className="sched__list">
                  {past.map((state) => (
                    <Row key={state.stream.id} state={state} isNext={false} />
                  ))}
                </ol>
              </>
            )}

            <p className="sched__tz">
              <Icon name="globe" size={15} />
              {t(copy.studio.scheduleNote)}{" "}
              <b>{localTimeZone().replace("_", " ")}</b>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
