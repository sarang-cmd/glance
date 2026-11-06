import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'fs';
import { join } from 'path';
import { newDb } from 'pg-mem';
import type { Queryable } from '../src/lib/db';
import { requestSignup, confirmSignup, unsubscribe } from '../src/lib/release-store';
import { confirmationEmail, welcomeEmail, type OutgoingEmail } from '../src/lib/email';
import { releaseListSchema, emailSchema } from '../src/lib/validation';
import { rateLimit, __resetRateLimits } from '../src/lib/rate-limit';

function makeDb(): Queryable {
  const db = newDb();
  db.public.none(readFileSync(join(__dirname, '..', 'db', 'schema.sql'), 'utf8'));
  const pg = db.adapters.createPg();
  const pool = new pg.Pool();
  return {
    async query(text: string, params: unknown[]) {
      const result = await pool.query(text, params);
      return { rows: result.rows as Record<string, unknown>[], rowCount: result.rowCount as number | null };
    }
  };
}

test('validation: email schema trims, lowercases, rejects garbage', () => {
  assert.equal(emailSchema.parse('  USER@Example.COM '), 'user@example.com');
  assert.throws(() => emailSchema.parse('not-an-email'));
  assert.throws(() => emailSchema.parse('a'.repeat(250) + '@x.co'));
});

test('validation: full payload schema keeps honeypot and applies source default', () => {
  const parsed = releaseListSchema.parse({ email: 'A@B.CO' });
  assert.equal(parsed.email, 'a@b.co');
  assert.equal(parsed.company, '');
  assert.equal(parsed.source, 'site');
});

test('signup then confirm then welcome then unsubscribe, end to end', async () => {
  const db = makeDb();
  const sent: OutgoingEmail[] = [];
  const send = async (e: OutgoingEmail) => { sent.push(e); };

  // 1. signup
  const signup = await requestSignup(db, 'dev@example.com', 'test');
  assert.equal(signup.kind, 'created');
  if (signup.kind !== 'created') return;
  assert.match(signup.confirmToken, /^[a-f0-9]{64}$/);

  // 2. confirmation email is generated with both links
  const confirmUrl = `https://glance-win.vercel.app/release-list/confirm?token=${signup.confirmToken}`;
  const unsubscribeUrl = `https://glance-win.vercel.app/release-list/unsubscribe?token=${signup.unsubscribeToken}`;
  await send(confirmationEmail('dev@example.com', confirmUrl, unsubscribeUrl));
  assert.equal(sent.length, 1);
  assert.match(sent[0].html, /Confirm my address/);
  assert.match(sent[0].text, new RegExp(signup.confirmToken));
  assert.match(sent[0].text, new RegExp(signup.unsubscribeToken));
  assert.match(sent[0].subject, /Confirm/);

  // 3. confirm via the emailed token
  assert.equal(await confirmSignup(db, signup.confirmToken), 'confirmed');
  assert.equal(await confirmSignup(db, signup.confirmToken), 'already');

  // 4. welcome email
  await send(welcomeEmail('dev@example.com', unsubscribeUrl));
  assert.equal(sent.length, 2);
  assert.match(sent[1].text, /github.com\/sarang-cmd\/glance/);

  // 5. one-click unsubscribe
  assert.equal(await unsubscribe(db, signup.unsubscribeToken), 'unsubscribed');
  assert.equal(await unsubscribe(db, signup.unsubscribeToken), 'already');
});

test('re-requesting a pending signup rotates the tokens', async () => {
  const db = makeDb();
  const first = await requestSignup(db, 'dev@example.com', 'test');
  const second = await requestSignup(db, 'dev@example.com', 'test');
  assert.equal(second.kind, 'refreshed');
  if (first.kind === 'created' && second.kind === 'refreshed') {
    assert.notEqual(first.confirmToken, second.confirmToken);
    assert.equal(await confirmSignup(db, first.confirmToken), 'invalid');
    assert.equal(await confirmSignup(db, second.confirmToken), 'confirmed');
  } else {
    assert.fail('unexpected kinds');
  }
});

test('confirmed addresses are not touched and are reported as already-confirmed', async () => {
  const db = makeDb();
  const first = await requestSignup(db, 'dev@example.com', 'test');
  if (first.kind !== 'created') assert.fail('expected created');
  await confirmSignup(db, first.confirmToken);
  const again = await requestSignup(db, 'dev@example.com', 'test');
  assert.equal(again.kind, 'already-confirmed');
  // the row remains confirmed; no new pending row was written
  const { rows } = await db.query(`SELECT status FROM release_list WHERE email = $1`, ['dev@example.com']);
  assert.equal((rows[0] as { status: string }).status, 'confirmed');
});

test('explicit re-join after unsubscribe returns to pending', async () => {
  const db = makeDb();
  const first = await requestSignup(db, 'dev@example.com', 'test');
  if (first.kind !== 'created') assert.fail('expected created');
  await unsubscribe(db, first.unsubscribeToken);
  const rejoin = await requestSignup(db, 'dev@example.com', 'test');
  assert.equal(rejoin.kind, 'refreshed');
  if (rejoin.kind === 'refreshed') {
    assert.equal(await confirmSignup(db, rejoin.confirmToken), 'confirmed');
  }
});

test('confirm and unsubscribe reject unknown tokens', async () => {
  const db = makeDb();
  assert.equal(await confirmSignup(db, 'f'.repeat(64)), 'invalid');
  assert.equal(await unsubscribe(db, 'e'.repeat(64)), 'invalid');
});

test('rate limiter allows 5 per window then refuses, and recovers after reset', () => {
  __resetRateLimits();
  const now = Date.UTC(2026, 10, 6, 12, 0, 0);
  for (let i = 0; i < 5; i++) assert.equal(rateLimit('1.2.3.4', now).ok, true);
  const sixth = rateLimit('1.2.3.4', now);
  assert.equal(sixth.ok, false);
  // a different key is unaffected
  assert.equal(rateLimit('5.6.7.8', now).ok, true);
  // outside the window, allowed again
  const later = now + 11 * 60 * 1000;
  assert.equal(rateLimit('1.2.3.4', later).ok, true);
  __resetRateLimits();
});

test('email templates carry unsubscribe link and no tracking pixel', () => {
  const confirm = confirmationEmail('a@b.co', 'https://example.com/confirm?token=t1', 'https://example.com/unsubscribe?token=t2');
  assert.match(confirm.html, /t2/);
  assert.doesNotMatch(confirm.html, /<img/i);
  const welcome = welcomeEmail('a@b.co', 'https://example.com/unsubscribe?token=t3');
  assert.match(welcome.html, /t3/);
  assert.doesNotMatch(welcome.html, /<img/i);
});
