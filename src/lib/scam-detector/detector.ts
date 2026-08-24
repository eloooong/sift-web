import { SIGNALS, type SignalDefinition } from "./signals";
import type { DetectedSignal, SignalCategoryId } from "./types";

export function detectSignals(text: string): DetectedSignal[] {
  const detected: DetectedSignal[] = [];

  for (const signal of SIGNALS) {
    const result = matchSignal(signal.matcher, text);
    if (!result) continue;
    const evidence =
      typeof result === "string" ? result : result.evidence;
    detected.push({
      id: signal.id,
      category: signal.category,
      label: signal.label,
      explanation: signal.explanation,
      weight: signal.weight,
      evidence,
    });
  }

  return detected.sort((a, b) => b.weight - a.weight);
}

function matchSignal(
  matcher: SignalDefinition["matcher"],
  text: string
): string | { evidence: string } | null {
  if (matcher.kind === "custom") {
    return matcher.run(text);
  }
  for (const pattern of matcher.patterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return null;
}

const CATEGORY_PRIORITY: SignalCategoryId[] = [
  "prize",
  "credential",
  "financial",
  "link",
  "job",
  "investment",
  "loan",
  "romance",
  "urgency",
];

export type CategoryTotals = {
  totals: Array<{ category: SignalCategoryId; total: number }>;
  primary: SignalCategoryId | null;
};

export function aggregateCategories(
  signals: DetectedSignal[]
): CategoryTotals {
  const sums = new Map<SignalCategoryId, number>();
  for (const signal of signals) {
    sums.set(signal.category, (sums.get(signal.category) ?? 0) + signal.weight);
  }

  const totals = [...sums.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const top = totals[0];
  const primary =
    top && top.total >= 10
      ? top.category
      : null;

  if (!primary) return { totals, primary: null };

  const tied = totals.filter((item) => item.total === totals[0].total);
  const winner =
    tied.length > 1
      ? CATEGORY_PRIORITY.find((id) => tied.some((item) => item.category === id))
      : primary;

  return { totals, primary: winner ?? primary };
}
