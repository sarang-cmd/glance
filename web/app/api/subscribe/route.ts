import { NextRequest, NextResponse } from "next/server";
import { configured, releaseStore } from "@/lib/db";
import { signupSchema, allowedOrigin, success } from "@/lib/release";
import { sendEmail } from "@/lib/email";
import { readJson, RequestBodyError } from "@/lib/request";
import { createReleaseService } from "@/lib/release-service";
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
    const service = createReleaseService(
      releaseStore(),
      sendEmail,
      site,
      process.env.RELEASE_TOKEN_SECRET!,
    );
    // Only the platform-controlled Vercel IP header is trusted.
    const ip = process.env.VERCEL
      ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
      : "local";
    const result = await service.signup(input.data.email, ip);
    if (result.kind === "limited")
      return NextResponse.json(
        { error: "Too many requests. Please try again in an hour." },
        { status: 429, headers: { "Retry-After": "3600" } },
      );
    return NextResponse.json(success);
  } catch {
    return NextResponse.json(
      { error: "We could not send the confirmation. Please try again later." },
      { status: 503 },
    );
  }
}
