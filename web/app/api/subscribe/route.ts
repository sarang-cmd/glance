import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { configured, db, rateLimit } from "@/lib/db";
import {
  signupSchema,
  hash,
  newToken,
  ipKey,
  allowedOrigin,
  unsubscribeToken,
  consentVersion,
  success,
} from "@/lib/release";
import { sendEmail } from "@/lib/email";
import { readJson, RequestBodyError } from "@/lib/request";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  const site = process.env.SITE_URL || "https://glance-win.vercel.app";
  if (!allowedOrigin(request.headers.get("origin"), site))
    return NextResponse.json(
      { error: "This request origin is not allowed." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return NextResponse.json({ error: "Use a JSON request." }, { status: 415 });
  let input;
  try {
    input = signupSchema.safeParse(await readJson(request, 2048));
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof RequestBodyError
            ? error.message
            : "The request could not be read.",
      },
      { status: error instanceof RequestBodyError ? error.status : 400 },
    );
  }
  if (!input.success)
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  if (input.data.website) return NextResponse.json(success);
  if (!configured())
    return NextResponse.json(
      {
        error:
          "The release list is not available yet. Please follow Glance on GitHub or try again later.",
      },
      { status: 503 },
    );
  try {
    const sql = db();
    const secret = process.env.RELEASE_TOKEN_SECRET!; // Vercel overwrites x-vercel-forwarded-for; never trust client x-forwarded-for for abuse limits.
    const ip = process.env.VERCEL
      ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
      : "local";
    if (
      !(await rateLimit(`ip:${ipKey(ip, secret)}`)) ||
      !(await rateLimit(`email:${ipKey(input.data.email, secret)}`, 3))
    )
      return NextResponse.json(
        { error: "Too many requests. Please try again in an hour." },
        { status: 429, headers: { "Retry-After": "3600" } },
      );
    await sql`DELETE FROM release_rate_limits WHERE window_start < now() - interval '1 day'`;
    const id = randomUUID();
    const token = newToken();
    const unsub = unsubscribeToken(id, secret);
    const rows =
      await sql`INSERT INTO release_subscribers (id,email,confirmation_hash,confirmation_expires,unsubscribe_hash,consent_version) VALUES (${id},${input.data.email},${hash(token)},now()+interval '24 hours',${hash(unsub)},${consentVersion}) ON CONFLICT (email) DO UPDATE SET confirmation_hash=EXCLUDED.confirmation_hash, confirmation_expires=EXCLUDED.confirmation_expires, requested_at=now(), consent_version=EXCLUDED.consent_version WHERE release_subscribers.status='pending' AND release_subscribers.requested_at < now()-interval '5 minutes' RETURNING id`;
    if (rows.length) {
      const rowId = String(rows[0].id);
      await sendEmail(
        input.data.email,
        "confirm",
        `${site}/confirm?token=${token}`,
        `${site}/unsubscribe?token=${unsubscribeToken(rowId, secret)}`,
        token,
      );
    }
    return NextResponse.json(success);
  } catch {
    return NextResponse.json(
      { error: "We could not send the confirmation. Please try again later." },
      { status: 503 },
    );
  }
}
