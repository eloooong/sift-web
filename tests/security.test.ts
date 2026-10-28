import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test, { before } from "node:test";
import { hashPassword, verifyPassword } from "../src/lib/auth/passwords";
import { readJsonBody, requestSameOrigin } from "../src/lib/http/guards";
import { postgresTlsOptions } from "../src/lib/db/connection.mjs";
import { levelFromScore } from "../src/lib/scam-detector/scoring";

// These tests use isolated in-memory stores, never a developer's database.
let auth: typeof import("../src/lib/auth/store");
let history: typeof import("../src/lib/history/store");
let reports: typeof import("../src/lib/reports/store");
let rateLimit: (typeof import("../src/lib/reports/rate-limit"))["rateLimit"];
before(async () => {
  delete process.env.DATABASE_URL;
  auth = await import("../src/lib/auth/store");
  history = await import("../src/lib/history/store");
  reports = await import("../src/lib/reports/store");
  ({ rateLimit } = await import("../src/lib/reports/rate-limit"));
});

test("community reports start empty and pending submissions stay private until approved", async () => {
  assert.deepEqual(await reports.listApprovedReports(), []);
  assert.deepEqual(await reports.listPendingReports(), []);
  assert.deepEqual(await reports.getMeta(), {
    approvedCount: 0,
    awaitingReview: 0,
    totalConfirmations: 0,
  });
  const report = await reports.createReport({
    categoryId: "prize-scam",
    platform: "sms",
    description: "Test submission awaiting a moderator's review.",
    sender: null,
    screenshot: null,
    encounteredAt: "2026-01-01",
    riskScore: 89,
    status: "pending",
  });
  assert.equal(report.confirmations, 0);
  assert.equal(await reports.getApprovedReport(report.id), null);
  assert.deepEqual(await reports.listApprovedReports(), []);
  assert.equal((await reports.listPendingReports()).length, 1);
  assert.equal(await reports.moderateReport(report.id, "approved"), true);
  assert.equal((await reports.getApprovedReport(report.id))?.id, report.id);
  assert.equal((await reports.listApprovedReports()).length, 1);
  assert.equal((await reports.listPendingReports()).length, 0);
});

test("password hashes use unique salts and verify only the matching password", async () => {
  const first = await hashPassword("correct-password");
  const second = await hashPassword("correct-password");
  assert.notEqual(first, second);
  assert.match(first, /^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/);
  assert.equal(await verifyPassword("correct-password", first), true);
  assert.equal(await verifyPassword("wrong-password", first), false);
});

test("malformed password hashes fail closed", async () => {
  const valid = await hashPassword("correct-password");
  const [format, salt, hash] = valid.split(":");
  for (const value of [
    "",
    "scrypt:zz:zz",
    "scrypt:00:00",
    "scrypt::",
    "unknown:" + salt + ":" + hash,
    format + ":" + salt + ":" + hash.slice(2),
    valid + ":extra",
    format + ":" + salt.slice(2) + ":" + hash,
  ]) {
    assert.equal(await verifyPassword("any-password", value), false, value);
  }
});

test("session revocation removes all sessions for one user without affecting another", async () => {
  const passwordHash = await hashPassword("test-password");
  const first = await auth.createUser({
    email: randomUUID() + "@example.test",
    displayName: "First",
    passwordHash,
  });
  const second = await auth.createUser({
    email: randomUUID() + "@example.test",
    displayName: "Second",
    passwordHash,
  });
  const a = await auth.createSession(first.id);
  const b = await auth.createSession(first.id);
  const c = await auth.createSession(second.id);
  assert.equal((await auth.getSessionUser(a.token))?.id, first.id);
  assert.equal(await auth.getSessionUser("not-a-session"), null);
  await auth.destroyAllSessionsForUser(first.id);
  assert.equal(await auth.getSessionUser(a.token), null);
  assert.equal(await auth.getSessionUser(b.token), null);
  assert.equal((await auth.getSessionUser(c.token))?.id, second.id);
  assert.equal("passwordHash" in auth.toPublicUser(first), false);
  await auth.destroySession(c.token);
  assert.equal(await auth.getSessionUser(c.token), null);
});

test("history reads and deletes are scoped to the signed-in owner", async () => {
  const owner = randomUUID();
  const other = randomUUID();
  const entry = await history.recordScan({
    userId: owner,
    scanType: "message",
    rawInput: "A private test message",
    status: "failed",
  });
  assert.equal(
    (await history.getUserHistoryEntry(owner, entry.id))?.fullInput,
    "A private test message",
  );
  assert.equal(await history.getUserHistoryEntry(other, entry.id), null);
  assert.equal((await history.listUserHistory(other)).length, 0);
  assert.equal(await history.deleteUserHistoryEntry(other, entry.id), false);
  assert.notEqual(await history.getUserHistoryEntry(owner, entry.id), null);
  assert.equal(await history.deleteAllUserHistory(other), 0);
  assert.equal(await history.deleteUserHistoryEntry(owner, entry.id), true);
  assert.equal(await history.getUserHistoryEntry(owner, entry.id), null);
});

test("JSON size limits count UTF-8 bytes rather than characters or declared size", async () => {
  const body = JSON.stringify({ message: "界".repeat(20) });
  const request = new Request("https://sift.test/api", {
    method: "POST",
    headers: { "content-length": "1" },
    body,
  });
  assert.deepEqual(await readJsonBody(request, 50), {
    ok: false,
    reason: "too_large",
  });
  const valid = new Request("https://sift.test/api", {
    method: "POST",
    body: '{"message":"hello"}',
  });
  assert.deepEqual(await readJsonBody(valid, 50), {
    ok: true,
    body: { message: "hello" },
  });
  const invalid = new Request("https://sift.test/api", {
    method: "POST",
    body: "{invalid",
  });
  assert.deepEqual(await readJsonBody(invalid), {
    ok: false,
    reason: "unreadable",
  });
});

test("cross-origin and malformed-origin writes are rejected", () => {
  const request = (origin: string, host = "sift.test") =>
    new Request("https://sift.test/api", {
      method: "POST",
      headers: { host, origin },
    });
  assert.equal(requestSameOrigin(request("https://sift.test")), true);
  assert.equal(requestSameOrigin(request("https://evil.test")), false);
  assert.equal(requestSameOrigin(request("https://sift.test:444")), false);
  assert.equal(requestSameOrigin(request("not-an-origin")), false);
  assert.equal(
    requestSameOrigin(new Request("https://sift.test/api", { method: "POST" })),
    true,
  );
});

test("rate limits reject excess requests and keep independent clients separate", async () => {
  const key = randomUUID();
  assert.deepEqual(await rateLimit(key, 2, 60000), {
    ok: true,
    remaining: 1,
    retryAfterSeconds: 0,
  });
  assert.deepEqual(await rateLimit(key, 2, 60000), {
    ok: true,
    remaining: 0,
    retryAfterSeconds: 0,
  });
  const denied = await rateLimit(key, 2, 60000);
  assert.equal(denied.ok, false);
  assert.ok(denied.retryAfterSeconds > 0);
  assert.equal((await rateLimit(randomUUID(), 2, 60000)).ok, true);
});

test("risk labels change at the same thresholds used by the meter", () => {
  for (const [score, expected] of [
    [0, "low"],
    [29, "low"],
    [30, "medium"],
    [59, "medium"],
    [60, "high"],
    [79, "high"],
    [80, "critical"],
    [89, "critical"],
    [100, "critical"],
  ] as const) {
    assert.equal(levelFromScore(score), expected, String(score));
  }
});

test("PostgreSQL TLS defaults use the hostname, not credentials or substrings", () => {
  const verified = { ssl: { rejectUnauthorized: true } };
  assert.deepEqual(
    postgresTlsOptions("postgres://user:pass@db.example.test/sift"),
    verified,
  );
  assert.deepEqual(
    postgresTlsOptions("postgres://user:localhost@db.example.test/sift"),
    verified,
  );
  assert.deepEqual(
    postgresTlsOptions("postgres://user:pass@localhost.evil.test/sift"),
    verified,
  );
  assert.deepEqual(
    postgresTlsOptions("postgres://user:pass@localhost/sift"),
    {},
  );
  assert.deepEqual(postgresTlsOptions("postgres://user:pass@[::1]/sift"), {});
  assert.deepEqual(
    postgresTlsOptions(
      "postgres://user:pass@db.example.test/sift?sslmode=verify-full",
    ),
    {},
  );
});

test("PostgreSQL accepts a supplied CA while preserving certificate verification", () => {
  const ca = "-----BEGIN CERTIFICATE-----\nprovider-root\n-----END CERTIFICATE-----";
  assert.deepEqual(
    postgresTlsOptions("postgres://user:pass@db.example.test/sift", ca),
    { ssl: { rejectUnauthorized: true, ca } },
  );
  assert.deepEqual(
    postgresTlsOptions("postgres://user:pass@localhost/sift", ca),
    {},
  );
  assert.deepEqual(
    postgresTlsOptions("postgres://user:pass@db.example.test/sift?sslmode=verify-full", ca),
    {},
  );
});
