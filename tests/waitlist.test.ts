import { afterEach, describe, expect, it, vi } from 'vitest'
import { isValidEmail, joinWaitlist } from '../src/lib/waitlist'

const ENDPOINT = 'https://sibforms.com/serve/test-form'

function mockFetch(status = 200) {
  const spy = vi.fn().mockResolvedValue({ ok: status >= 200 && status < 300, status })
  vi.stubGlobal('fetch', spy)
  return spy
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('address validation', () => {
  it('accepts real addresses and rejects malformed ones', () => {
    expect(isValidEmail('someone@example.com')).toBe(true)
    expect(isValidEmail('someone@example')).toBe(false)
    expect(isValidEmail('not an email')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })
})

describe('joinWaitlist', () => {
  it('reports unconfigured rather than failing when no provider is set', async () => {
    vi.stubEnv('VITE_WAITLIST_ENDPOINT', '')
    expect(await joinWaitlist('someone@example.com')).toEqual({ kind: 'unconfigured' })
  })

  it('rejects a bad address before contacting the provider', async () => {
    const spy = mockFetch()
    vi.stubEnv('VITE_WAITLIST_ENDPOINT', ENDPOINT)
    expect(await joinWaitlist('nope')).toEqual({ kind: 'invalid' })
    expect(spy).not.toHaveBeenCalled()
  })

  it('sends JSON by default', async () => {
    const spy = mockFetch()
    vi.stubEnv('VITE_WAITLIST_ENDPOINT', ENDPOINT)
    expect(await joinWaitlist('someone@example.com')).toEqual({ kind: 'ok' })

    const [, init] = spy.mock.calls[0]!
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(init.body)).toEqual({ email: 'someone@example.com' })
  })

  it('sends form-encoded data with the provider field name when configured', async () => {
    const spy = mockFetch()
    vi.stubEnv('VITE_WAITLIST_ENDPOINT', ENDPOINT)
    vi.stubEnv('VITE_WAITLIST_FORMAT', 'form')
    vi.stubEnv('VITE_WAITLIST_FIELD', 'EMAIL')
    expect(await joinWaitlist('someone@example.com')).toEqual({ kind: 'ok' })

    const [, init] = spy.mock.calls[0]!
    expect(init.headers['Content-Type']).toBe('application/x-www-form-urlencoded')
    expect(init.body.toString()).toBe('EMAIL=someone%40example.com')
  })

  it('treats an address already on the list as success', async () => {
    mockFetch(422)
    vi.stubEnv('VITE_WAITLIST_ENDPOINT', ENDPOINT)
    expect(await joinWaitlist('someone@example.com')).toEqual({ kind: 'ok' })
  })

  it('reports failure on a provider error and on a network error', async () => {
    mockFetch(500)
    vi.stubEnv('VITE_WAITLIST_ENDPOINT', ENDPOINT)
    expect(await joinWaitlist('someone@example.com')).toEqual({ kind: 'failed' })

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    expect(await joinWaitlist('someone@example.com')).toEqual({ kind: 'failed' })
  })

  it('trims the address before sending', async () => {
    const spy = mockFetch()
    vi.stubEnv('VITE_WAITLIST_ENDPOINT', ENDPOINT)
    await joinWaitlist('  someone@example.com  ')
    expect(JSON.parse(spy.mock.calls[0]![1].body)).toEqual({ email: 'someone@example.com' })
  })
})
