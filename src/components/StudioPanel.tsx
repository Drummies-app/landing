import { useState } from "react";
import { useLang } from "../i18n/lang";
import { copy } from "../i18n/copy";
import { Icon, BrandIcon } from "./Icon";
import { site } from "../site";
import {
  remainingUntil,
  formatDay,
  formatTime,
  localTimeZone,
} from "../lib/time";
import type { StreamState } from "../types";
import type { LiveStatus } from "../lib/live";

const BARS = [
  34, 62, 45, 88, 52, 70, 40, 95, 58, 36, 74, 48, 82, 44, 66, 38, 90, 50, 60,
  42, 78, 46, 86, 54,
];

function Wave({ live }: { live: boolean }) {
  return (
    <div className={`wave${live ? " wave--live" : ""}`} aria-hidden="true">
      {BARS.map((h, i) => (
        <i
          key={i}
          style={
            {
              "--h": `${h}%`,
              animationDelay: `${i * 55}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function Countdown({ target, now }: { target: Date; now: Date }) {
  const { t } = useLang();
  const left = remainingUntil(target, now);
  const cells = [
    ...(left.days > 0 ? [[left.days, t(copy.studio.days)] as const] : []),
    [left.hours, t(copy.studio.hours)] as const,
    [left.minutes, t(copy.studio.minutes)] as const,
    [left.seconds, t(copy.studio.seconds)] as const,
  ];

  return (
    <div className="countdown" role="timer" aria-live="off">
      {cells.map(([value, label], i) => (
        <div style={{ display: "contents" }} key={label}>
          {i > 0 && (
            <span className="countdown__sep" aria-hidden="true">
              :
            </span>
          )}
          <div className="countdown__cell">
            <span className="countdown__num">
              {String(value).padStart(2, "0")}
            </span>
            <span className="countdown__lbl">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Embed({ status }: { status: LiveStatus }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const youtubeId = status.platforms.youtube?.videoId ?? null;
  const src =
    status.primary === "youtube" && youtubeId
      ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`
      : `https://player.twitch.tv/?channel=${site.twitchChannel}&parent=${window.location.hostname}&autoplay=true`;

  return (
    <div className="embed">
      {open ? (
        <iframe
          src={src}
          title={status.title ?? "Drummies live stream"}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="embed__cover"
          onClick={() => setOpen(true)}
        >
          <span>
            <Icon name="play" size={24} />
          </span>
          <small>{status.title ?? t(copy.studio.building)}</small>
          <em className="embed__privacy">{t(copy.studio.embedPrivacy)}</em>
        </button>
      )}
    </div>
  );
}

interface Props {
  next: StreamState | null;
  latest: StreamState | null;
  now: Date;
  status: LiveStatus | null;
}

export function StudioPanel({ next, latest, now, status }: Props) {
  const { t, tl, lang } = useLang();
  const isLive = status?.live === true;
  // The window is open but nothing has confirmed the stream. The panel says so
  // rather than promoting a clock into a fact (spec §6, §25.2).
  const expected =
    !isLive && (next?.status === "overdue" || next?.status === "boarding");

  return (
    <div className="studio" id="live">
      <div className="studio__top">
        <span className="studio__id">
          <Icon name="radio" size={16} />
          {t(copy.studio.label)}
        </span>
        <span
          className={`studio__state${isLive ? " studio__state--live" : ""}`}
        >
          <i className="studio__dot" />
          {isLive ? t(copy.studio.live) : t(copy.studio.offAir)}
        </span>
      </div>

      {isLive && status ? (
        <Embed status={status} />
      ) : (
        <div className="studio__body">
          <span
            className={`studio__ring${expected ? " studio__ring--live" : ""}`}
          >
            <Icon name="radio" size={30} strokeWidth={1.4} />
          </span>

          {expected ? (
            <>
              <h2>{t(copy.studio.expected)}</h2>
              <p>{t(copy.studio.expectedBody)}</p>
            </>
          ) : next ? (
            <>
              <h2>{tl(next.stream.title)}</h2>
              <Countdown target={next.startsAt} now={now} />
            </>
          ) : (
            <>
              <h2>
                {t(copy.studio.noneTitle)}
                <span>{t(copy.studio.noneTitle2)}</span>
              </h2>
              <p>{t(copy.studio.noneBody)}</p>
            </>
          )}

          <Wave live={expected} />
        </div>
      )}

      {!isLive && latest && (
        <div className="studio__last">
          <span>{t(copy.studio.missed)}</span>
          {latest.stream.recordingUrl ? (
            <a
              className="link"
              href={latest.stream.recordingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(copy.schedule.recording)}
              <Icon name="arrow" size={14} />
            </a>
          ) : (
            <span className="studio__lastTitle">
              {tl(latest.stream.title)} · <i>{t(copy.schedule.noRecording)}</i>
            </span>
          )}
        </div>
      )}

      <div className="studio__foot">
        <span className="studio__next">
          <Icon name={isLive ? "radio" : "calendar"} size={15} />
          {isLive ? (
            <>
              {t(copy.studio.onAir)} ·{" "}
              <b>{status?.title ?? t(copy.studio.building)}</b>
            </>
          ) : next ? (
            <>
              {t(copy.studio.nextBuild)} ·{" "}
              <b>{formatDay(next.startsAt, lang)}</b>
              {`, ${formatTime(next.startsAt, lang)}`}
            </>
          ) : (
            t(copy.schedule.empty)
          )}
        </span>
        <span className="studio__links">
          <a
            className="btn btn--quiet btn--sm"
            href={site.twitch}
            target="_blank"
            rel="noopener noreferrer"
          >
            <BrandIcon name="twitch" size={15} />
            Twitch
          </a>
          <a
            className="btn btn--quiet btn--sm"
            href={site.youtube}
            target="_blank"
            rel="noopener noreferrer"
          >
            <BrandIcon name="youtube" size={15} />
            YouTube
          </a>
        </span>
      </div>

      <div className="studio__meta">
        <span>{t(copy.studio.volume)}</span>
        <span>
          {isLive ? t(copy.studio.timesIn) : t(copy.studio.scheduleNote)}{" "}
          {localTimeZone().replace("_", " ")}
        </span>
      </div>
    </div>
  );
}
