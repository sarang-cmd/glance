/**
 * In-memory sliding-window rate limiter.
 *
 * Honest limitation: on serverless platforms each instance has its own map,
 * so this caps bursts per instance rather than globally. It is paired with a
 * unique constraint in Postgres and a honeypot, which hold even across
 * instances. For a strict global cap, move this to a Neon table or Upstash.
 */
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;
const MAX_GLOBAL_PER_DAY = 300; // bounds outbound confirmation emails

const hits = new Map<string, number[]>();
const globalHits: number[] = [];

function prune(list: number[], cutoff: number) {
  while (list.length && list[0] < cutoff) list.shift();
  return list;
}

export function rateLimit(key: string, now = Date.now()): { ok: true } | { ok: false; retryAfterSeconds: number } {
  const cutoff = now - WINDOW_MS;
  const list = prune(hits.get(key) ?? [], cutoff);
  const dayCutoff = now - 24 * 60 * 60 * 1000;
  prune(globalHits, dayCutoff);

  if (globalHits.length >= MAX_GLOBAL_PER_DAY) {
    return { ok: false, retryAfterSeconds: 3600 };
  }
  if (list.length >= MAX_PER_WINDOW) {
    return { ok: false, retryAfterSeconds: Math.ceil((list[0] + WINDOW_MS - now) / 1000) };
  }
  list.push(now);
  hits.set(key, list);
  globalHits.push(now);
  return { ok: true };
}

/** Test hook: reset all limiter state. Not used by the app at runtime. */
export function __resetRateLimits() {
  hits.clear();
  globalHits.length = 0;
}
