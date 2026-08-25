import { isDatabaseConfigured, query } from "@/lib/db";

/**
 * Rate limiting.
 *
 * With DATABASE_URL set, buckets live in a Postgres table so limits are
 * shared across serverless instances (Vercel). Without it, an in-memory
 * sliding-window limiter on globalThis keeps the demo usable; state is
 * intentionally volatile there and per-instance only.
 *
 * Keys are opaque (hashed IP + UA) and never persisted or returned to
 * clients beyond the retry-after hint.
 */

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  if (isDatabaseConfigured()) {
    return postgresLimit(key, limit, windowMs);
  }
  return memoryLimit(key, limit, windowMs);
}

// --- Postgres fixed window --------------------------------------------------

async function postgresLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const rows = await query<{ hit_count: string; window_start: string }>(
    `INSERT INTO rate_limit_buckets (bucket, hit_count, window_start)
     VALUES ($1, 1, now())
     ON CONFLICT (bucket) DO UPDATE SET
       hit_count = CASE
         WHEN rate_limit_buckets.window_start <= now() - make_interval(secs => $2)
           THEN 1 ELSE rate_limit_buckets.hit_count + 1 END,
       window_start = CASE
         WHEN rate_limit_buckets.window_start <= now() - make_interval(secs => $2)
           THEN now() ELSE rate_limit_buckets.window_start END
     RETURNING hit_count, window_start`,
    [key, windowMs / 1000]
  );

  const hits = Number(rows[0].hit_count);
  const windowStart = new Date(rows[0].window_start).getTime();
  const windowEndsAt = windowStart + windowMs;

  if (hits > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((windowEndsAt - Date.now()) / 1000)),
    };
  }
  return { ok: true, remaining: Math.max(0, limit - hits), retryAfterSeconds: 0 };
}

// --- In-memory sliding window ----------------------------------------------

type Bucket = number[];

function bucketMap(): Map<string, Bucket> {
  const globalBuckets = globalThis as unknown as {
    __scamshieldRateBuckets?: Map<string, Bucket>;
  };
  globalBuckets.__scamshieldRateBuckets ??= new Map();
  return globalBuckets.__scamshieldRateBuckets;
}

function memoryLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const buckets = bucketMap();
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
