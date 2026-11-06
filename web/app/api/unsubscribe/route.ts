import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash, tokenSchema } from "@/lib/release";
export const runtime = "nodejs";
// RFC 8058 requests are intentionally allowed without an Origin header. The unguessable token authorizes removal only.
export async function POST(request: NextRequest) {
  const token = tokenSchema.safeParse(
    request.nextUrl.searchParams.get("token"),
  );
  if (!token.success)
    return NextResponse.json(
      { error: "Invalid unsubscribe link." },
      { status: 400 },
    );
  if (!process.env.DATABASE_URL)
    return NextResponse.json(
      {
        error:
          "Unsubscribe is temporarily unavailable. Please try again or contact sarang.cmd@gmail.com.",
      },
      { status: 503 },
    );
  try {
    const sql = db();
    await sql`DELETE FROM release_subscribers WHERE unsubscribe_hash=${hash(token.data)}`;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "We could not update the list. Please try again." },
      { status: 503 },
    );
  }
}
