import { createHash, createHmac, randomBytes } from "node:crypto";
import { z } from "zod";
export const consentVersion = "release-list-v1";
export const signupSchema = z.object({
  email: z
    .email()
    .max(254)
    .transform((s) => s.trim().toLowerCase()),
  website: z.string().max(1000).optional().default(""),
});
export const tokenSchema = z.string().regex(/^[a-f0-9]{64}$/);
export const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export const newToken = () => randomBytes(32).toString("hex");
export function unsubscribeToken(id: string, secret: string) {
  return createHmac("sha256", secret).update(`unsubscribe:${id}`).digest("hex");
}
export function ipKey(ip: string, secret: string) {
  return createHmac("sha256", secret).update(ip).digest("hex");
}
export function allowedOrigin(origin: string | null, site: string) {
  return origin === new URL(site).origin;
}
export const success = { ok: true };
