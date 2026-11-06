import { neon } from "@neondatabase/serverless";
export function db() {
  if (!process.env.DATABASE_URL) throw new Error("Release list not configured");
  return neon(process.env.DATABASE_URL);
}
export function configured() {
  return Boolean(
    process.env.DATABASE_URL &&
    process.env.RESEND_API_KEY &&
    process.env.RESEND_FROM_EMAIL &&
    process.env.RELEASE_TOKEN_SECRET &&
    process.env.RELEASE_TOKEN_SECRET.length >= 64 &&
    process.env.SITE_URL,
  );
}
export async function rateLimit(key: string, max = 5) {
  const sql = db();
  const rows =
    await sql`INSERT INTO release_rate_limits (key,window_start,hits) VALUES (${key},date_trunc('hour',now()),1) ON CONFLICT (key,window_start) DO UPDATE SET hits=release_rate_limits.hits+1 RETURNING hits`;
  return Number(rows[0].hits) <= max;
}
