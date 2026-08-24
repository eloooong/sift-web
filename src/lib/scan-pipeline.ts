import { runAiAnalysis } from "@/lib/ai/analyzer";
import type { AiErrorKind } from "@/lib/ai/client";
import { normalizeCategory } from "@/lib/ai/schemas";
import { scamCategoryFromLabel } from "@/lib/scam-detector/categories";
import { analyzeMessage } from "@/lib/scam-detector";
import { levelFromScore } from "@/lib/scam-detector/scoring";
import { ruleReportToScan, type ScanReport, type ScanSource } from "@/lib/scan-report";

const AI_SCORE_WEIGHT = 0.65;
const RULES_SCORE_WEIGHT = 0.35;

export const FALLBACK_WARNINGS: Record<AiErrorKind | "not_configured", string> = {
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

/**
 * The full ScamShield pipeline for an already-extracted message body:
 * rule-engine pre-scan → AI analysis → blended security report.
 * Shared by the text scanner and the screenshot scanner (post-OCR).
 */
export async function analyzeScamText(
  text: string,
  options?: { source?: ScanSource }
): Promise<ScanReport> {
  const source: ScanSource = options?.source ?? "text";

  const rulesReport = analyzeMessage(text);
  const aiOutcome = await runAiAnalysis(text, rulesReport);

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  if (aiOutcome.ok) {
    const ai = aiOutcome.analysis;
    const blendedScore = Math.round(
      ai.riskScore * AI_SCORE_WEIGHT + rulesReport.riskScore * RULES_SCORE_WEIGHT
    );
    const confidence = Math.round(
      Math.min(97, Math.max(20, ai.confidence * 100))
    );

    return {
      id,
      createdAt,
      source,
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
  }

  return {
    ...ruleReportToScan(rulesReport, id, createdAt),
    source,
    warning: FALLBACK_WARNINGS[aiOutcome.reason],
  };
}
