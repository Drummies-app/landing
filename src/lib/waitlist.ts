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
 * Posts to whatever external provider VITE_WAITLIST_ENDPOINT names. The
 * endpoint must be a PUBLIC form URL: subscriber data never touches this
 * repository (spec §14, §20) and no provider secret may reach the browser.
 *
 * Providers disagree on the wire format, so it is configurable rather than
 * hardcoded. Buttondown, Kit and Formspree accept JSON; Brevo's hosted form
 * (sibforms.com) expects form-encoded data with the field named EMAIL.
 */
export async function joinWaitlist(email: string, signal?: AbortSignal): Promise<WaitlistResult> {
  if (!isValidEmail(email)) return { kind: 'invalid' }

  const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT
  if (!endpoint) return { kind: 'unconfigured' }

  const field = import.meta.env.VITE_WAITLIST_FIELD || 'email'
  const formEncoded = import.meta.env.VITE_WAITLIST_FORMAT === 'form'
  const address = email.trim()

  const body = formEncoded ? new URLSearchParams({ [field]: address }) : JSON.stringify({ [field]: address })
  const headers: HeadersInit = formEncoded
    ? { 'Content-Type': 'application/x-www-form-urlencoded' }
    : { 'Content-Type': 'application/json', Accept: 'application/json' }

  try {
    const response = await fetch(endpoint, { method: 'POST', headers, body, signal })
    // Providers answer 200 or 201; some return 422 for an address already on
    // the list, which is a success from the visitor's point of view.
    if (response.ok || response.status === 422) return { kind: 'ok' }
    return { kind: 'failed' }
  } catch {
    return { kind: 'failed' }
  }
}
