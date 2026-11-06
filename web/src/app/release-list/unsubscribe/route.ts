import { NextRequest, NextResponse } from 'next/server';
import { getQueryable, DatabaseNotConfigured } from '@/lib/db';
import { unsubscribe } from '@/lib/release-store';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TOKEN = /^[a-f0-9]{64}$/;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? '';
  const back = (state: string) => NextResponse.redirect(new URL(`/release-list/unsubscribed?state=${state}`, site.url), 303);

  if (!TOKEN.test(token)) return back('invalid');

  let db;
  try {
    db = getQueryable();
  } catch (err) {
    if (err instanceof DatabaseNotConfigured) return back('error');
    throw err;
  }

  try {
    const outcome = await unsubscribe(db, token);
    return back(outcome === 'already' ? 'already' : outcome);
  } catch (err) {
    console.error('unsubscribe failed:', err instanceof Error ? err.message : 'unknown error');
    return back('error');
  }
}
