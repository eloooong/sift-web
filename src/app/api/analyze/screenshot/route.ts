import { NextResponse } from "next/server";

import { currentUser } from "@/lib/auth/session";
import { recordScan } from "@/lib/history/store";
import { MAX_INPUT_CHARS } from "@/lib/examples";
import { OcrError, getOcrProvider } from "@/lib/ocr";
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

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
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
  if (!sniffed || (declaredType && declaredType !== formatToMimeType(sniffed) && declaredType !== "image/jpg")) {
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

  try {
    const report = await analyzeScamText(analysisText, {
      source: "screenshot",
    });
    report.extractedText = extractedText.slice(0, MAX_INPUT_CHARS);
    const user = await currentUser();
    if (user) {
      recordScan({
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
      recordScan({
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
