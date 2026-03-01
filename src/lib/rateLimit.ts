/**
 * In-memory Rate Limiter
 * Tracks request counts per IP with automatic window expiry.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // timestamp ms
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);

/**
 * @param ip - Client IP address
 * @param key - Unique route key (e.g. "book", "callback")
 * @param limit - Max requests per window
 * @param windowMs - Window duration in ms
 * @returns { allowed: boolean, retryAfterSeconds?: number }
 */
export function rateLimit(
  ip: string,
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds?: number } {
  const mapKey = `${key}:${ip}`;
  const now = Date.now();
  const entry = store.get(mapKey);

  if (!entry || now > entry.resetAt) {
    // First request or window expired — start fresh
    store.set(mapKey, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= limit) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  entry.count++;
  return { allowed: true };
}

/**
 * Extract real client IP from Next.js request headers
 */
export function getClientIp(request: Request): string {
  const headers = new Headers((request as any).headers);
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
