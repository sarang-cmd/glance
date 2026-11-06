import { createReleaseStore } from "./release-store";
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

export function releaseStore() {
  return createReleaseStore(db());
}
