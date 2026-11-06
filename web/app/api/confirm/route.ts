import { NextRequest, NextResponse } from "next/server";
import { configured, db } from "@/lib/db";
import {
  tokenSchema,
  hash,
  allowedOrigin,
  unsubscribeToken,
} from "@/lib/release";
import { sendEmail } from "@/lib/email";
import { readJson, RequestBodyError } from "@/lib/request";
import { z } from "zod";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  const site = process.env.SITE_URL || "https://glance-win.vercel.app";
  if (!allowedOrigin(request.headers.get("origin"), site))
    return NextResponse.json(
      { error: "This request origin is not allowed." },
      { status: 403 },
    );
  if (!configured())
    return NextResponse.json(
      { error: "The release list is temporarily unavailable." },
      { status: 503 },
    );
  let token;
  try {
    const input = z
      .object({ token: tokenSchema })
      .parse(await readJson(request, 256));
    token = tokenSchema.safeParse(input.token);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid confirmation link." },
      { status: error instanceof RequestBodyError ? error.status : 400 },
    );
  }
  if (!token.success)
    return NextResponse.json(
      { error: "Invalid confirmation link." },
      { status: 400 },
    );
  try {
    const sql = db();
    const rows =
      await sql`UPDATE release_subscribers SET status='subscribed', confirmed_at=now() WHERE confirmation_hash=${hash(token.data)} AND confirmation_expires>now() AND status='pending' RETURNING id,email`;
    if (!rows.length) {
      const existing =
        await sql`SELECT status FROM release_subscribers WHERE confirmation_hash=${hash(token.data)}`;
      if (existing[0]?.status === "subscribed")
        return NextResponse.json({ ok: true });
      return NextResponse.json(
        {
          error:
            "This link has expired or is invalid. Please request a new confirmation from the release list page.",
        },
        { status: 410 },
      );
    }
    const row = rows[0];
    try {
      await sendEmail(
        String(row.email),
        "welcome",
        "https://github.com/sarang-cmd/glance",
        `${site}/unsubscribe?token=${unsubscribeToken(String(row.id), process.env.RELEASE_TOKEN_SECRET!)}`,
        String(row.id),
      );
      await sql`UPDATE release_subscribers SET welcome_sent_at=now() WHERE id=${row.id}`;
    } catch {
      // Subscription remains valid if the welcome email provider fails. No personal data is logged.
      return NextResponse.json({
        ok: true,
        notice:
          "Your subscription is confirmed. The welcome email could not be delivered.",
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Confirmation is temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }
}
