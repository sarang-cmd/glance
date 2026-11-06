import { randomBytes } from 'crypto';
import type { Queryable } from './db';

export type RequestSignupResult =
  | { kind: 'created'; confirmToken: string; unsubscribeToken: string }
  | { kind: 'refreshed'; confirmToken: string; unsubscribeToken: string }
  | { kind: 'already-confirmed' };

export type ConfirmResult = 'confirmed' | 'already' | 'invalid';
export type UnsubscribeResult = 'unsubscribed' | 'already' | 'invalid';

const newToken = () => randomBytes(32).toString('hex');

/**
 * Register (or re-register) a pending signup and return fresh tokens.
 *
 * Behavior per starting state:
 *  - no row: insert a pending signup.
 *  - pending: refresh both tokens so only the newest email link works.
 *  - unsubscribed: explicit re-join, back to pending with fresh tokens.
 *  - confirmed: untouched. The caller still answers with a generic message,
 *    so the endpoint never reveals whether an address is on the list.
 */
function isUniqueViolation(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const code = (err as { code?: string }).code;
  const message = (err as { message?: string }).message ?? '';
  return code === '23505' || /duplicate key/i.test(message);
}

export async function requestSignup(db: Queryable, email: string, source: string): Promise<RequestSignupResult> {
  const existing = await db.query(`SELECT status FROM release_list WHERE email = $1`, [email]);

  if (existing.rows.length === 0) {
    const confirmToken = newToken();
    const unsubscribeToken = newToken();
    try {
      await db.query(
        `INSERT INTO release_list (email, status, confirm_token, unsubscribe_token, source)
         VALUES ($1, 'pending', $2, $3, $4)`,
        [email, confirmToken, unsubscribeToken, source]
      );
      return { kind: 'created', confirmToken, unsubscribeToken };
    } catch (err) {
      // Concurrent signup for the same address: fall through to the rotate path.
      if (!isUniqueViolation(err)) throw err;
    }
  } else if ((existing.rows[0] as { status: string }).status === 'confirmed') {
    return { kind: 'already-confirmed' };
  }

  const rotated = await db.query(
    `UPDATE release_list
       SET status = 'pending', confirm_token = $2, unsubscribe_token = $3, updated_at = now()
     WHERE email = $1 AND status <> 'confirmed'
     RETURNING confirm_token, unsubscribe_token`,
    [email, newToken(), newToken()]
  );
  if (rotated.rows.length > 0) {
    const row = rotated.rows[0] as { confirm_token: string; unsubscribe_token: string };
    return { kind: 'refreshed', confirmToken: row.confirm_token, unsubscribeToken: row.unsubscribe_token };
  }

  return { kind: 'already-confirmed' };
}

export async function confirmSignup(db: Queryable, token: string): Promise<ConfirmResult> {
  const updated = await db.query(
    `UPDATE release_list
       SET status = 'confirmed', confirmed_at = now(), updated_at = now()
     WHERE confirm_token = $1 AND status = 'pending'`,
    [token]
  );
  if (updated.rowCount && updated.rowCount > 0) return 'confirmed';

  const { rows } = await db.query(`SELECT status FROM release_list WHERE confirm_token = $1`, [token]);
  if (rows.length === 0) return 'invalid';
  return 'already';
}

export async function unsubscribe(db: Queryable, token: string): Promise<UnsubscribeResult> {
  const updated = await db.query(
    `UPDATE release_list
       SET status = 'unsubscribed', unsubscribed_at = now(), updated_at = now()
     WHERE unsubscribe_token = $1 AND status <> 'unsubscribed'`,
    [token]
  );
  if (updated.rowCount && updated.rowCount > 0) return 'unsubscribed';

  const { rows } = await db.query(`SELECT status FROM release_list WHERE unsubscribe_token = $1`, [token]);
  if (rows.length === 0) return 'invalid';
  return 'already';
}
