import { analyzeMessage } from "../src/lib/scam-detector";
import { EXAMPLE_SCAMS } from "../src/lib/examples";

const EXTRA_CASES: Array<{
  name: string;
  text: string;
  expectMinScore?: number;
  expectMaxScore?: number;
  expectCategory?: string;
}> = [
  {
    name: "English prize SMS (classic)",
    text: "CONGRATULATIONS! You won P750,000 in the PCSO Electronic Draw! Claim your prize now, pay P1,200 processing fee via GCash 09691234567. Hurry, offer expires within 24 hours!",
    expectMinScore: 70,
    expectCategory: "Prize Scam",
  },
  {
    name: "Taglish account suspension phishing",
    text: "Kailangan mo magbayad ngayon na para hindi ma-deactivate ang account mo. Magpadala ng pera sa GCash 09171234567 o ma-lock ang wallet mo.",
    expectMinScore: 45,
    expectCategory: "E-wallet Scam",
  },
  {
    name: "English OTP theft attempt",
    text: "This is BDO Security. To unblock your account, send the OTP code we just texted you to 09991234567 immediately. Do not share this with anyone.",
    expectMinScore: 45,
    expectCategory: "Bank Scam",
  },
  {
    name: "Fake job Taglish",
    text: "Kita ka ng P5,000 per day, walang karanasan kailangan! Work from home encoding job lang. Send P250 registration fee via Maya para makuha mo na agad ang first task mo.",
    expectMinScore: 45,
    expectCategory: "Online Job Scam",
  },
  {
    name: "Suspicious brand-mimic link",
    text: "Your Maya account needs attention. Update your billing information here: http://maya-secure-login.xyz/update",
    expectMinScore: 45,
    expectCategory: "E-wallet Scam",
  },
  {
    name: "Government impersonation (SSS)",
    text: "[SSS ADVISORY] Contribution discrepancy detected. Verify your membership within 24 hours at sss-member-revalidate.top or benefits will be SUSPENDED and a case filed against you.",
    expectMinScore: 40,
    expectCategory: "Government Impersonation",
  },
  {
    name: "Government impersonation (NBI penalty link)",
    text: "NBI CLEARANCE: pending penalty on your record. Kailangan mong mag verify ngayon at i-click mo ang link na ito para i-settle: http://nbi-clearance-pay.top",
    expectMinScore: 40,
    expectCategory: "Government Impersonation",
  },
  {
    name: "Unbranded loan release-fee scam",
    text: "Instant Cash Loan APPROVED! Get up to P200,000 no collateral, released in 24hrs! Settle the P1,800 release fee via GCash to receive your loan today.",
    expectMinScore: 40,
    expectCategory: "Loan Scam",
  },
  {
    name: "Investment doubling pitch",
    text: "Boss, last slot for our VIP crypto trading pool! Invest P10,000 and double your money in 30 days, guaranteed 40% return weekly! Mag-invest ka na, registration closes tonight.",
    expectMinScore: 40,
    expectCategory: "Investment Scam",
  },
  {
    name: "Romance customs-fee scam",
    text: "Hello dear, this is Dr. James stationed abroad on a mission ship. My gift box for you is being held at customs, please send the P8,500 clearance fee so it can reach you, my love.",
    expectMinScore: 25,
    expectCategory: "Romance Scam",
  },
  {
    name: "Shopee order-fee phishing",
    text: "[Shopee PH] Your order OD7734 failed COD validation. Confirm your account within 6 hours or it will be cancelled: http://shopee-order-confirm.site/login",
    expectMinScore: 40,
    expectCategory: "Phishing",
  },
  {
    name: "Benign normal message",
    text: "Hi Ate, dito na yung padala ko bukas sa bahay ni Nanay. Salamat ha! Ingat ka lagi.",
    expectMaxScore: 19,
  },
  {
    name: "Benign courier pickup",
    text: "Good day! Your LBC parcel is ready for pickup at Branch 12 until Friday, 5PM. Please bring a valid ID.",
    expectMaxScore: 49,
  },
];

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`  ✓ ${message}`);
  }
}

console.log("=== Built-in example seeds ===\n");
for (const example of EXAMPLE_SCAMS) {
  const report = analyzeMessage(example.sampleText);
  console.log(
    `${example.label}: score=${report.riskScore} level=${report.riskLevel} category=${report.category?.label ?? "-"} confidence=${report.confidence}% signals=${report.signals.length}`
  );
}

console.log("\n=== Extra Filipino & English cases ===\n");
for (const testCase of EXTRA_CASES) {
  const report = analyzeMessage(testCase.text);
  const label = `${testCase.name}`;
  console.log(
    `\n[${label}] score=${report.riskScore} level=${report.riskLevel} category=${report.category?.label ?? "-"}`
  );
  for (const signal of report.signals) {
    console.log(`   +${signal.weight} ${signal.label} → "${signal.evidence}"`);
  }

  if (testCase.expectMinScore !== undefined) {
    assert(report.riskScore >= testCase.expectMinScore, `score ≥ ${testCase.expectMinScore}`);
  }
  if (testCase.expectMaxScore !== undefined) {
    assert(report.riskScore <= testCase.expectMaxScore, `score ≤ ${testCase.expectMaxScore}`);
  }
  if (testCase.expectCategory) {
    assert(report.category?.label === testCase.expectCategory, `category = ${testCase.expectCategory}`);
  }
  assert(report.recommendedActions.length > 0, "has recommended actions");
  assert(report.summary.length > 20, "has summary explanation");
  assert(
    report.confidence > 0 && report.confidence <= 97,
    "confidence within 1–97"
  );
}

console.log("\n=== Phase 3 report structure checks ===\n");
const prizeReport = analyzeMessage(EXAMPLE_SCAMS[0].sampleText);
assert(
  prizeReport.riskScore >= 80 && prizeReport.riskLevel === "critical",
  "prize sample lands in the critical band (≥80)"
);
assert(
  prizeReport.signals.every((signal) => signal.explanation.length > 10),
  "every detected signal carries a plain-language explanation"
);
assert(
  prizeReport.signals.every((signal) => signal.evidence.length > 0),
  "every detected signal carries quoted evidence"
);
const weightSum = prizeReport.signals.reduce(
  (sum, signal) => sum + signal.weight,
  0
);
const breakdownSum = prizeReport.breakdown.reduce(
  (sum, row) => sum + row.total,
  0
);
assert(
  breakdownSum === weightSum,
  `breakdown rows (${breakdownSum}) equal summed signal weights (${weightSum})`
);
assert(prizeReport.breakdown.length > 1, "score breakdown has multiple rows");

const gcashReport = analyzeMessage(EXAMPLE_SCAMS[1].sampleText);
assert(
  gcashReport.category?.label === "E-wallet Scam",
  "GCash sample categorized as E-wallet Scam"
);
const deliveryExample = EXAMPLE_SCAMS.find(
  (example) => example.id === "lazada-delivery-scam"
);
const deliveryReport = analyzeMessage(deliveryExample.sampleText);
assert(
  deliveryReport.category?.label === "Delivery Scam",
  "delivery sample categorized as Delivery Scam"
);

console.log("\n=== Phase 5 category coverage ===\n");
const coveredLabels = new Set<string>();
for (const example of EXAMPLE_SCAMS) {
  const report = analyzeMessage(example.sampleText);
  if (report.category) coveredLabels.add(report.category.label);
}
for (const testCase of EXTRA_CASES) {
  const report = analyzeMessage(testCase.text);
  if (report.category) coveredLabels.add(report.category.label);
}
assert(
  coveredLabels.size >= 9,
  `classifier distinguishes at least 9 categories (got ${coveredLabels.size}: ${[...coveredLabels].join(", ")})`
);

console.log("\n=== Determinism check ===");
const sample =
  "CONGRATULATIONS! You won P850,000! Claim your prize via bit.ly/prize within 24 hours.";
const runA = analyzeMessage(sample);
const runB = analyzeMessage(sample);
const runC = analyzeMessage(sample);
assert(JSON.stringify(runA) === JSON.stringify(runB), "run A equals run B");
assert(JSON.stringify(runB) === JSON.stringify(runC), "run B equals run C");

console.log("\n=== Empty input safety ===");
const emptyReport = analyzeMessage("");
assert(emptyReport.riskScore === 0, "empty text scores 0");
assert(emptyReport.riskLevel === "low", "empty text is low risk");

if (process.exitCode) {
  console.error("\n✗ Detector checks FAILED");
} else {
  console.log("\n✓ All detector checks passed");
}
