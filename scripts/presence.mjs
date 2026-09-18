#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SCHEDULE = join(ROOT, 'content/schedule.json')
const PLATFORMS = join(ROOT, 'content/platforms.json')
const OUTPUT = join(ROOT, 'public/live.json')

const MINUTE = 60_000

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))

export function isWithinWindow(schedule, now = new Date()) {
  const { opensMinutesBefore = 20, staysOpenMinutesAfter = 90 } = schedule.monitorWindow ?? {}
  const t = now.getTime()
  return schedule.streams.some((stream) => {
    const opens = new Date(stream.startsAt).getTime() - opensMinutesBefore * MINUTE
    const closes = new Date(stream.endsAt).getTime() + staysOpenMinutesAfter * MINUTE
    return t >= opens && t <= closes
  })
}

export function expectedStream(schedule, now = new Date()) {
  const { opensMinutesBefore = 20, staysOpenMinutesAfter = 90 } = schedule.monitorWindow ?? {}
  const t = now.getTime()
  return (
    schedule.streams.find((stream) => {
      const opens = new Date(stream.startsAt).getTime() - opensMinutesBefore * MINUTE
      const closes = new Date(stream.endsAt).getTime() + staysOpenMinutesAfter * MINUTE
      return t >= opens && t <= closes
    }) ?? null
  )
}

export function offlineStatus(now = new Date()) {
  return {
    checkedAt: now.toISOString(),
    live: false,
    primary: null,
    title: null,
    platforms: {},
  }
}

async function twitchStatus({ clientId, clientSecret, login }) {
  const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  })
  if (!tokenResponse.ok) throw new Error(`Twitch token ${tokenResponse.status}`)
  const { access_token: token } = await tokenResponse.json()

  const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(login)}`, {
    headers: { 'Client-Id': clientId, Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error(`Twitch streams ${response.status}`)

  const stream = (await response.json()).data?.[0]
  return stream
    ? { live: true, startedAt: stream.started_at ?? null, title: stream.title ?? null, url: `https://www.twitch.tv/${login}` }
    : { live: false, startedAt: null, title: null, url: `https://www.twitch.tv/${login}` }
}

async function youtubeStatus({ apiKey, channelId }) {
  const url = new URL('https://www.googleapis.com/youtube/v3/search')
  url.search = new URLSearchParams({
    part: 'snippet',
    channelId,
    eventType: 'live',
    type: 'video',
    key: apiKey,
  }).toString()

  const response = await fetch(url)
  if (!response.ok) throw new Error(`YouTube search ${response.status}`)

  const item = (await response.json()).items?.[0]
  return item
    ? {
        live: true,
        videoId: item.id?.videoId ?? null,
        startedAt: item.snippet?.publishedAt ?? null,
        title: item.snippet?.title ?? null,
        url: item.id?.videoId ? `https://www.youtube.com/watch?v=${item.id.videoId}` : null,
      }
    : { live: false, videoId: null, startedAt: null, title: null, url: null }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const now = new Date()
  const schedule = readJson(SCHEDULE)
  const platforms = readJson(PLATFORMS)
  const previous = (() => {
    try {
      return readJson(OUTPUT)
    } catch {
      return null
    }
  })()

  let next

  if (!isWithinWindow(schedule, now)) {
    next = offlineStatus(now)
  } else {
    const checks = {}
    let failed = false

    const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, YOUTUBE_API_KEY } = process.env

    if (TWITCH_CLIENT_ID && TWITCH_CLIENT_SECRET && platforms.twitchLogin) {
      try {
        checks.twitch = await twitchStatus({
          clientId: TWITCH_CLIENT_ID,
          clientSecret: TWITCH_CLIENT_SECRET,
          login: platforms.twitchLogin,
        })
      } catch (error) {
        failed = true
        console.error(`twitch check failed: ${error.message}`)
      }
    }

    if (YOUTUBE_API_KEY && platforms.youtubeChannelId) {
      try {
        checks.youtube = await youtubeStatus({
          apiKey: YOUTUBE_API_KEY,
          channelId: platforms.youtubeChannelId,
        })
      } catch (error) {
        failed = true
        console.error(`youtube check failed: ${error.message}`)
      }
    }

    if (failed && Object.keys(checks).length === 0) {
      console.log('all checks failed; leaving the published status untouched')
      process.exit(0)
    }

    const twitchLive = checks.twitch?.live === true
    const youtubeLive = checks.youtube?.live === true
    const primary = twitchLive ? 'twitch' : youtubeLive ? 'youtube' : null
    const expected = expectedStream(schedule, now)

    next = {
      checkedAt: now.toISOString(),
      live: twitchLive || youtubeLive,
      primary,
      title: checks[primary]?.title ?? expected?.title?.en ?? null,
      platforms: checks,
    }
  }

  const meaningful = ({ checkedAt, ...rest }) => JSON.stringify(rest)
  const changed = !previous || meaningful(previous) !== meaningful(next)

  console.log(`live=${next.live} primary=${next.primary ?? '-'} changed=${changed}`)

  if (dryRun) {
    console.log(JSON.stringify(next, null, 2))
    return
  }

  if (changed) writeFileSync(OUTPUT, `${JSON.stringify(next, null, 2)}\n`)

  if (process.env.GITHUB_OUTPUT) {
    writeFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`, { flag: 'a' })
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
