import { NextResponse } from "next/server";

import { currentUser } from "@/lib/auth/session";
import { recordScan } from "@/lib/history/store";
import { MAX_INPUT_CHARS } from "@/lib/examples";
import {
  clientKey,
  requestContentLengthExceeds,
  requestSameOrigin,
} from "@/lib/http/guards";
import { OcrError, getOcrProvider } from "@/lib/ocr";
import { rateLimit } from "@/lib/reports/rate-limit";
import { analyzeScamText } from "@/lib/scan-pipeline";
import {
  ACCEPTED_MIME_TYPES,
  detectImageType,
  formatToMimeType,
  sanitizeExtractedText,
  validateScreenshotSize,
  type ScreenshotFormat,
} from "@/lib/screenshots";

export const runtime = "nodejs";

const MIN_EXTRACTED_CHARS = 20;
const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;
const ALLOWED_EXTENSIONS: Record<ScreenshotFormat, string[]> = {
  png: ["png"],
  jpeg: ["jpg", "jpeg"],
  webp: ["webp"],
};

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  if (!requestSameOrigin(request)) {
    return jsonError(
      403,
      "forbidden_origin",
      "That request didn’t come from ScamShield. Please scan from the app."
    );
  }

  const limit = await rateLimit(`scan-screenshot:${clientKey(request)}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      {
        error: {
          code: "rate_limited",
          message:
            "You’ve uploaded a lot of screenshots in a short time. Please wait a minute before trying again.",
        },
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  if (requestContentLengthExceeds(request, MAX_UPLOAD_BYTES)) {
    return jsonError(
      413,
      "too_large",
      "That image is too large. Please upload a screenshot of 5 MB or less."
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError(
      400,
      "bad_request",
      "We couldn’t read that upload. Please try scanning again."
    );
  }

  const file = formData.get("screenshot");
  if (!(file instanceof File)) {
    return jsonError(
      400,
      "missing_file",
      "Choose a screenshot to analyze first."
    );
  }

  const sizeError = validateScreenshotSize(file.size);
  if (sizeError === "too_large") {
    return jsonError(
      413,
      "too_large",
      "That image is too large. Please upload a screenshot of 5 MB or less."
    );
  }
  if (sizeError) {
    return jsonError(
      400,
      "empty_file",
      "That file appears to be empty or corrupted. Please try a different screenshot."
    );
  }

  const declaredType = (file.type || "").toLowerCase();
  if (
    declaredType &&
    !ACCEPTED_MIME_TYPES.includes(declaredType as (typeof ACCEPTED_MIME_TYPES)[number])
  ) {
    return jsonError(
      415,
      "unsupported_type",
      "Unsupported file type. Please upload a PNG, JPG, or WebP image."
    );
  }

  const fileName = (file.name || "").toLowerCase();
  const extension = fileName.includes(".")
    ? fileName.slice(fileName.lastIndexOf(".") + 1)
    : "";
  const allowedExtensions = Object.values(ALLOWED_EXTENSIONS).flat();
  if (extension && !allowedExtensions.includes(extension)) {
    return jsonError(
      415,
      "unsupported_type",
      "Unsupported file type. Please upload a PNG, JPG, or WebP image."
    );
  }

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await file.arrayBuffer());
  } catch {
    return jsonError(
      400,
      "bad_request",
      "We couldn’t read the uploaded image. Please try again."
    );
  }

  const sniffed: ScreenshotFormat | null = detectImageType(bytes);
  const declaredMatchesSniff =
    !declaredType ||
    declaredType === formatToMimeType(sniffed ?? "png") ||
    declaredType === "image/jpg";
  const extensionMatchesSniff =
    !extension || ALLOWED_EXTENSIONS[sniffed ?? "png"].includes(extension);
  if (
    !sniffed ||
    !declaredMatchesSniff ||
    !extensionMatchesSniff
  ) {
    return jsonError(
      415,
      "unsupported_type",
      "That file doesn’t look like a real PNG, JPG, or WebP image. Please upload a genuine screenshot."
    );
  }

  let extractedText: string;
  try {
    const provider = getOcrProvider();
    const result = await provider.extractText(bytes);
    extractedText = sanitizeExtractedText(result.text);
  } catch (error) {
    if (error instanceof OcrError && error.kind === "timeout") {
      console.error("[api/analyze/screenshot] OCR timeout");
      return jsonError(
        504,
        "ocr_timeout",
        "Reading your screenshot took too long. Try a smaller or clearer image."
      );
    }
    console.error("[api/analyze/screenshot] OCR failure", error);
    return jsonError(
      502,
      "unreadable_image",
      "We couldn’t read text from that image right now. Please try again in a moment."
    );
  }

  if (extractedText.length < MIN_EXTRACTED_CHARS) {
    return jsonError(
      422,
      "unreadable_image",
      "We couldn’t read enough text from that screenshot. Try a sharper, well-lit capture where the message fills most of the frame."
    );
  }

  const analysisText = extractedText.slice(0, MAX_INPUT_CHARS);
  const requestedLang = formData.get("lang");
  const lang = requestedLang === "fil" ? "fil" : "en";

  try {
    const report = await analyzeScamText(analysisText, {
      source: "screenshot",
      lang,
    });
    report.extractedText = extractedText.slice(0, MAX_INPUT_CHARS);
    const user = await currentUser();
    if (user) {
      await recordScan({
        userId: user.id,
        scanType: "screenshot",
        rawInput: analysisText,
        status: "completed",
        messageReport: report,
      });
    }
    return NextResponse.json({ report });
  } catch (error) {
    console.error("[api/analyze/screenshot] unexpected failure", error);
    const user = await currentUser();
    if (user) {
      await recordScan({
        userId: user.id,
        scanType: "screenshot",
        rawInput: analysisText,
        status: "failed",
      });
    }
    return jsonError(
      500,
      "internal_error",
      "Something went wrong while preparing your security report. Please try again."
    );
  }
}
