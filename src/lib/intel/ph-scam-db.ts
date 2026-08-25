/**
 * Client for the PH Scam DB community feed (https://github.com/wgtechlabs/ph-scam-db).
 * MIT-licensed, CORS-enabled JSON feed of Philippine numbers reported for scams.
 * The feed is fetched server-side, cached in memory, and refreshed periodically
 * per the upstream guidance (cache locally, refresh conservatively).
 */

const FEED_URL = "https://wgtechlabs.com/ph-scam-db/data/index.json";

/** How long a successful fetch is considered fresh. */
const FRESH_TTL_MS = 6 * 60 * 60 * 1000;
/** How long a stale snapshot may still be served after fetches start failing. */
const STALE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
/** Short negative cache so an unreachable feed does not get hammered per scan. */
const FAILURE_TTL_MS = 5 * 60 * 1000;

export type CommunityStatus = "reported" | "watchlist" | "confirmed";

export type CommunityVerdict = "warn" | "block";

export type CommunityNumberRecord = {
  /** E.164 phone number, e.g. "+639171234567". */
  number: string;
  categories: string[];
  status: CommunityStatus;
  verdict: CommunityVerdict;
  reportCount: number;
  lastReportedAt: string | null;
};

export type CommunityIntel = {
  schemaVersion: number;
  /** E.164 number → record. */
  byNumber: Map<string, CommunityNumberRecord>;
  fetchedAt: string;
};

type CacheShape = {
  intel: CommunityIntel | null;
  expiresAt: number;
  failedAt: number | null;
};

const globalCache = globalThis as unknown as {
  __scamshieldPhScamDbCache?: CacheShape;
};

type RawEntry = {
  number?: unknown;
  categories?: unknown;
  status?: unknown;
  verdict?: unknown;
  riskLevel?: unknown;
  reportCount?: unknown;
  lastReportedAt?: unknown;
};

function parseEntries(payload: unknown): CommunityNumberRecord[] {
  if (!payload || typeof payload !== "object") return [];
  const entries = (payload as { entries?: unknown }).entries;
  if (!Array.isArray(entries)) return [];

  const records: CommunityNumberRecord[] = [];
  for (const entry of entries as RawEntry[]) {
    const number =
      typeof entry.number === "string" ? normalizeToE164(entry.number) : null;
    if (!number) continue;
    const status =
      entry.status === "reported" ||
      entry.status === "watchlist" ||
      entry.status === "confirmed"
        ? entry.status
        : "reported";
    const verdict = entry.verdict === "block" ? "block" : "warn";
    records.push({
      number,
      categories: Array.isArray(entry.categories)
        ? entry.categories.filter(
            (category): category is string => typeof category === "string"
          )
        : [],
      status,
      verdict,
      reportCount:
        typeof entry.reportCount === "number" && entry.reportCount > 0
          ? Math.floor(entry.reportCount)
          : 1,
      lastReportedAt:
        typeof entry.lastReportedAt === "string" ? entry.lastReportedAt : null,
    });
  }
  return records;
}

/**
 * Normalizes common Philippine phone formats to E.164:
 * "0917 123 4567" → "+639171234567", "(02) 8123 4567" → "+63281234567",
 * "639181234567" → "+639181234567", "+63 917 123 4567" → "+639171234567".
 */
export function normalizeToE164(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 13) return null;

  if (digits.startsWith("+63")) return digits.length === 12 ? digits : null;

  if (digits.startsWith("63")) {
    // National number in international form without "+" (12 digits total).
    return digits.length === 12 ? `+${digits}` : null;
  }

  // Mobile: 0 + 10-digit number starting with 9.
  if (digits.startsWith("09") && digits.length === 11) {
    return `+63${digits.slice(1)}`;
  }

  // Landline: 0 + area code (2–3 digits) + 8-digit local number.
  if (digits.startsWith("0") && !digits.startsWith("09")) {
    if (digits.length === 11 || digits.length === 12) {
      return `+63${digits.slice(1)}`;
    }
    return null;
  }

  return null;
}

const PHONE_CANDIDATE_REGEX = /\(?\+?\d[\d\s().-]{7,18}\d/g;

/** Extracts substrings from free text that look like phone numbers. */
export function extractPhoneCandidates(text: string): string[] {
  const candidates = text.match(PHONE_CANDIDATE_REGEX) ?? [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const candidate of candidates) {
    const trimmed = candidate.trim();
    if (trimmed.length < 8 || trimmed.length > 20) continue;
    if (seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }
  return result;
}

export type CommunityNumberMatch = CommunityNumberRecord & {
  /** The matched substring exactly as it appeared in the scanned text. */
  evidence: string;
};

const MAX_REPORTED_NUMBERS = 3;

/**
 * Finds numbers in the text that appear in the community database.
 * Deterministic and pure: safe to call anywhere, no network involved.
 */
export function findReportedNumbers(
  text: string,
  intel: CommunityIntel
): CommunityNumberMatch[] {
  const matches: CommunityNumberMatch[] = [];
  const seen = new Set<string>();

  for (const candidate of extractPhoneCandidates(text)) {
    if (matches.length >= MAX_REPORTED_NUMBERS) break;
    const e164 = normalizeToE164(candidate);
    if (!e164 || seen.has(e164)) continue;
    seen.add(e164);
    const record = intel.byNumber.get(e164);
    if (record) matches.push({ ...record, evidence: candidate });
  }

  return matches.sort((a, b) => b.reportCount - a.reportCount);
}

async function fetchFeed(): Promise<CommunityIntel | null> {
  try {
    const response = await fetch(FEED_URL, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload: unknown = await response.json();
    const records = parseEntries(payload);
    if (records.length === 0) return null;
    const schemaVersion =
      payload && typeof payload === "object"
        ? Number((payload as { schemaVersion?: unknown }).schemaVersion) || 0
        : 0;
    return {
      schemaVersion,
      byNumber: new Map(records.map((record) => [record.number, record])),
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Returns the community intel snapshot, refreshing the cache when stale.
 * Falls back to a recent snapshot when the feed is temporarily unreachable,
 * and returns null when no usable data exists at all.
 */
export async function getCommunityIntel(): Promise<CommunityIntel | null> {
  const cache = globalCache.__scamshieldPhScamDbCache;
  const now = Date.now();

  if (cache?.intel && now < cache.expiresAt) return cache.intel;

  // A recent fetch failure: skip the network and serve the last good
  // snapshot (or nothing) until the short backoff window passes.
  if (cache?.failedAt && now < cache.failedAt) {
    return cache.intel ?? null;
  }

  const intel = await fetchFeed();

  if (intel) {
    globalCache.__scamshieldPhScamDbCache = {
      intel,
      expiresAt: now + FRESH_TTL_MS,
      failedAt: null,
    };
    return intel;
  }

  if (cache?.intel && now < cache.expiresAt + STALE_TTL_MS) {
    globalCache.__scamshieldPhScamDbCache = {
      ...cache,
      failedAt: now + FAILURE_TTL_MS,
    };
    return cache.intel;
  }

  globalCache.__scamshieldPhScamDbCache = {
    intel: null,
    expiresAt: 0,
    failedAt: now + FAILURE_TTL_MS,
  };
  return null;
}

export type CommunityIntelStats = {
  trackedNumbers: number;
  confirmedCount: number;
  blockCount: number;
  topCategory: { category: string; count: number } | null;
  mostRecentReport: string | null;
  fetchedAt: string;
};

export function summarizeCommunityIntel(
  intel: CommunityIntel
): CommunityIntelStats {
  const categoryCounts = new Map<string, number>();
  let confirmedCount = 0;
  let blockCount = 0;
  let mostRecentReport: string | null = null;

  for (const record of intel.byNumber.values()) {
    if (record.status === "confirmed") confirmedCount += 1;
    if (record.verdict === "block") blockCount += 1;
    for (const category of record.categories) {
      categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    }
    if (
      record.lastReportedAt &&
      (!mostRecentReport || record.lastReportedAt > mostRecentReport)
    ) {
      mostRecentReport = record.lastReportedAt;
    }
  }

  const topCategoryEntry = [...categoryCounts.entries()].sort(
    (a, b) => b[1] - a[1]
  )[0];

  return {
    trackedNumbers: intel.byNumber.size,
    confirmedCount,
    blockCount,
    topCategory: topCategoryEntry
      ? { category: topCategoryEntry[0], count: topCategoryEntry[1] }
      : null,
    mostRecentReport,
    fetchedAt: intel.fetchedAt,
  };
}
