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

In CI the same value comes from the `WAITLIST_ENDPOINT` repository **variable**
(not a secret — it is compiled into the public bundle).

The endpoint must be a **public** form/subscribe URL that accepts a browser POST.
Never put a provider API key in this repo or in any `VITE_` variable — everything
prefixed `VITE_` is compiled into the browser bundle and is public. Subscriber
emails must never land in the repository, Issues, or Actions artifacts.

## Deployment

`main` deploys to GitHub Pages at **https://drummies.app** via
`.github/workflows/deploy.yml`. Pull requests run the same checks without
deploying (`.github/workflows/ci.yml`).

Both workflows derive the base path rather than hard-coding it: `public/CNAME`
means a custom domain and a `/` base; without it the build targets `/<repo>/` for
a project Pages site. Remove the CNAME and the build follows, with no workflow
edit.

`public/404.html` handles SPA deep links, so `/build-log` survives a cold load.

One-time setup on GitHub:

1. Make the repository public (spec §0, and Pages needs it on a free plan).
2. Settings → Pages → Source: **GitHub Actions**.
3. Settings → Pages → Custom domain: `drummies.app`, then enable **Enforce HTTPS**.
4. DNS: `A` records for `drummies.app` to GitHub's four Pages addresses
   (`185.199.108–111.153`), or `ALIAS`/`ANAME` to `drummies-app.github.io`.
5. Optional: Settings → Secrets and variables → Actions → Variables →
   `WAITLIST_ENDPOINT`, to connect the waitlist at build time.

## Deliberately not built yet

These are specified in v0.4 but out of scope here, and nothing fakes them:

- The scheduled GitHub Action that verifies real Twitch/YouTube live status and
  writes `live.json`. The site already consumes the normalized shape, so wiring
  the worker requires no UI change.
- The AI editorial workflows (§26) for title and Build Log draft generation.
- CI/CD and the Pages deploy workflow.

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
