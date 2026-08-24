import type { RiskLevel } from "@/lib/scam-detector";
import {
  scamCategoryById,
  type ScamCategoryId,
} from "@/lib/scam-detector/categories";

/**
 * Seeded demo dataset for the analytics dashboard.
 *
 * ScamShield PH does not persist scans yet — every number on /dashboard is
 * generated from the fixed-seed PRNG below so charts are stable across
 * server and client renders. This is demo data, not live telemetry.
 */

const SEED = 20260824;
const DAY_MS = 86_400_000;

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/** Deterministic PRNG (mulberry32) so SSR output matches client hydration. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type TrendPoint = {
  iso: string;
  /** e.g. "Aug 1" */
  label: string;
  total: number;
  highRisk: number;
};

export function buildTrendSeries(now: Date, days = 30): TrendPoint[] {
  const rand = mulberry32(SEED);
  const points: TrendPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * DAY_MS);
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();

    // Gentle upward drift as adoption grows.
    let base = 318 + (days - i) * 3.4;
    // Weekends are quieter — fewer workday texts to scan.
    if (dayOfWeek === 0 || dayOfWeek === 6) base *= 0.72;
    // Payday windows drive scam blasts in PH.
    if (dayOfMonth === 15 || dayOfMonth === 30 || dayOfMonth === 31) {
      base *= 1.34;
    }

    const total = Math.round(base * (0.86 + rand() * 0.3));
    const highRisk = Math.round(total * (0.11 + rand() * 0.09));

    points.push({
      iso: date.toISOString().slice(0, 10),
      label: `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`,
      total,
      highRisk,
    });
  }

  return points;
}

export type CategorySlice = {
  categoryId: ScamCategoryId;
  label: string;
  channel: string;
  count: number;
  share: number;
};

export type RiskSlice = {
  level: RiskLevel;
  label: string;
  description: string;
  count: number;
  share: number;
};

export type ScanType = "SMS" | "Email" | "Chat" | "Screenshot" | "URL";

export type ScanStatus = "reported" | "flagged" | "review" | "cleared";

export type ScanRowView = {
  id: string;
  type: ScanType;
  channel: string;
  categoryLabel: string;
  riskLevel: RiskLevel;
  riskScore: number;
  dateLabel: string;
  timeLabel: string;
  status: ScanStatus;
};

export type DashboardData = {
  rangeDays: number;
  trendSeries: TrendPoint[];
  categories: CategorySlice[];
  risks: RiskSlice[];
  topCategory: CategorySlice;
  recentScans: ScanRowView[];
  stats: {
    totalScans: number;
    highRiskScans: number;
    highRiskShare: number;
    reportsSubmitted: number;
  };
  /** Demo deltas vs. the previous equivalent window (also seeded). */
  deltas: {
    totalScansPct: number;
    highRiskPct: number;
    reportsPct: number;
  };
};

/** Relative weights of each scam pattern in the seeded window. */
const CATEGORY_WEIGHTS: Array<[ScamCategoryId, number]> = [
  ["e-wallet-scam", 27],
  ["prize-scam", 17],
  ["bank-scam", 14],
  ["delivery-scam", 11],
  ["online-job-scam", 9],
  ["loan-scam", 7],
  ["government-impersonation", 5],
  ["investment-scam", 4],
  ["phishing", 3],
  ["account-verification-scam", 1.6],
  ["romance-scam", 1],
  ["other", 0.4],
];

const RISK_SHARES: Array<[RiskLevel, number]> = [
  ["low", 0.56],
  ["medium", 0.23],
  ["high", 0.14],
  ["critical", 0.07],
];

const RISK_META: Record<RiskLevel, { label: string; description: string }> = {
  low: { label: "Low", description: "Benign or trivially suspicious" },
  medium: { label: "Moderate", description: "Mixed signals, needs judgment" },
  high: { label: "High", description: "Strong scam indicators found" },
  critical: { label: "Critical", description: "Near-certain active scam" },
};

type SeedScan = [
  type: ScanType,
  channel: string,
  categoryId: ScamCategoryId,
  riskLevel: RiskLevel,
  riskScore: number,
  minutesAgo: number,
  status: ScanStatus,
];

/** Hand-authored so the table reads like real activity, not noise. */
const SEED_SCANS: SeedScan[] = [
  ["SMS", "+63 9·· ··· ··67", "e-wallet-scam", "critical", 93, 12, "reported"],
  ["URL", "cutt.ly shortlink", "phishing", "high", 81, 41, "flagged"],
  ["Screenshot", "Messaging app", "prize-scam", "high", 74, 110, "reported"],
  ["Email", "Gmail", "account-verification-scam", "high", 69, 185, "review"],
  ["SMS", "+63 9·· ··· ··13", "delivery-scam", "medium", 52, 305, "review"],
  ["Chat", "Viber group", "investment-scam", "critical", 96, 480, "reported"],
  ["Screenshot", "Messenger", "online-job-scam", "high", 77, 660, "flagged"],
  ["SMS", "+63 9·· ··· ··88", "government-impersonation", "critical", 91, 900, "review"],
  ["URL", "bdo-online-secure.xyz", "bank-scam", "high", 84, 1260, "flagged"],
  ["Chat", "Facebook Messenger", "romance-scam", "medium", 58, 1560, "reported"],
  ["SMS", "+63 9·· ··· ··41", "other", "low", 16, 1980, "cleared"],
  ["Email", "Outlook", "phishing", "low", 24, 2400, "cleared"],
];

function formatClock(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function countsFromWeights<K extends string>(
  total: number,
  weights: Array<[K, number]>
): Array<{ id: K; count: number }> {
  const weightSum = weights.reduce((sum, [, weight]) => sum + weight, 0);
  const counts = weights.map(([id, weight]) => ({
    id,
    count: Math.round((total * weight) / weightSum),
  }));
  // Absorb rounding drift into the largest bucket so sums stay exact.
  const drift = total - counts.reduce((sum, entry) => sum + entry.count, 0);
  counts[0].count += drift;
  return counts;
}

export function getDashboardData(now: Date): DashboardData {
  const rangeDays = 30;
  const trendSeries = buildTrendSeries(now, rangeDays);

  const totalScans = trendSeries.reduce((sum, point) => sum + point.total, 0);
  const highRiskScans = trendSeries.reduce(
    (sum, point) => sum + point.highRisk,
    0
  );
  const reportsSubmitted = 642;

  const rawCategories = countsFromWeights(totalScans, CATEGORY_WEIGHTS)
    .map(({ id, count }) => {
      const def = scamCategoryById(id);
      return { categoryId: id, label: def.label, channel: def.exampleChannel, count };
    })
    .sort((a, b) => b.count - a.count);

  const categories: CategorySlice[] = rawCategories.map((entry) => ({
    ...entry,
    share: entry.count / totalScans,
  }));

  const topCategory = categories[0];

  const rawRisks = countsFromWeights(
    totalScans,
    RISK_SHARES.map(([level, share]) => [level, share] as const)
  );

  const risks: RiskSlice[] = RISK_SHARES.map(([level]) => {
    const match = rawRisks.find((entry) => entry.id === level);
    const count = match?.count ?? 0;
    return {
      level,
      ...RISK_META[level],
      count,
      share: count / totalScans,
    };
  });

  const recentScans: ScanRowView[] = SEED_SCANS.map(
    ([type, channel, categoryId, riskLevel, riskScore, minutesAgo, status], index) => {
      const scannedAt = new Date(now.getTime() - minutesAgo * 60_000);
      return {
        id: `scan-${String(index + 1).padStart(3, "0")}`,
        type,
        channel,
        categoryLabel: scamCategoryById(categoryId).label,
        riskLevel,
        riskScore,
        dateLabel: `${MONTHS_SHORT[scannedAt.getMonth()]} ${scannedAt.getDate()}`,
        timeLabel: formatClock(scannedAt),
        status,
      };
    }
  );

  return {
    rangeDays,
    trendSeries,
    categories,
    risks,
    topCategory,
    recentScans,
    stats: { totalScans, highRiskScans, highRiskShare: highRiskScans / totalScans, reportsSubmitted },
    deltas: { totalScansPct: 12.4, highRiskPct: -6.2, reportsPct: 23.1 },
  };
}

const INT_FORMAT = new Intl.NumberFormat("en-PH");

export function formatInt(value: number): string {
  return INT_FORMAT.format(value);
}

export function formatPct(fraction: number, digits = 1): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}
