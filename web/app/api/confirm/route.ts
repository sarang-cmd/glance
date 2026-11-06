import { NextRequest, NextResponse } from "next/server";
import { configured, releaseStore } from "@/lib/db";
import { tokenSchema, allowedOrigin } from "@/lib/release";
import { createReleaseService } from "@/lib/release-service";
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
    const service = createReleaseService(
      releaseStore(),
      sendEmail,
      site,
      process.env.RELEASE_TOKEN_SECRET!,
    );
    const result = await service.confirm(token.data);
    if (result.kind === "invalid")
      return NextResponse.json(
        {
          error:
            "This link has expired or is invalid. Please request a new confirmation from the release list page.",
        },
        { status: 410 },
      );
    return NextResponse.json({
      ok: true,
      ...("notice" in result ? { notice: result.notice } : {}),
    });
  } catch {
    return NextResponse.json(
      { error: "Confirmation is temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }
}
