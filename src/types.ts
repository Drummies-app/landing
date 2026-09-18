export type Lang = "en" | "pt-BR";

export type Localized = Record<Lang, string>;

export interface Stream {
  id: string;
  startsAt: string;
  endsAt: string;
  title: Localized;
  twitchUrl: string | null;
  youtubeUrl: string | null;
  recordingUrl: string | null;
}

export interface Schedule {
  monitorWindow: { opensMinutesBefore: number; staysOpenMinutesAfter: number };
  streams: Stream[];
}

export type StreamStatus = "scheduled" | "boarding" | "overdue" | "departed";

export interface StreamState {
  stream: Stream;
  status: StreamStatus;
  startsAt: Date;
  endsAt: Date;
}

export type InstrumentIcon = "drum" | "guitar" | "piano" | "mic";

export interface RoadmapPhase {
  id: string;
  label: Localized;
  icons: InstrumentIcon[];
  glyph?: string;
  items: { en: string; "pt-BR": string }[];
  note: Localized;
}

export interface Roadmap {
  question: {
    ask: Localized;
    answer: Localized;
    how: Localized;
    deflection: Localized;
  };
  phases: RoadmapPhase[];
}

export interface BuildLogEntry {
  id: number;
  date: string;
  slug: string;
  stream: string | null;
  tags: string[];
  title: Localized;
  summary: Localized;
  body: Localized;
}
