import { levelFromScore } from "@/lib/scam-detector/scoring";

import type { UrlSignal, UrlVerdict } from "./types";

const SEVERITY_ORDER = ["info", "low", "medium", "high", "critical"] as const;

/**
 * Aggregates signal weights into a 0–100 score.
 *
 * Guardrail (per product rules): a single weak/medium signal must never make
 * the URL look dangerous. We therefore cap the score at 39 ("suspicious" at
 * most) unless at least one strong signal (high/critical) is present.
 */
export function scoreUrlSignals(signals: UrlSignal[]): {
  riskScore: number;
  riskLevel: ReturnType<typeof levelFromScore>;
  verdict: UrlVerdict;
} {
  const negativeBonus = signals
    .filter((signal) => signal.weight < 0)
    .reduce((sum, signal) => sum + signal.weight, 0);

  const positives = signals
    .filter((signal) => signal.weight > 0)
    .sort((a, b) => b.weight - a.weight);

  // Diminishing returns: strongest signal full weight, each next one 80% of
  // the previous. Prevents a pile of weak signals from outweighing one clear
  // structural red flag.
  let total = 0;
  let factor = 1;
  for (const signal of positives) {
    total += signal.weight * factor;
    factor *= 0.8;
  }

  const hasStrongSignal = signals.some(
    (signal) => signal.severity === "high" || signal.severity === "critical"
  );

  let score = Math.round(total);
  if (!hasStrongSignal && score > 39) {
    score = 39;
  }
  score += negativeBonus;

  const riskScore = Math.max(0, Math.min(99, score));
  const riskLevel = levelFromScore(riskScore);

  const verdict: UrlVerdict =
    signals.some((s) => s.id === "reputation-unsafe") ||
    signals.some((s) => s.severity === "critical")
      ? "dangerous"
      : riskScore >= 60
        ? "dangerous"
        : riskScore >= 30
          ? "suspicious"
          : signals.some((s) => s.weight > 0)
            ? "caution"
            : "no-signals";

  return { riskScore, riskLevel, verdict };
}

/** Strongest-first ordering for display. */
export function sortSignalsForDisplay(signals: UrlSignal[]): UrlSignal[] {
  return [...signals].sort(
    (a, b) =>
      b.weight - a.weight ||
      SEVERITY_ORDER.indexOf(b.severity) - SEVERITY_ORDER.indexOf(a.severity)
  );
}
