import { describe, expect, it } from 'vitest'
// @ts-expect-error - the worker is plain ESM run by Actions, not part of the bundle
import { isWithinWindow, expectedStream, offlineStatus } from '../scripts/presence.mjs'
import schedule from '../content/schedule.json'

const at = (iso: string) => new Date(iso)

describe('presence monitoring window', () => {
  it('stays closed well before the session', () => {
    expect(isWithinWindow(schedule, at('2026-09-21T12:00:00-03:00'))).toBe(false)
  })

  it('stays closed 25 minutes out, then opens 20 minutes before the start', () => {
    expect(isWithinWindow(schedule, at('2026-09-21T18:35:00-03:00'))).toBe(false)
    expect(isWithinWindow(schedule, at('2026-09-21T18:45:00-03:00'))).toBe(true)
  })

  it('is open while the session should be running', () => {
    expect(isWithinWindow(schedule, at('2026-09-21T20:30:00-03:00'))).toBe(true)
  })

  it('keeps looking after the planned end rather than assuming it ended', () => {
    expect(isWithinWindow(schedule, at('2026-09-21T23:00:00-03:00'))).toBe(true)
  })

  it('closes once the whole window has passed', () => {
    expect(isWithinWindow(schedule, at('2026-09-21T23:31:00-03:00'))).toBe(false)
  })

  it('names the session it is watching for', () => {
    expect(expectedStream(schedule, at('2026-09-21T19:30:00-03:00'))?.id).toBe('build-001')
    expect(expectedStream(schedule, at('2026-09-21T12:00:00-03:00'))).toBeNull()
  })
})

describe('offline document', () => {
  it('reports not-live rather than unknown, and claims no platform', () => {
    const status = offlineStatus(at('2026-09-18T12:00:00Z'))
    expect(status.live).toBe(false)
    expect(status.primary).toBeNull()
    expect(status.platforms).toEqual({})
    expect(status.checkedAt).toBe('2026-09-18T12:00:00.000Z')
  })
})
