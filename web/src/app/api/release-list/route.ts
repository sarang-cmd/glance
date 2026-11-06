import { NextRequest, NextResponse } from 'next/server';
import { releaseListSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';
import { DatabaseNotConfigured, getQueryable } from '@/lib/db';
import { requestSignup } from '@/lib/release-store';
import { confirmationEmail, createResendSender } from '@/lib/email';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim().slice(0, 64);
  return req.headers.get('x-real-ip')?.slice(0, 64) ?? 'unknown';
}

function originAllowed(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // Non-browser clients: allowed, still rate limited and honeypot-filtered.
  try {
    const originHost = new URL(origin).host;
    const allowed = new Set([req.headers.get('host') ?? '', new URL(site.url).host]);
    return allowed.has(originHost);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!originAllowed(req)) {
    return NextResponse.json({ ok: false, error: 'Bad origin.' }, { status: 403 });
  }
  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ ok: false, error: 'Expected a JSON body.' }, { status: 415 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'That body could not be read.' }, { status: 400 });
  }

  const parsed = releaseListSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Enter a valid email address.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
  const { email, company, source } = parsed.data;

  // Honeypot: pretend success, store nothing, send nothing.
  if (company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const limited = rateLimit(clientIp(req));
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: 'Too many attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSeconds) } }
    );
  }

  let db;
  try {
    db = getQueryable();
  } catch (err) {
    if (err instanceof DatabaseNotConfigured) {
      return NextResponse.json({ ok: false, error: 'The release list is not configured yet. Please try again later.' }, { status: 503 });
    }
    throw err;
  }

  let result;
  try {
    result = await requestSignup(db, email, source);
  } catch (err) {
    console.error('release-list signup failed:', err instanceof Error ? err.message : 'unknown error');
    return NextResponse.json({ ok: false, error: 'Could not save your signup. Please try again.' }, { status: 500 });
  }

  if (result.kind === 'already-confirmed') {
    // Deliberately identical response: never reveal list membership.
    return NextResponse.json({ ok: true });
  }

  const confirmUrl = `${site.url}/release-list/confirm?token=${result.confirmToken}`;
  const unsubscribeUrl = `${site.url}/release-list/unsubscribe?token=${result.unsubscribeToken}`;

  let send;
  try {
    send = createResendSender();
  } catch {
    return NextResponse.json({ ok: false, error: 'Email delivery is not configured yet. Please try again later.' }, { status: 503 });
  }

  try {
    await send(confirmationEmail(email, confirmUrl, unsubscribeUrl));
  } catch (err) {
    console.error('confirmation email failed:', err instanceof Error ? err.message : 'unknown error');
    return NextResponse.json({ ok: false, error: 'Could not send the confirmation email. Please try again in a minute.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
