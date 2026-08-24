import { NextResponse } from "next/server";

import { MAX_INPUT_CHARS } from "@/lib/examples";
import { analyzeScamText } from "@/lib/scan-pipeline";

export const runtime = "nodejs";

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(
      400,
      "bad_request",
      "We couldn’t read that request. Please try scanning again."
    );
  }

  const rawText =
    typeof body === "object" && body !== null && "text" in body
      ? (body as { text?: unknown }).text
      : undefined;

  if (typeof rawText !== "string") {
    return jsonError(
      400,
      "bad_request",
      "Paste the message you want checked before running a scan."
    );
  }

  const text = rawText.trim();
  if (!text) {
    return jsonError(
      400,
      "empty_input",
      "Paste the message you want checked before running a scan."
    );
  }
  if (text.length > MAX_INPUT_CHARS) {
    return jsonError(
      400,
      "too_long",
      `That message is too long. Please check up to ${MAX_INPUT_CHARS.toLocaleString()} characters at a time.`
    );
  }

  try {
    const report = await analyzeScamText(text, { source: "text" });
    return NextResponse.json({ report });
  } catch (error) {
    console.error("[api/analyze] unexpected failure", error);
    return jsonError(
      500,
      "internal_error",
      "Something went wrong while preparing your security report. Please try again."
    );
  }
}
