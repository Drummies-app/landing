import { describe, expect, it } from "vitest";
import {
  resolveSchedule,
  statusOf,
  nextUp,
  remainingUntil,
} from "../src/lib/time";
import { parseEntry } from "../src/lib/content";
import { isValidEmail } from "../src/lib/waitlist";
import type { Schedule, Stream } from "../src/types";

const stream: Stream = {
  id: "build-001",
  startsAt: "2026-09-19T20:00:00-03:00",
  endsAt: "2026-09-19T23:00:00-03:00",
  title: { en: "A question", "pt-BR": "Uma pergunta" },
  twitchUrl: null,
  youtubeUrl: null,
  recordingUrl: null,
};

const schedule: Schedule = {
  monitorWindow: { opensMinutesBefore: 20, staysOpenMinutesAfter: 90 },
  streams: [stream],
};

const at = (iso: string) => new Date(iso);

describe("stream status", () => {
  it("is scheduled well before the monitoring window opens", () => {
    expect(statusOf(stream, schedule, at("2026-09-19T18:00:00-03:00"))).toBe(
      "scheduled",
    );
  });

  it("moves to boarding once the window opens", () => {
    expect(statusOf(stream, schedule, at("2026-09-19T19:45:00-03:00"))).toBe(
      "boarding",
    );
  });

  it("is overdue — never live — while the window is open", () => {
    expect(statusOf(stream, schedule, at("2026-09-19T20:30:00-03:00"))).toBe(
      "overdue",
    );
  });

  it("stays overdue after the planned end, rather than declaring it cancelled", () => {
    expect(statusOf(stream, schedule, at("2026-09-19T23:45:00-03:00"))).toBe(
      "overdue",
    );
  });

  it("only departs once the whole window has closed", () => {
    expect(statusOf(stream, schedule, at("2026-09-20T00:31:00-03:00"))).toBe(
      "departed",
    );
  });

  it("never reports a status that claims the stream is confirmed live", () => {
    const statuses = ["06:00", "19:50", "21:00", "23:30"].map((time) =>
      statusOf(stream, schedule, at(`2026-09-19T${time}:00-03:00`)),
    );
    expect(statuses).not.toContain("live");
  });
});

describe("schedule resolution", () => {
  it("orders sessions chronologically and picks the soonest unfinished one", () => {
    const many: Schedule = {
      ...schedule,
      streams: [
        {
          ...stream,
          id: "c",
          startsAt: "2026-10-03T20:00:00-03:00",
          endsAt: "2026-10-03T23:00:00-03:00",
        },
        {
          ...stream,
          id: "a",
          startsAt: "2026-09-05T20:00:00-03:00",
          endsAt: "2026-09-05T23:00:00-03:00",
        },
        {
          ...stream,
          id: "b",
          startsAt: "2026-09-26T20:00:00-03:00",
          endsAt: "2026-09-26T23:00:00-03:00",
        },
      ],
    };
    const states = resolveSchedule(many, at("2026-09-19T12:00:00-03:00"));
    expect(states.map((s) => s.stream.id)).toEqual(["a", "b", "c"]);
    expect(nextUp(states)?.stream.id).toBe("b");
  });

  it("returns no next session once every stream has finished", () => {
    expect(
      nextUp(resolveSchedule(schedule, at("2027-01-01T00:00:00-03:00"))),
    ).toBeNull();
  });

  it("reads the offset in the data instead of the machine timezone", () => {
    // Same instant, written with a different offset.
    const utc: Stream = {
      ...stream,
      startsAt: "2026-09-19T23:00:00Z",
      endsAt: "2026-09-20T02:00:00Z",
    };
    expect(statusOf(utc, schedule, at("2026-09-19T20:30:00-03:00"))).toBe(
      "overdue",
    );
  });
});

describe("countdown", () => {
  it("breaks the remaining time down and never goes negative", () => {
    const left = remainingUntil(
      at("2026-09-19T20:00:00-03:00"),
      at("2026-09-18T17:22:46-03:00"),
    );
    expect([left.days, left.hours, left.minutes, left.seconds]).toEqual([
      1, 2, 37, 14,
    ]);
    expect(
      remainingUntil(at("2020-01-01T00:00:00Z"), at("2026-01-01T00:00:00Z"))
        .total,
    ).toBe(0);
  });
});

describe("build log parsing", () => {
  const raw = `---
id: 7
date: 2026-09-19
slug: turns-out
tags: [build-log, drums]
title:
  en: "Turns Out, It Can"
  pt-BR: "Aparentemente, consegue"
summary:
  en: "It heard me."
  pt-BR: "Ele me ouviu."
---
<!--lang:en-->
The browser heard the kit.
<!--lang:pt-BR-->
O navegador ouviu a bateria.
`;

  it("reads frontmatter, nested localized fields and both language bodies", () => {
    const entry = parseEntry(raw);
    expect(entry.id).toBe(7);
    expect(entry.slug).toBe("turns-out");
    expect(entry.tags).toEqual(["build-log", "drums"]);
    expect(entry.title["pt-BR"]).toBe("Aparentemente, consegue");
    expect(entry.body.en).toBe("The browser heard the kit.");
    expect(entry.body["pt-BR"]).toBe("O navegador ouviu a bateria.");
  });

  it("falls back to English when a translation is missing", () => {
    const entry = parseEntry(
      raw.replace("<!--lang:pt-BR-->\nO navegador ouviu a bateria.\n", ""),
    );
    expect(entry.body["pt-BR"]).toBe("The browser heard the kit.");
  });
});

describe("waitlist validation", () => {
  it("accepts real addresses and rejects malformed ones", () => {
    expect(isValidEmail("someone@example.com")).toBe(true);
    expect(isValidEmail("someone@example")).toBe(false);
    expect(isValidEmail("not an email")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});
