export type WaitlistResult =
  | { kind: 'ok' }
  | { kind: 'invalid' }
  | { kind: 'unconfigured' }
  | { kind: 'failed' }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(value: string): boolean {
  return EMAIL.test(value.trim())
}

/**
 * Some providers answer 200 and report the real outcome in the body. Kit does
 * exactly this: a rejected signup returns 200 with {"status":"failed"}. Trusting
 * the status code alone would tell a visitor they joined a list they did not.
 */
function bodyReportsFailure(payload: unknown): boolean {
  if (!payload || typeof payload !== 'object') return false
  const body = payload as Record<string, unknown>
  if (body.status === 'failed' || body.status === 'error') return true
  if (typeof body.error === 'string' && body.error) return true
  if (Array.isArray(body.errors)) return body.errors.length > 0
  if (body.errors && typeof body.errors === 'object') return Object.keys(body.errors).length > 0
  return false
}

/**
 * Posts to whatever external provider VITE_WAITLIST_ENDPOINT names. The
 * endpoint must be a PUBLIC form URL: subscriber data never touches this
 * repository (spec §14, §20) and no provider secret may reach the browser.
 *
 * Providers disagree on the wire format, so it is configurable rather than
 * hardcoded. Kit, Buttondown and Formspree accept JSON; hosted form endpoints
 * expect form-encoded data.
 */
export async function joinWaitlist(email: string, signal?: AbortSignal): Promise<WaitlistResult> {
  if (!isValidEmail(email)) return { kind: 'invalid' }

  const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT
  if (!endpoint) return { kind: 'unconfigured' }

  const field = import.meta.env.VITE_WAITLIST_FIELD || 'email'
  const formEncoded = import.meta.env.VITE_WAITLIST_FORMAT === 'form'
  const address = email.trim()

  let body: BodyInit
  let headers: HeadersInit

  if (formEncoded) {
    const params = new URLSearchParams({ [field]: address })
    // Hosted forms post their own hidden fields and reject submissions that
    // omit them. The honeypot must stay empty — filling it marks the submission
    // as a bot. Providers that do not use these simply ignore them.
    params.set('email_address_check', '')
    params.set('locale', import.meta.env.VITE_WAITLIST_LOCALE || 'en')
    body = params
    headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
  } else {
    body = JSON.stringify({ [field]: address })
    headers = { 'Content-Type': 'application/json', Accept: 'application/json' }
  }

  try {
    const response = await fetch(endpoint, { method: 'POST', headers, body, signal })

    // 422 usually means the address is already subscribed, which is a success
    // from the visitor's point of view.
    if (!response.ok && response.status !== 422) return { kind: 'failed' }

    // A non-JSON body (a redirect page, an empty 200) is not evidence of
    // failure, so only a body that actively reports one counts.
    const payload = await response.json().catch(() => null)
    return bodyReportsFailure(payload) ? { kind: 'failed' } : { kind: 'ok' }
  } catch {
    return { kind: 'failed' }
  }
}
