import { NextResponse } from "next/server";

import { runAiAnalysis } from "@/lib/ai/analyzer";
import type { AiErrorKind } from "@/lib/ai/client";
import { normalizeCategory } from "@/lib/ai/schemas";
import { scamCategoryFromLabel } from "@/lib/scam-detector/categories";
import { MAX_INPUT_CHARS } from "@/lib/examples";
import { levelFromScore } from "@/lib/scam-detector/scoring";
import { analyzeMessage } from "@/lib/scam-detector";
import { ruleReportToScan, type ScanReport } from "@/lib/scan-report";

export const runtime = "nodejs";

const AI_SCORE_WEIGHT = 0.65;
const RULES_SCORE_WEIGHT = 0.35;

const FALLBACK_WARNINGS: Record<AiErrorKind | "not_configured", string> = {
  not_configured:
    "AI analysis isn’t configured on this deployment, so your report comes from the built-in rule engine only.",
  timeout:
    "The AI analyst took too long to respond, so your report was completed with the built-in rule engine.",
  rate_limit:
    "The AI analyst is handling heavy traffic right now, so your report comes from the built-in rule engine. Please try again in a few minutes.",
  unavailable:
    "We couldn’t reach the AI analyst, so your report comes from the built-in rule engine. You can retry for a full AI assessment.",
  invalid_response:
    "The AI analyst returned an answer we couldn’t verify, so your report comes from the built-in rule engine.",
};

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
    const rulesReport = analyzeMessage(text);
    const aiOutcome = await runAiAnalysis(text, rulesReport);

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    let report: ScanReport;

    if (aiOutcome.ok) {
      const ai = aiOutcome.analysis;
      const blendedScore = Math.round(
        ai.riskScore * AI_SCORE_WEIGHT + rulesReport.riskScore * RULES_SCORE_WEIGHT
      );
      const confidence = Math.round(
        Math.min(97, Math.max(20, ai.confidence * 100))
      );

      report = {
        id,
        createdAt,
        analysisMode: "ai",
        warning: null,
        riskScore: blendedScore,
        riskLevel: levelFromScore(blendedScore),
        category: scamCategoryFromLabel(normalizeCategory(ai.category)),
        confidence,
        summary: ai.summary,
        flags: ai.redFlags.map((flag) => ({
          title: flag.title,
          evidence: flag.evidence,
          explanation: flag.explanation,
        })),
        breakdown: rulesReport.breakdown.map((row) => ({
          label: row.label,
          total: row.total,
        })),
        recommendedActions: ai.recommendations,
      };
    } else {
      report = {
        ...ruleReportToScan(rulesReport, id, createdAt),
        warning: FALLBACK_WARNINGS[aiOutcome.reason],
      };
    }

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
