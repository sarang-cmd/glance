import { test } from "node:test";
import assert from "node:assert/strict";
import {
  signupSchema,
  tokenSchema,
  hash,
  newToken,
  unsubscribeToken,
  allowedOrigin,
  ipKey,
} from "../lib/release";
import { emailContent } from "../lib/email";
import { POST as subscribe } from "../app/api/subscribe/route";
import { POST as confirm } from "../app/api/confirm/route";
import { POST as unsubscribe } from "../app/api/unsubscribe/route";
import { NextRequest } from "next/server";
const site = "https://glance-win.vercel.app";
function request(path: string, body: unknown, origin: string = site) {
  return new NextRequest(site + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify(body),
  });
}
test("validates emails and rejects control characters and SQL-shaped invalid input", () => {
  assert.equal(
    signupSchema.parse({ email: "TEST@example.com" }).email,
    "test@example.com",
  );
  for (const email of [
    "bad",
    "a\r\nBcc: x@example.com",
    "x'); DROP TABLE subscribers;--",
    "x".repeat(255) + "@example.com",
  ])
    assert.equal(signupSchema.safeParse({ email }).success, false);
});
test("tokens are random, fixed length and stored as hashes", () => {
  const a = newToken();
  assert.equal(tokenSchema.safeParse(a).success, true);
  assert.notEqual(a, newToken());
  assert.notEqual(hash(a), a);
  assert.equal(hash(a).length, 64);
  assert.equal(tokenSchema.safeParse("../secret").success, false);
});
test("unsubscribe tokens are stable per id and secret", () => {
  assert.equal(
    unsubscribeToken("id", "secret"),
    unsubscribeToken("id", "secret"),
  );
  assert.notEqual(
    unsubscribeToken("id", "secret"),
    unsubscribeToken("id2", "secret"),
  );
  assert.notEqual(
    unsubscribeToken("id", "secret"),
    unsubscribeToken("id", "other"),
  );
  assert.notEqual(ipKey("127.0.0.1", "secret"), "127.0.0.1");
});
test("origin checks reject absent, cross-site and suffix lookalikes", () => {
  assert.equal(allowedOrigin(site, site), true);
  for (const o of [null, "null", "https://evil.test", site + ".evil.test"])
    assert.equal(allowedOrigin(o, site), false);
});
test("emails include plain and branded versions and subscription context", () => {
  for (const kind of ["confirm", "welcome"] as const) {
    const email = emailContent(
      kind,
      site + "/confirm?token=123",
      site + "/unsubscribe?token=456",
    );
    assert.ok(email.text.includes("/unsubscribe?token=456"));
    assert.ok(email.html.includes("/unsubscribe?token=456"));
    assert.ok(email.html.includes("Glance"));
  }
  assert.ok(emailContent("confirm", "url", "unsub").text.includes("24 hours"));
});
test("signup endpoint rejects cross-origin and malformed requests", async () => {
  assert.equal(
    (
      await subscribe(
        request(
          "/api/subscribe",
          { email: "test@example.com" },
          "https://evil.test",
        ),
      )
    ).status,
    403,
  );
  assert.equal(
    (await subscribe(request("/api/subscribe", { email: "invalid" }))).status,
    400,
  );
  assert.equal(
    (
      await subscribe(
        request("/api/subscribe", {
          email: "test@example.com",
          website: "x".repeat(2200),
        }),
      )
    ).status,
    413,
  );
});
test("honeypot returns generic success without DB or email", async () => {
  const r = await subscribe(
    request("/api/subscribe", { email: "test@example.com", website: "spam" }),
  );
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { ok: true });
});
test("missing service configuration returns an honest unavailable response", async () => {
  if (process.env.DATABASE_URL) return;
  const r = await subscribe(
    request("/api/subscribe", { email: "test@example.com" }),
  );
  assert.equal(r.status, 503);
  assert.ok((await r.json()).error.includes("not available"));
  assert.equal(
    (await confirm(request("/api/confirm", { token: newToken() }))).status,
    503,
  );
});
test("unsubscribe rejects invalid tokens; valid format needs configured storage", async () => {
  assert.equal(
    (await unsubscribe(request("/api/unsubscribe?token=bad", {}))).status,
    400,
  );
  if (!process.env.DATABASE_URL)
    assert.equal(
      (await unsubscribe(request("/api/unsubscribe?token=" + newToken(), {})))
        .status,
      503,
    );
});

test("streamed JSON is bounded even without Content-Length", async () => {
  const { readJson, RequestBodyError } = await import("../lib/request");
  const request = new Request(site, {
    method: "POST",
    body: JSON.stringify({ data: "x".repeat(5000) }),
  });
  await assert.rejects(
    () => readJson(request, 2048),
    (error: unknown) =>
      error instanceof RequestBodyError && error.status === 413,
  );
  assert.deepEqual(
    await readJson(
      new Request(site, { method: "POST", body: '{"ok":true}' }),
      100,
    ),
    { ok: true },
  );
});
