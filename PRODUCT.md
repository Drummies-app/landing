# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + TypeScript + Vite, static build, no application server. Deployed to GitHub Pages
from a public repository (deploy workflow itself is out of scope for this build — the
user wires CI/CD separately). Mandated by Drummies Landing Page Technical Spec v0.4 §0/§12.

## Users

Primary: complete beginners who own or want a drum kit and cannot play it. The landing
page meets them before the product exists, so their job is deciding whether this project
is worth following and joining the waitlist for.

Secondary: people who follow build-in-public development — they come for the livestream
and the Build Log rather than the eventual product.

Both audiences arrive from a stream platform, social post, or word of mouth. Neither is
an enterprise buyer; there is no sales motion.

## Product Purpose

Drummies is a new way to learn instruments by actually playing them, starting with drums.
The public site exists to introduce the project without exposing the product blueprint,
tell the authentic origin story (the creator bought a drum kit and cannot play it), make
the build-in-public process watchable, collect early-access interest, and keep a public
historical record of the build.

Success for the site: a visitor understands the premise in one screen, can tell whether a
stream is on now or when the next one is, and either joins the waitlist or follows a
stream platform.

## Positioning

The creator is building a drum-learning product while learning drums, in public, live.
The beginner-first stance is literal rather than marketing: "We don't know how to play
drums either." No competitor can truthfully copy the origin story or the live build.

## Operating Context

- Public content is version-controlled files in Git, published through Pull Requests.
  `content/schedule.json`, `content/roadmap.json`, and `content/build-log/*.md`.
- Streams run on Twitch and YouTube. The schedule file is the source of truth for the
  next stream; at this stage it states intent and does not prove the creator is live.
- Visitors arrive in many timezones; scheduled times must be converted to the visitor's
  local timezone and never hard-coded.
- Confirmed external presences:
  - Twitch: https://www.twitch.tv/saadeguilherme
  - YouTube: https://www.youtube.com/@saadeguilherme
  - X: https://x.com/saadeguilherme
  - GitHub: https://github.com/Drummies-app

## Capabilities and Constraints

- No backend, database, CMS, authentication, SSR, or runtime GitHub API dependency.
- English and pt-BR from release one. Browser language is a first-visit hint, English is
  the fallback, a manual switcher is always available and the choice persists locally.
- Live/offline stream state is computed client-side from static schedule data. Real
  Twitch/YouTube live-status verification is explicitly out of scope for this version.
- Waitlist submissions go to an external provider through one configurable endpoint
  (`VITE_WAITLIST_ENDPOINT`). Subscriber emails must never be stored in the repository,
  Issues, or Actions artifacts. No private API key may enter the browser bundle.
- Embedded Twitch/YouTube players create third-party requests; embeds load on interaction
  rather than on page load.
- Out of scope for this build: GitHub Actions workflows, the scheduled stream-presence
  worker and its `live.json` contract, and the AI editorial automation.

## Brand Commitments

Name: Drummies. Voice: curious, personal, slightly irreverent, technical without generic
startup marketing. Self-deprecating but not insecure. Beginner-friendly — jokes must land
for non-programmers.

Banned: vague claims such as "AI-powered revolutionary music education platform".

Voice is first person singular. The hero headline is "Normal people take drum
lessons. / I started a software project." — a deliberate, user-approved departure
from the spec §4.1 hero copy, kept because the setup-and-punchline lands harder
and commits to one person rather than a "we". The rest of §4's origin story is
preserved in substance.

The public/private boundary is a brand commitment, not just a policy: scoring, the session
analyzer, adaptive difficulty, MIDI architecture, skill models and AI coaching are never
described publicly. "What is Drummies?" stays one short sentence. The roadmap is
deliberately secretive and answers "How?" with "Nice try. 👀".

Editorial pattern to preserve: a scheduled stream title is a question/hypothesis; the
Build Log title that follows is the answer/punchline.

## Evidence on Hand

Spec-authored copy for hero, live hub, roadmap, waitlist, easter egg and footer in both
languages (`docs/Drummies_Landing_Page_Technical_Spec_v0.4.docx` §4, §6, §13, §14, §16, §17).

Absent — must not be fabricated: real stream recordings, subscriber or follower counts,
testimonials, press, launch dates, product screenshots, and any claim that a playable
alpha exists. No custom domain has been decided, so canonical and social-share URLs stay
a single marked TODO.

## Product Principles

1. Complex product, simple public infrastructure — files, Git and a static build stay
   sufficient until a concrete requirement proves otherwise.
2. Show the process, withhold the blueprint. Ambition is public; mechanics are not.
3. Beginner-first and honest. The creator's incompetence is the story, not a disclaimer.
4. The schedule states intent, never proof. Never claim live status the data cannot support.
5. Visitor data leaves through a provider, never into the repository.

## Accessibility & Inclusion

Semantic headings, keyboard navigation, visible focus states, an accessible language
switcher and labelled waitlist form. Stream status must have a textual fallback rather
than relying on color or an embed. `prefers-reduced-motion` is respected — and because
the visual direction is rhythm-driven, motion must be genuinely optional, not merely
shortened. Bilingual EN/pt-BR is an inclusion requirement, not a feature.
