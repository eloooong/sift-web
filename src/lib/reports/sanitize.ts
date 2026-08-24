/**
 * Sanitization helpers for community-submitted content.
 *
 * React escapes all rendered text, so XSS defense here is defense-in-depth:
 * we normalize input, strip control characters, cap lengths, and reduce
 * free-form "sender" handles to masked, format-checked strings before they
 * are ever stored. No field is ever rendered as HTML.
 */

/** Remove control characters (except \n), collapse runs of blank lines/spaces. */
export function sanitizeText(raw: string, maxLength: number): string {
  const noControl = raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  const collapsed = noControl
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return collapsed.slice(0, maxLength);
}

export function countUrls(text: string): number {
  return (text.match(/https?:\/\//gi) ?? []).length;
}

const DOMAIN_PATTERN =
  /^(?=.{4,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;

/**
 * Reduce a user-supplied handle (phone / email / domain / username) to a
 * safe display form. Anything that does not parse cleanly becomes null —
 * we would rather drop data than store something executable or personal.
 */
export function sanitizeSenderHandle(raw: string): string | null {
  const cleaned = raw.trim().toLowerCase().slice(0, 200);
  if (!cleaned) return null;

  // If a URL-ish blob was pasted, extract just the hostname.
  const hostMatch = cleaned.match(/^https?:\/\/([^/?#\s]+)/);
  if (hostMatch) {
    return DOMAIN_PATTERN.test(hostMatch[1]) ? hostMatch[1] : null;
  }

  // Email-shaped → keep only the domain part.
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
    const domain = cleaned.split("@").pop() ?? "";
    return DOMAIN_PATTERN.test(domain) ? domain : null;
  }

  // Bare domain.
  if (DOMAIN_PATTERN.test(cleaned)) return cleaned;

  // Phone-like: keep digits/+ only, then mask everything but country hint and last 2.
  const digits = cleaned.replace(/[^\d+]/g, "");
  if (digits.replace(/\D/g, "").length >= 7 && digits.length <= 20) {
    const tail = digits.slice(-2);
    const head = digits.startsWith("+") ? "+•• " : "•••• ";
    const middle = "•".repeat(Math.min(Math.max(digits.length - 4, 3), 9));
    return `${head}${middle} ${tail}`.slice(0, 24);
  }

  // Generic social handle: letters/digits/._- only, heavily masked.
  const handle = cleaned.match(/^[a-z0-9._-]{5,30}$/)?.[0];
  if (handle) {
    return `${handle.slice(0, 2)}${"•".repeat(Math.max(handle.length - 4, 2))}${handle.slice(-2)}`;
  }

  return null;
}

export function deriveShortDescription(description: string): string {
  const flat = description.replace(/\s+/g, " ").trim();
  if (flat.length <= 160) return flat;
  return `${flat.slice(0, 157).trimEnd()}…`;
}

export function descriptionFingerprint(description: string): string {
  return description.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 120);
}
