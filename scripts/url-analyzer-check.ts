/**
 * Phase 7 sanity checks for the URL security scanner (pure logic only —
 * no network). Run with:
 *   npx tsx scripts/url-analyzer-check.ts
 */
import {
  parseUrl,
  editDistance,
} from "../src/lib/url-analyzer/parser";
import { detectSignals } from "../src/lib/url-analyzer/signals";
import { scoreUrlSignals } from "../src/lib/url-analyzer/scoring";
import { getReputationProvider } from "../src/lib/url-analyzer/reputation";
import { analyzeUrl } from "../src/lib/url-analyzer";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.log(`  ✗ FAIL: ${message}`);
  }
}

function section(title: string) {
  console.log(`\n=== ${title} ===\n`);
}

function signalsFor(url: string) {
  const parsed = parseUrl(url);
  if (!parsed.ok) throw new Error(`fixture failed to parse: ${url}`);
  return detectSignals({ parts: parsed.parts, fullUrl: parsed.url.toString() });
}

async function main() {
section("URL parsing");

const gcash = parseUrl("https://secure.gcash-login.verify-account.top/user/login?next=/wallet");
assert(gcash.ok && gcash.parts.protocol === "https", "protocol extracted");
assert(
  gcash.ok && gcash.parts.hostname === "secure.gcash-login.verify-account.top",
  "hostname extracted"
);
assert(
  gcash.ok && gcash.parts.domain === "verify-account.top",
  "registrable domain isolated from subdomains"
);
assert(
  gcash.ok && gcash.parts.subdomains.join(",") === "secure,gcash-login",
  "subdomain chain listed"
);
assert(gcash.ok && gcash.parts.queryParams[0]?.name === "next", "query params parsed");

const sss = parseUrl("https://sss.gov.ph/member");
assert(sss.ok && sss.parts.domain === "sss.gov.ph", "gov.ph two-level suffix handled");

const noScheme = parseUrl("gcash-login.xyz/pay");
assert(noScheme.ok && noScheme.parts.protocol === "https", "missing scheme defaults to https for analysis");

assert(editDistance("gc4sh", "gcash") <= 2, "edit distance spots typosquats");
assert(editDistance("completely-different", "gcash") === Infinity, "distant hosts skipped");

section("Signal detection");

const fakeLogin = signalsFor("http://secure-gcash-login.verify-account.top/user/login?next=https://evil.example");
{
  const ids = fakeLogin.signals.map((s) => s.id);
  assert(ids.includes("insecure-transport"), "HTTP flagged");
  assert(ids.includes("brand-lookalike"), "GCash lookalike flagged");
  assert(ids.includes("suspicious-keywords"), "phishing keywords flagged");
  assert(ids.includes("suspicious-tld"), ".top TLD noted");
  assert(ids.includes("risky-query-params"), "redirect param flagged");
  assert(fakeLogin.impersonation?.brandLabel === "GCash", "impersonation target = GCash");
}

const shortener = signalsFor("https://bit.ly/3pHxQz9");
assert(
  shortener.signals.some((s) => s.id === "shortened-url"),
  "bit.ly flagged as shortener"
);

const official = signalsFor("https://www.gcash.com/");
assert(
  official.signals.some((s) => s.id === "known-official-domain") &&
    !official.signals.some((s) => s.id === "brand-lookalike"),
  "official brand domain gets positive signal, not lookalike"
);

const encoded = signalsFor("https://example.com/%2E%2E%2F%2E%2E%2Fadmin%2Fx?a=%31%32%33");
assert(
  encoded.signals.some((s) => s.id === "encoded-content"),
  "heavy percent-encoding flagged"
);

const ipHost = signalsFor("http://192.168.1.44/admin");
assert(ipHost.signals.some((s) => s.id === "ip-literal-host"), "bare IP host flagged");

const creds = signalsFor("https://gcash.com@gc4sh.top/login");
assert(
  creds.signals.some((s) => s.id === "embedded-credentials"),
  "@-credential trick flagged"
);

section("Scoring guardrails");

const weakOnly = scoreUrlSignals([
  { id: "shortened-url", label: "x", severity: "medium", weight: 18, explanation: "" },
]);
assert(weakOnly.riskScore <= 39, "single medium signal cannot exceed suspicious band");
assert(weakOnly.verdict !== "dangerous", "weak-only verdict is never dangerous");

const strongMix = scoreUrlSignals([
  { id: "brand-lookalike", label: "x", severity: "high", weight: 30, explanation: "" },
  { id: "insecure-transport", label: "y", severity: "medium", weight: 14, explanation: "" },
]);
assert(strongMix.riskScore > 39, "strong + supporting signals push past suspicious band");

const cleanish = scoreUrlSignals([
  { id: "known-official-domain", label: "z", severity: "info", weight: -12, explanation: "" },
]);
assert(cleanish.riskScore === 0, "negative signals clamp the score at zero");

const cautionOnly = scoreUrlSignals([
  { id: "suspicious-tld", label: "t", severity: "low", weight: 10, explanation: "" },
]);
assert(cautionOnly.verdict === "caution", "single weak signal → caution verdict");

assert(scoreUrlSignals([]).verdict === "no-signals", "no signals → no-signals verdict");

section("Orchestrator (no reputation configured)");

process.env.GOOGLE_SAFE_BROWSING_API_KEY = "";
delete process.env.GOOGLE_SAFE_BROWSING_API_KEY;
assert(getReputationProvider() === null, "reputation provider absent without key");

const blocked = await analyzeUrl("javascript:alert(1)");
assert(blocked.verdict === "blocked", "non-web scheme produces blocked report");
assert(blocked.parseable === false, "blocked report marked unparseable");

const deliveryReport = await analyzeUrl(
  "https://lbc-express-redelivery.delivery-fee-ph.xyz/pay?redirect=https%3A%2F%2Fpay-lbc.top&id=JT2639845710"
);
assert(deliveryReport.parseable && deliveryReport.riskScore >= 40, `fake delivery URL scores high (${deliveryReport.riskScore})`);
assert(deliveryReport.impersonation?.brandLabel === "LBC Express", "LBC impersonation detected");
assert(deliveryReport.recommendedActions.length >= 3, "actions provided");

console.log(
  `\n${failed === 0 ? "✓ All URL analyzer checks passed" : `✗ ${failed} check(s) FAILED`} (${passed} passed)`
);
if (failed > 0) process.exitCode = 1;
}

void main();
