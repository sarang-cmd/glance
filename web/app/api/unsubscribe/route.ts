import { NextRequest, NextResponse } from "next/server";
import { releaseStore } from "@/lib/db";
import { tokenSchema } from "@/lib/release";
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
    await releaseStore().unsubscribe(token.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "We could not update the list. Please try again." },
      { status: 503 },
    );
  }
}
