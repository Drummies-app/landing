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

## The waitlist

Submissions go to **Kit**, through its public form endpoint. Configured in CI by
three repository **variables** (Settings → Secrets and variables → Actions →
Variables) — none is a secret, and none may ever be one:

| Variable | Value |
| --- | --- |
| `WAITLIST_ENDPOINT` | `https://app.kit.com/forms/<form-id>/subscriptions` |
| `WAITLIST_FIELD` | `email_address` |
| `WAITLIST_FORMAT` | `json` |

**Kit answers 200 even when it rejects a signup**, reporting the real outcome in
the body as `{"status":"failed","errors":{…}}`. The adapter therefore reads the
body and does not trust the status code alone — otherwise a visitor whose signup
was rejected would be told they had joined. Any provider that behaves this way is
handled the same way.

Switching provider is a variable change, not a code change. Buttondown and
Formspree take JSON with the field `email`; a hosted form endpoint that wants
form-encoded data takes `WAITLIST_FORMAT=form`.

**Never use a provider's key-bearing REST API from this site.** Anything reaching
the browser is public, so only endpoints that need no credential are usable.

To run against the real provider locally:

```bash
cp .env.example .env
# fill in VITE_WAITLIST_ENDPOINT, VITE_WAITLIST_FIELD, VITE_WAITLIST_FORMAT
```

## Stream presence

`scripts/presence.mjs` decides whether the site may say you are live.
`.github/workflows/presence.yml` runs it every five minutes.

It reads `content/schedule.json` and does nothing unless a session is actually
expected — from 20 minutes before the planned start until 90 minutes after the
planned end. Inside that window it asks Twitch (and YouTube, if configured),
writes the normalized `public/live.json`, and publishes only when the answer
changed. A start time that has passed never means cancelled.

Required secrets (Settings → Secrets and variables → Actions):

| Secret | Needed for |
| --- | --- |
| `TWITCH_CLIENT_ID` | Twitch status. Create an app at dev.twitch.tv/console/apps |
| `TWITCH_CLIENT_SECRET` | Twitch status |
| `YOUTUBE_API_KEY` | Optional. The channel id is already set in `content/platforms.json` |

Without credentials the worker still runs and reports offline, so the site is
correct — just never live. Credentials stay in Actions and never reach the
browser.

Preview what it would write, without touching anything:

```bash
node scripts/presence.mjs --dry-run
```

Three things worth knowing:

- GitHub's cron is best-effort and can run several minutes late, so "live"
  appears within a few minutes rather than instantly.
- A failed API lookup leaves the last published status alone rather than
  flapping the site offline.
- YouTube's `search.list` costs 100 quota units per call against a 10,000/day
  default. One five-hour window is roughly 58 calls (~5,800 units), so a single
  session a day fits and two do not. Twitch has no comparable limit — if you
  only care about one platform, leave `YOUTUBE_API_KEY` unset and the worker
  skips YouTube entirely.

## Deliberately not built yet

- The AI editorial workflows (§26) for title and Build Log draft generation.

## Publishing a Build Log entry

Entries live in `content/build-log/` and ship with the site. Draft locally, then
commit the entry in the PR that publishes it.

A post written *before* its session has no `stream:` field — that key links an
entry to a session that already happened, and the page renders "From experiment"
from it. Add it only once the stream has actually run.

With no entries at all the Build Log renders its empty state and the build still
succeeds, which is what a fresh clone produces.

## Content to replace before launch

The four scheduled sessions in `content/schedule.json` are written in the
project's voice as working examples. They describe plausible sessions, not ones
that happened. Replace them with real dates before publishing, and set a real
domain in `index.html` (search for `TODO(domain)`).
