import { randomUUID } from "node:crypto";
import { consentVersion, hash, newToken, unsubscribeToken } from "./release";

// The production adapter and embedded Postgres tests execute the same SQL.
export type Sql = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>;

export function createReleaseStore(sql: Sql) {
  return {
    async requestSignup(email: string, secret: string) {
      const id = randomUUID();
      const token = newToken();
      const rows =
        await sql`INSERT INTO release_subscribers (id,email,confirmation_hash,confirmation_expires,unsubscribe_hash,consent_version) VALUES (${id},${email},${hash(token)},now()+interval '24 hours',${hash(unsubscribeToken(id, secret))},${consentVersion}) ON CONFLICT (email) DO UPDATE SET confirmation_hash=EXCLUDED.confirmation_hash, confirmation_expires=EXCLUDED.confirmation_expires, requested_at=now(), consent_version=EXCLUDED.consent_version WHERE release_subscribers.status='pending' AND release_subscribers.requested_at < now()-interval '5 minutes' RETURNING id`;
      if (!rows.length) return null;
      const subscriberId = String(rows[0].id);
      return {
        id: subscriberId,
        token,
        unsubscribeToken: unsubscribeToken(subscriberId, secret),
      };
    },
    async confirm(token: string) {
      const rows =
        await sql`UPDATE release_subscribers SET status='subscribed', confirmed_at=now() WHERE confirmation_hash=${hash(token)} AND confirmation_expires>now() AND status='pending' RETURNING id,email`;
      if (rows.length)
        return {
          kind: "confirmed" as const,
          id: String(rows[0].id),
          email: String(rows[0].email),
        };
      const existing =
        await sql`SELECT status FROM release_subscribers WHERE confirmation_hash=${hash(token)}`;
      return {
        kind:
          existing[0]?.status === "subscribed"
            ? ("already" as const)
            : ("invalid" as const),
      };
    },
    async markWelcomeSent(id: string) {
      await sql`UPDATE release_subscribers SET welcome_sent_at=now() WHERE id=${id}`;
    },
    async unsubscribe(token: string) {
      await sql`DELETE FROM release_subscribers WHERE unsubscribe_hash=${hash(token)}`;
    },
    async rateLimit(key: string, max = 5) {
      const rows =
        await sql`INSERT INTO release_rate_limits (key,window_start,hits) VALUES (${key},date_trunc('hour',now()),1) ON CONFLICT (key,window_start) DO UPDATE SET hits=release_rate_limits.hits+1 RETURNING hits`;
      return Number(rows[0].hits) <= max;
    },
    async cleanRateLimits() {
      await sql`DELETE FROM release_rate_limits WHERE window_start < now() - interval '1 day'`;
    },
  };
}
export type ReleaseStore = ReturnType<typeof createReleaseStore>;
