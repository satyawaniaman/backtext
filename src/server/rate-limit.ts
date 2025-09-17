/**
 * Simple in-memory rate limiter.
 * NOTE: This is suitable only for a single long-lived process.
 * In a serverless / multi-instance environment you should replace this
 * with a distributed store (Redis, Upstash, etc.).
 */

type BucketRecord = number[]; // epoch ms timestamps

const buckets = new Map<string, BucketRecord>();

export interface RateLimitOptions {
  key: string;          // unique identifier (ip, email, combo)
  windowMs: number;     // time window in ms
  max: number;          // max allowed within window
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfter?: number; // seconds
}

export function rateLimit({ key, windowMs, max }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;
  const list = buckets.get(key) ?? [];

  // Drop old entries
  const recent = list.filter((ts) => ts > windowStart);
  if (recent.length >= max) {
    const earliest = Math.min(...recent);
    const retryAfterMs = windowMs - (now - earliest);
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.ceil(retryAfterMs / 1000),
    };
  }
  recent.push(now);
  buckets.set(key, recent);
  return {
    ok: true,
    remaining: Math.max(0, max - recent.length),
  };
}

export function resetRateLimit(keyPrefix?: string) {
  if (!keyPrefix) {
    buckets.clear();
    return;
  }
  for (const key of buckets.keys()) {
    if (key.startsWith(keyPrefix)) buckets.delete(key);
  }
}
