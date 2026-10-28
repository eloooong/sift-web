import { runAiAnalysis } from "@/lib/ai/analyzer";
import type { AiErrorKind } from "@/lib/ai/client";
import type { Lang } from "@/lib/i18n/config";
import { normalizeCategory } from "@/lib/ai/schemas";
import {
  findReportedNumbers,
  getCommunityIntel,
} from "@/lib/intel/ph-scam-db";
import { scamCategoryFromLabel } from "@/lib/scam-detector/categories";
import { analyzeMessage } from "@/lib/scam-detector";
import { levelFromScore } from "@/lib/scam-detector/scoring";
import { ruleReportToScan, type ScanReport, type ScanSource } from "@/lib/scan-report";

const AI_SCORE_WEIGHT = 0.65;
const RULES_SCORE_WEIGHT = 0.35;

type FallbackWarning = Record<AiErrorKind | "not_configured", string>;

const FALLBACK_WARNINGS: Record<Lang, FallbackWarning> = {
  en: {
    not_configured:
      "AI analysis isn't configured on this deployment, so your report comes from the built-in rule engine only.",
    timeout:
      "The AI analyst took too long to respond, so your report was completed with the built-in rule engine.",
    rate_limit:
      "The AI analyst is handling heavy traffic right now, so your report comes from the built-in rule engine. Please try again in a few minutes.",
    unavailable:
      "AI analysis is temporarily unavailable, so this report uses the built-in rule engine. You can try scanning again later.",
    invalid_response:
      "The AI analyst returned an answer we couldn't verify, so your report comes from the built-in rule engine.",
  },
  fil: {
    not_configured:
      "Hindi naka-on ang AI sa bersyong ito ng Sift. Mga kilalang palatandaan ng scam ang ginamit sa pag-check.",
    timeout:
      "Natagalan ang sagot ng AI. Itinuloy ang pag-check gamit ang mga kilalang palatandaan ng scam.",
    rate_limit:
      "Maraming gumagamit ng AI ngayon. Mga kilalang palatandaan ng scam muna ang ginamit. Puwede mong subukan ulit makalipas ang ilang minuto.",
    unavailable:
      "Hindi magamit ang AI ngayon. Mga kilalang palatandaan ng scam muna ang ginamit. Puwede mong subukan ulit mamaya.",
    invalid_response:
      "Hindi magamit ang sagot ng AI. Itinuloy ang pag-check gamit ang mga kilalang palatandaan ng scam.",
  },
};

/**
 * The full Sift pipeline for an already-extracted message body:
 * rule-engine pre-scan → AI analysis → blended security report.
 * Shared by the text scanner and the screenshot scanner (post-OCR).
 */
export async function analyzeScamText(
  text: string,
  options?: { source?: ScanSource; lang?: Lang }
): Promise<ScanReport> {
  const source: ScanSource = options?.source ?? "text";
  const lang: Lang = options?.lang === "fil" ? "fil" : "en";

  // Cross-check phone numbers in the text against the community scam-number
  // database (cached feed; null when unavailable, which skips the check).
  const communityIntel = await getCommunityIntel();
  const intelMatches = communityIntel
    ? findReportedNumbers(text, communityIntel)
    : [];

  const rulesReport = analyzeMessage(text, { lang, intelMatches });
  const aiOutcome = await runAiAnalysis(text, rulesReport, lang);

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
    warning: FALLBACK_WARNINGS[lang][aiOutcome.reason],
  };
}
