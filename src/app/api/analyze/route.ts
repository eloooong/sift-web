import { NextResponse } from "next/server";

import { currentUser } from "@/lib/auth/session";
import { MAX_INPUT_CHARS } from "@/lib/examples";
import { recordScan } from "@/lib/history/store";
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
    // History is recorded server-side, keyed by the verified session — the
    // client never sends a user identifier.
    const user = await currentUser();
    if (user) {
      recordScan({
        userId: user.id,
        scanType: "message",
        rawInput: text,
        status: "completed",
        messageReport: report,
      });
    }
    return NextResponse.json({ report });
  } catch (error) {
    console.error("[api/analyze] unexpected failure", error);
    const user = await currentUser();
    if (user) {
      recordScan({
        userId: user.id,
        scanType: "message",
        rawInput: text,
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
