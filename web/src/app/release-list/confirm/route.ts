import { NextRequest, NextResponse } from 'next/server';
import { getQueryable, DatabaseNotConfigured } from '@/lib/db';
import { confirmSignup } from '@/lib/release-store';
import { createResendSender, welcomeEmail } from '@/lib/email';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TOKEN = /^[a-f0-9]{64}$/;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? '';
  const back = (state: string) => NextResponse.redirect(new URL(`/release-list/confirmed?state=${state}`, site.url), 303);

  if (!TOKEN.test(token)) return back('invalid');

  let db;
  try {
    db = getQueryable();
  } catch (err) {
    if (err instanceof DatabaseNotConfigured) return back('error');
    throw err;
  }

  let outcome;
  try {
    outcome = await confirmSignup(db, token);
  } catch (err) {
    console.error('confirm failed:', err instanceof Error ? err.message : 'unknown error');
    return back('error');
  }

  if (outcome === 'confirmed') {
    // Best effort welcome email. A failure here must not show the user an error.
    try {
      const { rows } = await db.query(`SELECT email, unsubscribe_token FROM release_list WHERE confirm_token = $1`, [token]);
      const row = rows[0] as { email?: string; unsubscribe_token?: string } | undefined;
      if (row?.email && row?.unsubscribe_token) {
        const send = createResendSender();
        await send(welcomeEmail(row.email, `${site.url}/release-list/unsubscribe?token=${row.unsubscribe_token}`));
      }
    } catch (err) {
      console.error('welcome email failed:', err instanceof Error ? err.message : 'unknown error');
    }
    return back('ok');
  }
  return back(outcome === 'already' ? 'already' : 'invalid');
}

