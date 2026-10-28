import type { Lang } from "@/lib/i18n/config";
import type { CommunityNumberMatch } from "@/lib/intel/ph-scam-db";
import { BREAKDOWN_LABEL_FIL, SIGNAL_FIL } from "./fil";
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
  gambling: "Betting & bonus promos",
  intel: "Community threat intel",
};

function breakdownLabel(
  category: SignalCategoryId,
  lang: Lang
): string {
  return lang === "fil"
    ? (BREAKDOWN_LABEL_FIL[category] ?? BREAKDOWN_LABELS[category])
    : BREAKDOWN_LABELS[category];
}

function buildSummary(
  categoryLabel: string | null,
  topLabels: string[],
  riskScore: number,
  lang: Lang
): string {
  if (lang === "fil") return buildSummaryFil(topLabels, riskScore);
  if (topLabels.length === 0) {
    return "No known scam markers were found in this text. That is reassuring, but scammers evolve constantly. When money or account access is involved, always verify through official channels before acting.";
  }

  const strongest = formatList(topLabels);

  if (riskScore >= 60) {
    return `You were right to be cautious. This message matches multiple known scam indicators${
      categoryLabel ? ` typical of a ${categoryLabel.toLowerCase()}` : ""
    }. The strongest signs are ${strongest}, a combination designed to rush you before you can verify anything.`;
  }

  if (riskScore >= 30) {
    return `Several suspicious markers were found: ${strongest}. On its own, none is conclusive proof of a scam, but together they resemble common scam formats used against Filipinos. Handle this message with care.`;
  }

  return `Only weak or isolated indicators were found (${strongest}). This does not prove the message is safe. Review the sender and any links carefully before responding.`;
}

function buildSummaryFil(topLabels: string[], riskScore: number): string {
  if (topLabels.length === 0) {
    return "Walang nakitang malinaw na palatandaan ng scam sa mensahe. Hindi pa rin ito garantiya na ligtas. Kung may hinihinging pera o detalye ng account, magtanong muna sa opisyal na app o website.";
  }

  const strongest = formatListFil(topLabels);

  if (riskScore >= 60) {
    return `May dahilan para mag-ingat sa mensaheng ito. Kabilang sa mga nakita: ${strongest}. Magkakasamang palatandaan ito ng mga kilalang modus. Huwag munang sumunod; alamin muna kung totoo ang sinasabi.`;
  }

  if (riskScore >= 30) {
    return `May mga bahaging dapat mong bantayan: ${strongest}. Hindi pa sapat ang mga ito para masabing scam, pero may pagkakahawig sa mga karaniwang modus. Alamin muna kung sino ang nagpadala at kung totoo ang hinihingi.`;
  }

  return `Kaunti lang ang nakitang palatandaan: ${strongest}. Hindi nito ibig sabihing ligtas na ang mensahe. Tingnan pa rin kung sino ang nagpadala at kung saan papunta ang mga link bago sumagot.`;
}

function formatList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function formatListFil(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} at ${items[items.length - 1]}`;
}

export function analyzeMessage(
  text: string,
  options?: {
    lang?: Lang;
    /** Numbers in the text already matched against the community scam DB. */
    intelMatches?: CommunityNumberMatch[];
  }
): AnalysisReport {
  const lang: Lang = options?.lang ?? "en";
  const rawSignals = detectSignals(text, options?.intelMatches);
  const signals =
    lang === "fil"
      ? rawSignals.map((signal) => ({
          ...signal,
          label: SIGNAL_FIL[signal.id]?.label ?? signal.label,
          explanation:
            SIGNAL_FIL[signal.id]?.explanation ?? signal.explanation,
        }))
      : rawSignals;
  const { totals, primary } = aggregateCategories(signals);

  const totalWeight = signals.reduce((sum, signal) => sum + signal.weight, 0);
  const riskScore = scoreFromTotalWeight(totalWeight);
  const riskLevel = levelFromScore(riskScore);

  const category = classifyScam(text, signals, totals, primary);

  const breakdown: RiskBreakdownRow[] = totals.map((row) => ({
    category: row.category,
    label: breakdownLabel(row.category, lang),
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
  const summary = buildSummary(
    category?.label ?? null,
    topLabels,
    riskScore,
    lang
  );
  const recommendedActions = buildRecommendedActions(
    primary,
    riskScore,
    lang
  );

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
