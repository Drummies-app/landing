import type {
  BuildLogEntry,
  Lang,
  Localized,
  Roadmap,
  Schedule,
} from "../types";
import scheduleJson from "../../content/schedule.json";
import roadmapJson from "../../content/roadmap.json";

export const schedule = scheduleJson as unknown as Schedule;
export const roadmap = roadmapJson as unknown as Roadmap;

const LANG_MARKER = /<!--lang:(en|pt-BR)-->/g;

function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  body: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { data: {}, body: raw };

  const data: Record<string, unknown> = {};
  let parent: Record<string, string> | null = null;

  for (const line of match[1]!.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const indented = /^\s+/.test(line);
    const [rawKey, ...rest] = line.trim().split(":");
    const key = rawKey!.trim();
    const value = rest.join(":").trim();

    if (indented && parent) {
      parent[key] = stripQuotes(value);
      continue;
    }
    if (!value) {
      parent = {};
      data[key] = parent;
      continue;
    }
    parent = null;
    data[key] = value.startsWith("[")
      ? value
          .slice(1, -1)
          .split(",")
          .map((v) => stripQuotes(v.trim()))
          .filter(Boolean)
      : stripQuotes(value);
  }
  return { data, body: raw.slice(match[0].length) };
}

function stripQuotes(value: string): string {
  return value.replace(/^["'](.*)["']$/, "$1");
}

function splitByLanguage(body: string): Localized {
  const out: Localized = { en: "", "pt-BR": "" };
  const markers = [...body.matchAll(LANG_MARKER)];
  if (markers.length === 0) {
    out.en = body.trim();
    out["pt-BR"] = body.trim();
    return out;
  }
  markers.forEach((marker, i) => {
    const lang = marker[1] as Lang;
    const from = marker.index! + marker[0].length;
    const to = i + 1 < markers.length ? markers[i + 1]!.index! : body.length;
    out[lang] = body.slice(from, to).trim();
  });
  if (!out["pt-BR"]) out["pt-BR"] = out.en;
  if (!out.en) out.en = out["pt-BR"];
  return out;
}

function asLocalized(value: unknown): Localized {
  const record = (value ?? {}) as Record<string, string>;
  const en = record.en ?? "";
  return { en, "pt-BR": record["pt-BR"] || en };
}

export function parseEntry(raw: string): BuildLogEntry {
  const { data, body } = parseFrontmatter(raw);
  return {
    id: Number(data.id ?? 0),
    date: String(data.date ?? ""),
    slug: String(data.slug ?? ""),
    stream: data.stream ? String(data.stream) : null,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    title: asLocalized(data.title),
    summary: asLocalized(data.summary),
    body: splitByLanguage(body),
  };
}

const files = import.meta.glob("../../content/build-log/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export const buildLog: BuildLogEntry[] = Object.values(files)
  .map((raw) => parseEntry(raw as string))
  .sort((a, b) => b.id - a.id);

export function entryBySlug(slug: string): BuildLogEntry | undefined {
  return buildLog.find((entry) => entry.slug === slug);
}
