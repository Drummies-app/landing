---
name: Drummies
description: Warm-dark build-in-public studio page for a drum-learning product made by someone learning drums.
colors:
  ink: "#151312"
  ink-lift: "#1C1A18"
  ink-raise: "#242020"
  line: "#2E2A27"
  line-soft: "#221F1C"
  cream: "#F2EDE4"
  cream-dim: "#B3ABA0"
  cream-faint: "#948C83"
  coral: "#FF6A4D"
  coral-soft: "#FF8E77"
  coral-deep: "#D14A2E"
  on-coral: "#1F0B05"
  on-coral-dim: "#4A1A0C"
  amber: "#E8A33D"
  player-well: "#0C0B0A"
  field-tint: "#FFFFFF"
typography:
  display:
    fontFamily: "Anton, 'Archivo Variable', system-ui, sans-serif"
    fontSize: "clamp(3rem, 7.5vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.025em"
  hero:
    fontFamily: "Anton, 'Archivo Variable', system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.025em"
  brand:
    fontFamily: "Anton, 'Archivo Variable', system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.015em"
  entry-number:
    fontFamily: "Anton, 'Archivo Variable', system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.6vw, 2rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Anton, 'Archivo Variable', system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Archivo Variable', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  data:
    fontFamily: "'Martian Mono', ui-monospace, monospace"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  small:
    fontFamily: "'Archivo Variable', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  meta:
    fontFamily: "'Archivo Variable', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  micro:
    fontFamily: "'Archivo Variable', system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "'Archivo Variable', system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.16em"
  label-sm:
    fontFamily: "'Archivo Variable', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.1em"
  countdown:
    fontFamily: "'Martian Mono', ui-monospace, monospace"
    fontSize: "clamp(1.75rem, 4.4vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
rounded:
  hairline: "2px"
  code: "5px"
  sm: "8px"
  md: "14px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "22px"
  lg: "40px"
  section: "clamp(64px, 9vw, 128px)"
  gutter: "clamp(20px, 5vw, 64px)"
components:
  button-primary:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.on-coral}"
    rounded: "{rounded.pill}"
    padding: "14px 22px"
  button-primary-hover:
    backgroundColor: "{colors.coral-soft}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "14px 22px"
  button-on-coral:
    backgroundColor: "{colors.on-coral}"
    textColor: "{colors.coral}"
    rounded: "{rounded.pill}"
    padding: "14px 22px"
  panel:
    backgroundColor: "{colors.ink-lift}"
    textColor: "{colors.cream}"
    rounded: "{rounded.md}"
  status-tag:
    backgroundColor: "transparent"
    textColor: "{colors.cream-dim}"
    rounded: "{rounded.pill}"
    padding: "5px 11px"
    typography: "{typography.label}"
---

# Drummies Design System

## Overview

A warm-dark editorial studio page. The ground is a warm near-black, never neutral
grey and never pure black, because the single accent is coral and a cold ground
fights it. One coral carries every moment that matters — the punchline in the
headline, the live indicator, the one ask — and it means nothing else. Type is
the loudest element: a heavy condensed display face at poster scale over a plain
grotesque text face, with a mono reserved strictly for measurement.

The tone the visuals serve is honest, slightly self-deprecating, and unfinished
on purpose. The page must be able to say "this does not work yet" without looking
broken, so waiting and failure states get the same care as the success state.

## Colors

Strategy: **committed**. Neutrals carry the page; coral owns roughly a tenth of
it but takes a full-bleed field at the single conversion moment, so the accent
reads as a decision rather than a sprinkle.

| Token            | Value     | Role                                   |
| ---------------- | --------- | -------------------------------------- |
| `--ink`          | `#151312` | Page ground                            |
| `--ink-lift`     | `#1C1A18` | Panels, ticker, alternating bands      |
| `--ink-raise`    | `#242020` | Hover surface, inset blocks            |
| `--line`         | `#2E2A27` | Visible borders                        |
| `--line-soft`    | `#221F1C` | Section rules, resting card borders    |
| `--cream`        | `#F2EDE4` | Primary text                           |
| `--cream-dim`    | `#B3ABA0` | Secondary text — 7.6:1 on panels       |
| `--cream-faint`  | `#948C83` | Labels and meta — 5.2:1 on panels      |
| `--coral`        | `#FF6A4D` | Accent, live state, primary action     |
| `--on-coral`     | `#1F0B05` | Text on coral fields                   |
| `--on-coral-dim` | `#4A1A0C` | Secondary text on coral — 5.1:1        |
| `--amber`        | `#E8A33D` | Schedule states only, never decoration |

Rules:

- Every muted tone is measured against the **lightest** surface it appears on
  (`--ink-lift`), not the page ground. `--cream-faint` at `#7A736B` measured
  3.7:1 during the build and was lifted; do not darken it back.
- Secondary text on coral is tinted from coral's own hue. Never grey on colour.
- Amber is a state colour. It says "expected, unconfirmed" and nothing else.

## Typography

Three faces, each with one job:

- **Anton** — display and all headings. Poster-weight condensed grotesque, set
  tight (`-0.02em` to `-0.025em`, never past `-0.04em`). Caps at `6rem`.
- **Archivo Variable** — all body copy, controls, labels and navigation.
- **Martian Mono** — times, countdowns, dates and build numbers **only**, always
  with `font-variant-numeric: tabular-nums` so digits do not jitter as they tick.

Mono is for measurement, not for looking technical. A label is not data; set it
in Archivo with `0.16em` tracking and uppercase.

Ramp, editorial: `--step-0` `1rem` · `--step-1` `1.125rem` ·
`--step-2` `clamp(1.25rem,1.6vw,1.5rem)` · `--step-3` `clamp(1.75rem,2.6vw,2.5rem)`
· `--step-4` `clamp(2.5rem,5vw,4rem)` · `--step-5` `clamp(3rem,7.5vw,6rem)`.

Below `--step-0` sits a fixed UI scale that does not need to flex with the
viewport: `0.9375rem` (small), `0.875rem` (meta), `0.8125rem` (micro),
`0.75rem` (small label) and `0.6875rem` (label). Body measure stays at 44–68ch.

The hero headline is the one heading that does **not** take `--step-5`: it is two
full sentences, so it sizes from its own measure at `clamp(2.25rem, 4vw, 3.5rem)`.
Six lines of display type is not a hero, it is a wall.

`2px` (focus ring) and `5px` (inline code) are the two radii outside the main
scale; both are hairline details, not surfaces.

## Layout

A single `1280px` container (`.shell`) with a fluid gutter. Sections are
separated by `--line-soft` rules and `clamp(64px, 9vw, 128px)` of vertical space,
with more air above a heading than below it.

The page alternates ground and `--ink-lift` bands rather than boxing content in
cards; cards appear only where the content is genuinely a list of discrete items
(schedule rows, log entries).

Breakpoints, all content-driven: `980px` collapses the hero to one column,
`900px` drops the header nav, `880px` stacks the waitlist, `760px` stacks a
schedule row, `620px` shortens the header CTA, `520px` stacks the panel meta.
The header is the page's widest row — check it first when anything overflows.

## Elevation & Depth

Flat by commitment. Depth is a **1px border plus a surface shift**, never a
shadow: panels sit on `--ink-lift` inside `--line`, and hover moves the surface
to `--ink-raise` rather than lifting it. Declare elevation once — a border under
a shadow is the ghost card and does not belong here.

The only glow is the live indicator's expanding ring, which encodes state.

## Shapes

`14px` on panels, cards and blocks. `8px` on small inset surfaces. Pills are for
controls only — buttons, tags, the email field. No hard offset shadows, no glass.

Icons are drawn on a 24px grid at `1.6px` stroke, one weight throughout; brand
marks are filled paths. The roadmap's instruments (drum, guitar, piano, mic) are
drawn on that same grid at `1.3px` for their larger display size — no emoji
anywhere in the interface. Multi-stroke glyphs keep their subpaths separate so
caps and joins stay honest.

## Components

- **Button** — pill, three variants: primary (coral), quiet (bordered,
  transparent) and on-coral (inverted, for use inside the coral field). Disabled
  drops to `--ink-raise` with faint text and `not-allowed`.
- **Studio panel** — the live hub. Four states, all designed: `live` (embed
  facade, coral LIVE NOW with pulsing dot), `expected` (window open, unconfirmed),
  `scheduled` (title plus countdown), `quiet` (no session on the books). When
  live, the panel must not display scheduling caveats or a "next experiment" line.
  Off air, it also offers the last finished experiment and its recording. The
  embed facade states that loading the player contacts the platform, before it
  does.
- **Status tag** — pill carrying `scheduled`, `boarding`, `overdue`, `departed`
  or `live`. `overdue` means expected-but-unconfirmed and is amber, never coral.
- **Countdown** — mono, tabular, grouped by colons into a clock with one label
  row beneath the group, not per digit.
- **Ticker** — full-bleed marquee band on `--ink-lift`, duplicated track,
  `38s` linear, halted entirely under reduced motion with the text exposed to
  assistive tech once.
- **Header** — sticky, blurred. Below `900px` the section links collapse behind a
  bordered menu button that reports `aria-expanded`, closes on Escape, and closes
  when a link is chosen. The header is the widest row on the page; check it first
  when anything overflows.
- **Waitlist block** — the page's only full-bleed coral field. Carries idle,
  pending, success, invalid, failed and unconfigured states; errors use
  `role="alert"` and `aria-invalid`, success uses `role="status"`.

## Do's and Don'ts

**Do**

- Write in the first person singular. The page is one person's questionable
  decision, not a company's announcement; "I", never "we", outside the product
  sentence itself.
- Let the joke carry the irony rather than announcing it — "An extremely detailed
  roadmap" over a headline that calls itself mysterious.
- Design the waiting and failure states first; this product's honesty is the brand.
- Convert every time to the visitor's timezone and name that timezone on screen.
- Animate only the one authored moment (the headline rise) plus state indicators.
- Use exponential ease-out, `cubic-bezier(0.16, 1, 0.3, 1)`, for everything.
- Parse calendar dates in local time; `new Date('2026-09-19')` is UTC and renders
  as the previous day for every visitor west of Greenwich.

**Don't**

- Don't claim a stream is live from a clock. Live comes from a presence document
  or it does not appear.
- Don't put a kicker or eyebrow label above a heading. The heading carries itself.
- Don't add a second accent colour; amber is a state, not a brand colour.
- Don't set mono as a texture. Data only.
- Don't expose implementation state to visitors. A waitlist with no provider is
  "not open yet", never "not connected".
- Don't nest cards, or place a border under a shadow.
