import type {
  Schedule,
  Stream,
  StreamState,
  StreamStatus,
  Lang,
} from "../types";

const MINUTE = 60_000;

export function statusOf(
  stream: Stream,
  schedule: Schedule,
  now: Date,
): StreamStatus {
  const starts = new Date(stream.startsAt).getTime();
  const ends = new Date(stream.endsAt).getTime();
  const t = now.getTime();
  const opens = starts - schedule.monitorWindow.opensMinutesBefore * MINUTE;
  const closes = ends + schedule.monitorWindow.staysOpenMinutesAfter * MINUTE;

  if (t < opens) return "scheduled";
  if (t < starts) return "boarding";
  if (t <= closes) return "overdue";
  return "departed";
}

export function resolveSchedule(schedule: Schedule, now: Date): StreamState[] {
  return schedule.streams
    .map((stream) => ({
      stream,
      status: statusOf(stream, schedule, now),
      startsAt: new Date(stream.startsAt),
      endsAt: new Date(stream.endsAt),
    }))
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}

export function nextUp(states: StreamState[]): StreamState | null {
  return states.find((s) => s.status !== "departed") ?? null;
}

export function pastSessions(states: StreamState[]): StreamState[] {
  return states.filter((s) => s.status === "departed").reverse();
}

export interface Remaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function remainingUntil(target: Date, now: Date): Remaining {
  const total = Math.max(0, target.getTime() - now.getTime());
  const s = Math.floor(total / 1000);
  return {
    total,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function parseDay(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function localTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

export function formatDateTime(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang, {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatTime(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDay(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang, {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function formatLogDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
