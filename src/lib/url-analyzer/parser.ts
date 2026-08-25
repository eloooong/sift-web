import type { ParsedUrlParts } from "./types";

/**
 * Two-level public suffixes we care about for PH-focused analysis. A full
 * Public Suffix List is overkill here; this covers the cases where a naive
 * "last two labels" heuristic would pick the wrong registrable domain
 * (e.g. "sss.gov.ph" → domain should be "sss.gov.ph", not "gov.ph").
 */
const SECOND_LEVEL_SUFFIXES = new Set([
  "com.ph",
  "net.ph",
  "org.ph",
  "gov.ph",
  "edu.ph",
  "mil.ph",
  "i.ph",
  "ngo.ph",
  "com.uk",
  "org.uk",
  "net.uk",
  "gov.uk",
  "ac.uk",
  "co.uk",
  "com.au",
  "net.au",
  "org.au",
  "gov.au",
  "co.jp",
  "ne.jp",
  "or.jp",
  "go.jp",
  "com.sg",
  "com.my",
  "co.id",
  "co.in",
  "co.nz",
  "com.hk",
  "com.tw",
  "com.br",
  "com.mx",
  "co.za",
]);

export const ALLOWED_PROTOCOLS = ["http:", "https:"] as const;

export function normalizeInputUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, "");
  if (!trimmed) return "";
  // Assume https when the user omits the scheme, but keep the original
  // protocol visible in the report when they explicitly typed one.
  if (!/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export type ParseOutcome =
  | { ok: true; url: URL; parts: ParsedUrlParts }
  | { ok: false; reason: string };

/**
 * Parses a user-supplied URL with WHATWG URL (never fetches anything).
 * The caller is responsible for rejecting disallowed protocols before use.
 */
export function parseUrl(rawInput: string): ParseOutcome {
  const normalized = normalizeInputUrl(rawInput);
  if (!normalized) {
    return { ok: false, reason: "empty" };
  }

  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    return { ok: false, reason: "unparseable" };
  }

  const hostname = url.hostname.toLowerCase();
  const labels = hostname.split(".").filter(Boolean);

  let suffixLength = 2;
  const lastTwo = labels.slice(-2).join(".");
  if (SECOND_LEVEL_SUFFIXES.has(lastTwo)) {
    suffixLength = Math.min(3, labels.length);
  }
  if (labels.length < suffixLength + 1) {
    // e.g. "localhost" or single-label hosts; treat whole host as domain.
    suffixLength = labels.length;
  }

  const domain = labels.slice(-suffixLength).join(".");
  const subdomains = labels.slice(0, -suffixLength);

  const queryParams = [...url.searchParams.entries()].map(([name, value]) => ({
    name,
    value,
  }));

  return {
    ok: true,
    url,
    parts: {
      protocol: url.protocol.replace(/:$/, ""),
      hostname,
      subdomains,
      domain,
      path: decodeSafe(url.pathname),
      queryParams,
      port: url.port,
      hasCredentials: Boolean(url.username || url.password),
    },
  };
}

function decodeSafe(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Levenshtein distance with early exit; inputs are short host labels. */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 3) return Infinity;
  const prev = new Array<number>(b.length + 1);
  const curr = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}
