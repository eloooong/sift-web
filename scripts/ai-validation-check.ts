import {
  extractJsonObject,
  normalizeCategory,
  parseAiAnalysis,
  ValidationError,
} from "../src/lib/ai/schemas";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`  ✓ ${message}`);
  }
}

function expectValidationError(fn: () => unknown, message: string) {
  try {
    fn();
    assert(false, message);
  } catch (error) {
    assert(
      error instanceof ValidationError,
      `${message} (threw ValidationError)`,
    );
  }
}

const VALID_PAYLOAD = {
  riskScore: 130,
  riskLevel: "CRITICAL",
  category: "PRIZE_SCAM",
  confidence: 94,
  summary: "This message shows classic prize-scam markers.",
  redFlags: [
    {
      title: "Unsolicited prize claim",
      evidence: "You won P750,000",
      explanation:
        "Real raffles never contact winners by text from unknown numbers.",
    },
    { title: "x", evidence: "", explanation: "too short" },
    "not-an-object",
  ],
  recommendations: [
    "Do not reply or click any link.",
    "",
    "Verify through the official PCSO channels.",
  ],
};

console.log("=== parseAiAnalysis ===\n");

const parsed = parseAiAnalysis(VALID_PAYLOAD);
assert(parsed.riskScore === 100, "riskScore clamped to 100");
assert(parsed.category === "Prize Scam", "PRIZE_SCAM normalized to Prize Scam");
assert(parsed.confidence === 0.94, "percent confidence converted to 0–1");
assert(parsed.redFlags.length === 1, "malformed red flags dropped");
assert(
  parsed.recommendations.length === 2,
  "empty recommendation strings dropped",
);

expectValidationError(() => parseAiAnalysis(null), "null payload rejected");
expectValidationError(
  () => parseAiAnalysis("not an object"),
  "string payload rejected",
);
expectValidationError(
  () => parseAiAnalysis({ ...VALID_PAYLOAD, confidence: "high" }),
  "non-numeric confidence rejected",
);
expectValidationError(
  () => parseAiAnalysis({ ...VALID_PAYLOAD, recommendations: [] }),
  "no usable recommendations rejected",
);
expectValidationError(
  () => parseAiAnalysis({ ...VALID_PAYLOAD, redFlags: "none" }),
  "non-array redFlags rejected",
);
expectValidationError(
  () => parseAiAnalysis({ ...VALID_PAYLOAD, summary: "   " }),
  "blank summary rejected",
);

console.log("\n=== Clamping & sanitization ===\n");

const clamped = parseAiAnalysis({
  ...VALID_PAYLOAD,
  riskScore: -5,
  confidence: 0.4,
});
assert(clamped.riskScore === 0, "negative riskScore clamped to 0");
assert(clamped.confidence === 0.4, "0–1 confidence preserved");

const longSummary = "A".repeat(2000);
const truncated = parseAiAnalysis({
  ...VALID_PAYLOAD,
  summary: longSummary,
});
assert(
  truncated.summary.length === 1500,
  `overlong summary truncated to 1500 (got ${truncated.summary.length})`,
);

const withControlChars = parseAiAnalysis({
  ...VALID_PAYLOAD,
  summary: "Bad\u0007summary\u000Bwith control chars",
});
assert(
  !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(withControlChars.summary),
  "control characters stripped from strings",
);

console.log("\n=== normalizeCategory ===\n");
assert(
  normalizeCategory("account_verification_scam") ===
    "Account Verification Scam",
  "snake_case alias mapped",
);
assert(normalizeCategory("job scam") === "Job Scam", "plain label mapped");
assert(
  normalizeCategory("weird new category") === "Weird New Category",
  "unknown labels title-cased and passed through",
);
assert(normalizeCategory("") === "Uncertain", "empty category → Uncertain");

console.log("\n=== extractJsonObject ===\n");

const fenced = 'Here is my analysis:\n```json\n{"riskScore": 42}\n```\nDone.';
const extracted = extractJsonObject(fenced);
assert(extracted.riskScore === 42, "markdown-fenced JSON extracted cleanly");

expectValidationError(
  () => extractJsonObject("Sorry, I cannot help with that."),
  "prose-only response rejected",
);
expectValidationError(
  () => extractJsonObject('{"broken": tru'),
  "malformed JSON rejected",
);
expectValidationError(
  () => extractJsonObject("[1, 2, 3]"),
  "top-level array rejected",
);

if (process.exitCode) {
  console.error("\n✗ AI validation checks FAILED");
} else {
  console.log("\n✓ All AI validation checks passed");
}
