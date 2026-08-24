import type { RiskLevel } from "./types";

export function scoreFromTotalWeight(totalWeight: number): number {
  const compressed =
    totalWeight <= 70 ? totalWeight : 70 + (totalWeight - 70) * 0.6;
  return Math.max(0, Math.min(98, Math.round(compressed)));
}

export const RISK_LEVEL_RANGES: Array<{
  level: RiskLevel;
  label: string;
  min: number;
  max: number;
}> = [
  { level: "low", label: "Low", min: 0, max: 29 },
  { level: "medium", label: "Moderate", min: 30, max: 59 },
  { level: "high", label: "High", min: 60, max: 79 },
  { level: "critical", label: "Critical", min: 80, max: 100 },
];

export function levelFromScore(score: number): RiskLevel {
  if (score <= 29) return "low";
  if (score <= 59) return "medium";
  if (score <= 79) return "high";
  return "critical";
}

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  low: "Low risk",
  medium: "Moderate risk",
  high: "High risk",
  critical: "Critical risk",
};

export function confidenceFromSignals(
  signalCount: number,
  categoryTotals: number[],
  hasHeavySignal: boolean
): number {
  if (signalCount === 0) return 70;

  const topTotal = categoryTotals[0] ?? 0;
  const secondTotal = categoryTotals[1] ?? 0;
  const gap = topTotal - secondTotal;
  const gapBonus = gap >= 15 ? 8 : gap >= 8 ? 4 : 0;

  const raw =
    30 +
    signalCount * 7 +
    categoryTotals.length * 5 +
    gapBonus +
    (hasHeavySignal ? 6 : 0);

  return Math.max(25, Math.min(97, Math.round(raw)));
}
