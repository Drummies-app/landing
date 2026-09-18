export type WaitlistResult =
  | { kind: "ok" }
  | { kind: "invalid" }
  | { kind: "unconfigured" }
  | { kind: "failed" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL.test(value.trim());
}

export async function joinWaitlist(
  email: string,
  signal?: AbortSignal,
): Promise<WaitlistResult> {
  if (!isValidEmail(email)) return { kind: "invalid" };

  const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT;
  if (!endpoint) return { kind: "unconfigured" };

  const field = import.meta.env.VITE_WAITLIST_FIELD || "email";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ [field]: email.trim() }),
      signal,
    });
    // Providers answer 200 or 201; some return 422 for an address already on the
    // list, which is a success from the visitor's point of view.
    if (response.ok || response.status === 422) return { kind: "ok" };
    return { kind: "failed" };
  } catch {
    return { kind: "failed" };
  }
}
