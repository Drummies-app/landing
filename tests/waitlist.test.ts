import { afterEach, describe, expect, it, vi } from 'vitest'
import { isValidEmail, joinWaitlist } from '../src/lib/waitlist'

const ENDPOINT = 'https://sibforms.com/serve/test-form'

function mockFetch(status = 200, payload: unknown = null) {
  const spy = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => {
      if (payload === null) throw new Error('not json')
      return payload
    },
  })
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

    const sent = new URLSearchParams(init.body.toString())
    expect(sent.get('EMAIL')).toBe('someone@example.com')
    // The honeypot must be present and empty; filling it marks the submission
    // as a bot and the provider drops it.
    expect(sent.get('email_address_check')).toBe('')
    expect(sent.get('locale')).toBe('en')
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

  it('treats a 200 that reports failure in the body as a failure', async () => {
    // Kit answers 200 with a failed status rather than an error code.
    mockFetch(200, { status: 'failed', errors: { messages: ["Form couldn't be found"] } })
    vi.stubEnv('VITE_WAITLIST_ENDPOINT', ENDPOINT)
    expect(await joinWaitlist('someone@example.com')).toEqual({ kind: 'failed' })
  })

  it('accepts a 200 whose body reports success or carries no errors', async () => {
    mockFetch(200, { status: 'success', subscription: { id: 1 } })
    vi.stubEnv('VITE_WAITLIST_ENDPOINT', ENDPOINT)
    expect(await joinWaitlist('someone@example.com')).toEqual({ kind: 'ok' })

    mockFetch(200, { status: 'success', errors: {} })
    expect(await joinWaitlist('someone@example.com')).toEqual({ kind: 'ok' })
  })

  it('does not treat an unreadable body as a failure', async () => {
    // A redirect page or an empty 200 is not evidence the signup was rejected.
    mockFetch(200, null)
    vi.stubEnv('VITE_WAITLIST_ENDPOINT', ENDPOINT)
    expect(await joinWaitlist('someone@example.com')).toEqual({ kind: 'ok' })
  })
})
