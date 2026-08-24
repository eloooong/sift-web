/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Keys are opaque (hashed IP + UA) and never persisted or returned to
 * clients. State lives on globalThis so Next.js dev HMR doesn't reset it,
 * and it is intentionally volatile — a restart clears all limits.
 */

type Bucket = number[];

const globalBuckets = globalThis as unknown as {
  __scamshieldRateBuckets?: Map<string, Bucket>;
};

const buckets: Map<string, Bucket> =
  globalBuckets.__scamshieldRateBuckets ?? new Map();
globalBuckets.__scamshieldRateBuckets = buckets;

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();

  // Opportunistic cleanup so the map cannot grow without bound.
  if (buckets.size > 5000) {
    for (const [existingKey, hits] of buckets) {
      const fresh = hits.filter((t) => now - t < windowMs);
      if (fresh.length === 0) buckets.delete(existingKey);
      else buckets.set(existingKey, fresh);
    }
  }

  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((windowMs - (now - hits[0])) / 1000)
    );
    return { ok: false, remaining: 0, retryAfterSeconds };
  }

  hits.push(now);
  buckets.set(key, hits);
  return { ok: true, remaining: limit - hits.length, retryAfterSeconds: 0 };
}
