import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { createReleaseStore, type Sql } from "../lib/release-store";
import { createReleaseService } from "../lib/release-service";
import { emailContent, type sendEmail } from "../lib/email";
import { hash, newToken } from "../lib/release";

let database: PGlite;
const sql: Sql = async (strings, ...values) => {
  const query = strings.reduce(
    (text, part, index) => text + (index ? `$${index}` : "") + part,
    "",
  );
  return (await database.query<Record<string, unknown>>(query, values)).rows;
};
const store = createReleaseStore(sql);
const secret = "a".repeat(64);
const site = "https://glance-win.vercel.app";
let sent: Parameters<typeof sendEmail>[] = [];
const send: typeof sendEmail = async (...args) => {
  sent.push(args);
};
const service = createReleaseService(store, send, site, secret);
const tokenFrom = (url: string) => new URL(url).searchParams.get("token")!;

before(async () => {
  database = new PGlite();
  await database.exec(
    await readFile(new URL("../schema.sql", import.meta.url), "utf8"),
  );
});
after(async () => {
  await database.close();
});
beforeEach(async () => {
  await database.exec("TRUNCATE release_subscribers, release_rate_limits");
  sent = [];
});

test("production service SQL: signup, email links, confirm, welcome, unsubscribe and rejoin", async () => {
  assert.equal((await service.signup("dev@example.com", "test-ip")).kind, "ok");
  assert.equal(sent.length, 1);
  const confirmation = sent[0];
  const token = tokenFrom(confirmation[2]);
  const unsubscribe = tokenFrom(confirmation[3]);
  const rows = await sql`SELECT * FROM release_subscribers`;
  assert.equal(rows[0].status, "pending");
  assert.equal(rows[0].confirmation_hash, hash(token));
  assert.equal(rows[0].unsubscribe_hash, hash(unsubscribe));
  assert.equal(rows[0].consent_version, "release-list-v1");
  assert.equal(
    JSON.stringify(rows).includes(token),
    false,
    "raw token never stored",
  );
  assert.ok(
    emailContent("confirm", confirmation[2], confirmation[3]).text.includes(
      token,
    ),
  );
  // Simply generating or reading the email link has not confirmed the row.
  assert.equal((await service.confirm(token)).kind, "confirmed");
  assert.equal(sent.length, 2);
  assert.equal(sent[1][1], "welcome");
  const confirmed =
    await sql`SELECT status,confirmed_at,welcome_sent_at FROM release_subscribers`;
  assert.equal(confirmed[0].status, "subscribed");
  assert.ok(confirmed[0].confirmed_at);
  assert.ok(confirmed[0].welcome_sent_at);
  assert.equal((await service.confirm(token)).kind, "already");
  assert.equal(sent.length, 2);
  await service.signup("dev@example.com", "another-ip");
  assert.equal(sent.length, 2, "confirmed address not emailed again");
  await service.unsubscribe(unsubscribe);
  await service.unsubscribe(unsubscribe);
  assert.equal((await sql`SELECT * FROM release_subscribers`).length, 0);
  await service.signup("dev@example.com", "third-ip");
  assert.equal(sent.length, 3);
  const fresh = tokenFrom(sent[2][2]);
  assert.notEqual(fresh, token);
  assert.equal((await service.confirm(token)).kind, "invalid");
  assert.equal((await service.confirm(fresh)).kind, "confirmed");
  await service.unsubscribe(unsubscribe);
  assert.equal(
    (await sql`SELECT * FROM release_subscribers`).length,
    1,
    "old unsubscribe token cannot remove new signup",
  );
});

test("pending resend respects cooldown then rotates only confirmation token", async () => {
  await service.signup("dev@example.com", "ip");
  const first = sent[0];
  await service.signup("dev@example.com", "ip");
  assert.equal(sent.length, 1);
  await sql`UPDATE release_subscribers SET requested_at=now()-interval '6 minutes'`;
  await service.signup("dev@example.com", "ip");
  assert.equal(sent.length, 2);
  assert.notEqual(first[2], sent[1][2]);
  assert.equal(first[3], sent[1][3]);
  assert.equal((await service.confirm(tokenFrom(first[2]))).kind, "invalid");
  assert.equal(
    (await service.confirm(tokenFrom(sent[1][2]))).kind,
    "confirmed",
  );
});

test("expired and unknown confirmation tokens leave subscriber pending", async () => {
  await service.signup("dev@example.com", "ip");
  await sql`UPDATE release_subscribers SET confirmation_expires=now()-interval '1 second'`;
  assert.equal((await service.confirm(tokenFrom(sent[0][2]))).kind, "invalid");
  assert.equal((await service.confirm(newToken())).kind, "invalid");
  assert.equal(
    (await sql`SELECT status FROM release_subscribers`)[0].status,
    "pending",
  );
  assert.equal(sent.length, 1);
});

test("database limits are shared between store instances and atomic under concurrent requests", async () => {
  const second = createReleaseStore(sql);
  const results = await Promise.all(
    Array.from({ length: 12 }, (_, i) =>
      (i % 2 ? store : second).rateLimit("same-client", 5),
    ),
  );
  assert.equal(results.filter(Boolean).length, 5);
  assert.equal(
    Number((await sql`SELECT hits FROM release_rate_limits`)[0].hits),
    12,
  );
  assert.equal(await second.rateLimit("different-client"), true);
});

test("email limit applies across IP addresses and stores HMAC keys only", async () => {
  for (let i = 0; i < 3; i++)
    assert.equal(
      (await service.signup("dev@example.com", `client-${i}`)).kind,
      "ok",
    );
  assert.equal(
    (await service.signup("dev@example.com", "client-4")).kind,
    "limited",
  );
  const rows = await sql`SELECT key FROM release_rate_limits`;
  assert.equal(JSON.stringify(rows).includes("dev@example.com"), false);
  assert.equal(JSON.stringify(rows).includes("client-"), false);
});

test("IP limits apply across email addresses", async () => {
  for (let i = 0; i < 5; i++)
    assert.equal(
      (await service.signup(`dev${i}@example.com`, "same-ip")).kind,
      "ok",
    );
  assert.equal(
    (await service.signup("dev6@example.com", "same-ip")).kind,
    "limited",
  );
  assert.equal(sent.length, 5);
});

test("hourly limits reset and stale counters are cleaned", async () => {
  await store.rateLimit("client", 1);
  assert.equal(await store.rateLimit("client", 1), false);
  await sql`UPDATE release_rate_limits SET window_start=date_trunc('hour',now())-interval '2 days'`;
  assert.equal(await store.rateLimit("client", 1), true);
  await store.cleanRateLimits();
  assert.equal((await sql`SELECT * FROM release_rate_limits`).length, 1);
});

test("concurrent signup and confirmation produce one subscriber and one welcome", async () => {
  const requests = await Promise.all(
    Array.from({ length: 8 }, () =>
      store.requestSignup("dev@example.com", secret),
    ),
  );
  assert.equal(requests.filter(Boolean).length, 1);
  assert.equal((await sql`SELECT * FROM release_subscribers`).length, 1);
  const token = requests.find(Boolean)!.token;
  const results = await Promise.all(
    Array.from({ length: 8 }, () => service.confirm(token)),
  );
  assert.equal(results.filter((r) => r.kind === "confirmed").length, 1);
  assert.equal(sent.length, 1);
  assert.equal(sent[0][1], "welcome");
});

test("confirmation email failures reject while retaining a recoverable pending signup", async () => {
  const failing = createReleaseService(
    store,
    async () => {
      throw new Error("test delivery failure");
    },
    site,
    secret,
  );
  await assert.rejects(
    () => failing.signup("dev@example.com", "ip"),
    /test delivery failure/,
  );
  assert.equal(
    (await sql`SELECT status FROM release_subscribers`)[0].status,
    "pending",
  );
  await sql`UPDATE release_subscribers SET requested_at=now()-interval '6 minutes'`;
  await service.signup("dev@example.com", "ip");
  assert.equal(sent.length, 1);
});

test("welcome failure preserves confirmation and does not send duplicates on retry", async () => {
  await service.signup("dev@example.com", "ip");
  const failing = createReleaseService(
    store,
    async () => {
      throw new Error("test welcome failure");
    },
    site,
    secret,
  );
  const result = await failing.confirm(tokenFrom(sent[0][2]));
  assert.equal(result.kind, "confirmed");
  assert.ok("notice" in result);
  const rows =
    await sql`SELECT status,welcome_sent_at FROM release_subscribers`;
  assert.equal(rows[0].status, "subscribed");
  assert.equal(rows[0].welcome_sent_at, null);
  assert.equal((await service.confirm(tokenFrom(sent[0][2]))).kind, "already");
  assert.equal(sent.length, 1);
});

test("bound SQL treats hostile text as data and unknown unsubscribe tokens cannot remove rows", async () => {
  const email = "dev'); DROP TABLE release_subscribers; --@example.com";
  await store.requestSignup(email, secret);
  assert.equal(
    (await sql`SELECT email FROM release_subscribers`)[0].email,
    email,
  );
  await store.unsubscribe(newToken());
  assert.equal((await sql`SELECT * FROM release_subscribers`).length, 1);
});
