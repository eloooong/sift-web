/**
 * Phase 6 sanity checks for the screenshot-scanner plumbing.
 * Pure-logic only (no network, no real OCR) — run with:
 *   npx tsx scripts/screenshot-validation-check.ts
 */
import { analyzeMessage } from "../src/lib/scam-detector";
import { ruleReportToScan } from "../src/lib/scan-report";
import { getOcrProvider, OcrError } from "../src/lib/ocr";
import type { OcrProvider } from "../src/lib/ocr";
import {
  MAX_SCREENSHOT_BYTES,
  detectImageType,
  sanitizeExtractedText,
  validateClientFile,
  describeValidationError,
} from "../src/lib/screenshots";

async function main() {
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

section("Magic-byte sniffing");

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
assert(
  detectImageType(new Uint8Array([...PNG_SIGNATURE, 0, 0, 0, 0])) === "png",
  "PNG signature detected"
);

assert(
  detectImageType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0])) === "jpeg",
  "JPEG signature detected"
);

const WEBP = new TextEncoder().encode("RIFFxxxxWEBPVP8 ");
assert(detectImageType(WEBP) === "webp", "WebP signature detected");

assert(
  detectImageType(new TextEncoder().encode("GIF89a......")) === null,
  "GIF rejected"
);

assert(
  detectImageType(new TextEncoder().encode("<!DOCTYPE html>")) === null,
  "HTML disguised as image rejected"
);

assert(detectImageType(new Uint8Array(4)) === null, "Truncated buffer rejected");

section("Size validation");

assert(validateScreenshotSafe(1024), "normal-size file accepted");
function validateScreenshotSafe(size: number) {
  return validateClientFile({ name: "shot.png", size, type: "image/png" }) === null;
}

assert(
  validateClientFile({ name: "huge.png", size: MAX_SCREENSHOT_BYTES + 1, type: "image/png" }) ===
    "too_large",
  "oversize file rejected"
);
assert(
  validateClientFile({ name: "tiny.png", size: 10, type: "image/png" }) === "empty_file",
  "suspiciously tiny file rejected"
);
assert(
  validateClientFile({ name: "movie.mp4", size: 2048, type: "video/mp4" }) ===
    "unsupported_type",
  "wrong MIME type rejected"
);
assert(
  validateClientFile({ name: "notes.txt", size: 2048, type: "" }) ===
    "unsupported_type",
  "wrong extension rejected when MIME missing"
);
assert(
  validateClientFile({ name: "photo.jpg", size: 2048, type: "image/jpg" }) === null,
  "image/jpg alias accepted"
);
assert(describeValidationError("too_large").includes("5 MB"), "size error mentions the limit");

section("OCR text sanitization");

assert(
  sanitizeExtractedText("Hello\r\nworld") === "Hello\nworld",
  "CRLF normalized"
);
assert(
  sanitizeExtractedText("bad\u0007bell\u000Bvtab") === "badbellvtab",
  "control characters stripped"
);
assert(
  sanitizeExtractedText("line one\n\n\n\n\ntwo") === "line one\n\ntwo",
  "excessive blank lines collapsed"
);
assert(
  sanitizeExtractedText("   spaced   out   \n  text  ") === "spaced out\ntext",
  "per-line whitespace trimmed"
);
assert(sanitizeExtractedText("   \n\n  ") === "", "whitespace-only output empties");

section("Modular OCR provider contract");

type ExtractCall = { bytes: number };
const calls: ExtractCall[] = [];
const stubProvider: OcrProvider = {
  id: "stub",
  async extractText(image) {
    calls.push({ bytes: image.length });
    return {
      text: "CONGRATULATIONS you won a prize claim now",
      confidence: 88,
    };
  },
};

const stubResult = await stubProvider.extractText(new Uint8Array([1, 2, 3]));
assert(stubResult.confidence === 88, "provider returns confidence");
assert(calls[0]?.bytes === 3, "provider receives raw image bytes");

const factoryProvider = getOcrProvider();
assert(
  typeof factoryProvider.extractText === "function",
  `factory resolves default provider ("${factoryProvider.id}")`
);

process.env.OCR_PROVIDER = "does-not-exist";
let unknownThrows = false;
try {
  getOcrProvider();
} catch (error) {
  unknownThrows = error instanceof OcrError && error.kind === "not-configured";
}
process.env.OCR_PROVIDER = "tesseract";
assert(unknownThrows, "unknown provider id raises not-configured OcrError");

section("Pipeline reuses rule engine");

const rules = analyzeMessage(
  "CONGRATULATIONS! You won P750,000 in the PCSO Electronic Draw! Claim within 24 hours."
);
const scan = ruleReportToScan(rules, "id-1", new Date().toISOString());
assert(scan.source === "text", "rule-based scan defaults to text source");
assert(scan.riskScore > 0 && scan.flags.length > 0, "scan pipeline input intact");

console.log(
  `\n${failed === 0 ? "✓ All screenshot checks passed" : `✗ ${failed} check(s) FAILED`} (${passed} passed)`
);
if (failed > 0) process.exitCode = 1;
}

void main();
