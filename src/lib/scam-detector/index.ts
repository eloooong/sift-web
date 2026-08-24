import { buildRecommendedActions } from "./actions";
import { aggregateCategories, detectSignals } from "./detector";
import {
  confidenceFromSignals,
  levelFromScore,
  scoreFromTotalWeight,
} from "./scoring";
import type {
  AnalysisReport,
  RiskBreakdownRow,
  SignalCategoryId,
} from "./types";
import { classifyScam } from "./classifier";

const BREAKDOWN_LABELS: Record<SignalCategoryId, string> = {
  urgency: "Urgency tactics",
  prize: "Prize language",
  financial: "Money & payment requests",
  credential: "Account & password requests",
  link: "Suspicious links",
  job: "Job-offer language",
  investment: "Investment promises",
  loan: "Loan-fee demands",
  romance: "Romance manipulation",
};

function buildSummary(
  categoryLabel: string | null,
  topLabels: string[],
  riskScore: number
): string {
  if (topLabels.length === 0) {
    return "No known scam markers were found in this text. That is reassuring — but scammers evolve constantly. When money or account access is involved, always verify through official channels before acting.";
  }

  const strongest = formatList(topLabels);

  if (riskScore >= 60) {
    return `You were right to be cautious. This message matches multiple known scam indicators${
      categoryLabel ? ` typical of a ${categoryLabel.toLowerCase()}` : ""
    }. The strongest signs are ${strongest} — a combination designed to rush you before you can verify anything.`;
  }

  if (riskScore >= 30) {
    return `Several suspicious markers were found: ${strongest}. On its own, none is conclusive proof of a scam, but together they resemble common scam formats used against Filipinos. Handle this message with care.`;
  }

  return `Only weak or isolated indicators were found (${strongest}). This does not prove the message is safe — review the sender and any links carefully before responding.`;
}

function formatList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function analyzeMessage(text: string): AnalysisReport {
  const signals = detectSignals(text);
  const { totals, primary } = aggregateCategories(signals);

  const totalWeight = signals.reduce((sum, signal) => sum + signal.weight, 0);
  const riskScore = scoreFromTotalWeight(totalWeight);
  const riskLevel = levelFromScore(riskScore);

  const category = classifyScam(text, signals, totals, primary);

  const breakdown: RiskBreakdownRow[] = totals.map((row) => ({
    category: row.category,
    label: BREAKDOWN_LABELS[row.category],
    total: row.total,
  }));

  const hasHeavySignal = signals.some((signal) => signal.weight >= 15);
  const confidence = confidenceFromSignals(
    signals.length,
    totals.map((item) => item.total),
    hasHeavySignal
  );

  const topLabels = signals
    .slice(0, 3)
    .map((signal) => signal.label.toLowerCase());
  const summary = buildSummary(category?.label ?? null, topLabels, riskScore);
  const recommendedActions = buildRecommendedActions(primary, riskScore);

  return {
    riskScore,
    riskLevel,
    category,
    confidence,
    signals,
    breakdown,
    summary,
    recommendedActions,
  };
}

export type {
  AnalysisReport,
  DetectedSignal,
  RiskBreakdownRow,
  RiskLevel,
  ScamCategoryDef,
  ScamCategoryId,
  SignalCategoryId,
} from "./types";
export { SCAM_CATEGORIES } from "./categories";
