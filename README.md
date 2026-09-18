# drummies-web

The public Drummies landing page: build-in-public story, live-stream hub, static
schedule, secretive roadmap, Build Log and waitlist — with no application server.

Built from *Drummies Landing Page Technical Spec v0.4*.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # lint + typecheck + tests + production build
```

## What's here

| Path                     | What it is                                                      |
| ------------------------ | --------------------------------------------------------------- |
| `content/schedule.json`  | Stream schedule. The source of truth for when sessions happen.  |
| `content/roadmap.json`   | The secretive public roadmap.                                   |
| `content/build-log/*.md` | Bilingual Build Log entries, newest id wins.                    |
| `public/live.json`       | Normalized stream presence (spec §25.3). Reports `live: false`. |
| `src/lib/time.ts`        | Schedule state machine and timezone conversion.                 |
| `src/lib/waitlist.ts`    | Provider-agnostic waitlist submission.                          |
| `src/i18n/copy.ts`       | Every string on the site, EN and pt-BR.                         |
| `DESIGN.md`              | The visual system. Read before adding a surface.                |
| `PRODUCT.md`             | Durable product truth.                                          |

## Adding a stream

Edit `content/schedule.json` and open a PR. Times are ISO-8601 **with offset**;
the site converts them to each visitor's timezone. Leave `recordingUrl` as `null`
until a recording actually exists.

The site computes state from the clock: `scheduled` → `boarding` (20 min before)
→ `overdue` (window open, **not** confirmed live) → `departed` (90 min after the
planned end). It never reports "live" from the schedule alone, and it never marks
a session cancelled just because its start time passed — that rule is enforced by
tests in `tests/schedule.test.ts`.

## Adding a Build Log entry

Create `content/build-log/00N-slug.md`. Frontmatter carries `id`, `date`, `slug`,
`stream`, `tags` and localized `title`/`summary`; the body is split with
`<!--lang:en-->` and `<!--lang:pt-BR-->` markers. A missing translation falls back
to English.

Keep the editorial pattern: the stream title asks a question, the Build Log entry
that follows answers it.

## Connecting the waitlist

No provider is wired yet, so the form currently tells visitors it isn't connected.
To connect one:

```bash
cp .env.example .env
# VITE_WAITLIST_ENDPOINT=https://buttondown.com/api/emails/embed-subscribe/<user>
```

The endpoint must be a **public** form/subscribe URL that accepts a browser POST.
Never put a provider API key in this repo or in any `VITE_` variable — everything
prefixed `VITE_` is compiled into the browser bundle and is public. Subscriber
emails must never land in the repository, Issues, or Actions artifacts.

## Going live (not yet configured)

Deployment is deliberately not wired up in this build. When you add it:

- Set `VITE_BASE=/` for a custom domain or user/org Pages site, or `/<repo>/` for
  a project Pages site.
- `public/404.html` already handles SPA deep links on GitHub Pages.
- PR checks should run `npm run check`.

## Deliberately not built yet

These are specified in v0.4 but out of scope here, and nothing fakes them:

- The scheduled GitHub Action that verifies real Twitch/YouTube live status and
  writes `live.json`. The site already consumes the normalized shape, so wiring
  the worker requires no UI change.
- The AI editorial workflows (§26) for title and Build Log draft generation.
- CI/CD and the Pages deploy workflow.

## Build Log content is intentionally untracked

`content/build-log/` is listed in `.gitignore`: the entries are drafted locally
and published later, so nothing half-written ends up in public history. The site
handles this — with no entries the Build Log renders its empty state and the
build succeeds, which is what a fresh clone and CI will produce.

When you're ready to publish, drop `content/build-log` from `.gitignore` and
commit the entries in the same PR.

## Content to replace before launch

The four scheduled sessions in `content/schedule.json` are written in the
project's voice as working examples. They describe plausible sessions, not ones
that happened. Replace them with real dates before publishing, and set a real
domain in `index.html` (search for `TODO(domain)`).
