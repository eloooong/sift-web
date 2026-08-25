import type { RiskLevel } from "@/lib/scam-detector";
import {
  scamCategoryById,
  type ScamCategoryId,
} from "@/lib/scam-detector/categories";

/**
 * Corpus-anchored dashboard dataset.
 *
 * ScamShield PH does not persist scans yet, so instead of inventing numbers
 * every figure here is derived from the public Kaggle dataset
 * "Philippine Spam SMS Messages" by bwandowando (CC BY-NC-SA 4.0):
 * 1,021 real spam texts shared by Filipino users, scored offline with the
 * actual ScamShield rules engine. Only aggregate statistics are stored.
 */

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export type TrendPoint = {
  iso: string;
  /** e.g. "Nov 22" */
  label: string;
  total: number;
  highRisk: number;
};

type MonthlyRow = [year: number, month: number, total: number, flagged: number];

/**
 * Real per-month volume for Nov 2022 – Aug 2024, the window holding 90% of
 * the corpus. `flagged` = messages the engine scored 40+ that month.
 */
const MONTHLY_ROWS: MonthlyRow[] = [
  [2022, 11, 36, 1],
  [2022, 12, 32, 1],
  [2023, 1, 15, 0],
  [2023, 2, 17, 0],
  [2023, 3, 30, 0],
  [2023, 4, 21, 2],
  [2023, 5, 24, 2],
  [2023, 6, 13, 1],
  [2023, 7, 28, 1],
  [2023, 8, 15, 1],
  [2023, 9, 27, 0],
  [2023, 10, 32, 1],
  [2023, 11, 28, 0],
  [2023, 12, 39, 0],
  [2024, 1, 43, 9],
  [2024, 2, 111, 5],
  [2024, 3, 123, 0],
  [2024, 4, 98, 0],
  [2024, 5, 88, 0],
  [2024, 6, 69, 0],
  [2024, 7, 28, 0],
  [2024, 8, 2, 0],
];

export function buildTrendSeries(): TrendPoint[] {
  return MONTHLY_ROWS.map(([year, month, total, highRisk]) => ({
    iso: `${year}-${String(month).padStart(2, "0")}-01`,
    label: `${MONTHS_SHORT[month - 1]} ${String(year).slice(2)}`,
    total,
    highRisk,
  }));
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
    flaggedScans: number;
    flaggedShare: number;
    withLinks: number;
  };
};

const CORPUS_TOTAL = 1021;

/**
 * Real engine output: every corpus message run through analyzeMessage().
 * Shares are over the 666 messages the engine could classify into a scam
 * category; the remaining 355 produced no signals at all.
 */
const CLASSIFIED_TOTAL = 666;

const CATEGORY_COUNTS: Array<[ScamCategoryId, number]> = [
  ["other", 339],
  ["phishing", 132],
  ["e-wallet-scam", 56],
  ["bank-scam", 50],
  ["prize-scam", 46],
  ["online-job-scam", 18],
  ["investment-scam", 14],
  ["account-verification-scam", 4],
  ["government-impersonation", 4],
  ["loan-scam", 3],
];

/** Real risk-level distribution across all 1,021 corpus messages. */
const RISK_COUNTS: Array<[RiskLevel, number]> = [
  ["low", 926],
  ["medium", 95],
  ["high", 0],
  ["critical", 0],
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

/**
 * Sample activity modeled on the corpus's dominant templates. Every score is
 * the verified output of the real engine on a message in that format
 * (see scripts/detector-check.ts), not an invented number.
 */
const SEED_SCANS: SeedScan[] = [
  ["SMS", "+63 9·· ··· ··67", "prize-scam", "critical", 91, 12, "reported"],
  ["Chat", "Viber group", "investment-scam", "high", 78, 41, "flagged"],
  ["SMS", "+63 9·· ··· ··13", "loan-scam", "high", 70, 110, "review"],
  ["Screenshot", "Messaging app", "phishing", "medium", 56, 185, "review"],
  ["SMS", "+63 9·· ··· ··02", "online-job-scam", "medium", 55, 305, "flagged"],
  ["SMS", "+63 9·· ··· ··88", "e-wallet-scam", "medium", 52, 480, "reported"],
  ["URL", "gojackpot5.icu", "other", "medium", 48, 660, "flagged"],
  ["Email", "Gmail", "bank-scam", "medium", 48, 900, "review"],
  ["Chat", "Facebook Messenger", "romance-scam", "low", 29, 1260, "reported"],
  ["SMS", "+63 9·· ··· ··41", "other", "low", 0, 1560, "cleared"],
];

function formatClock(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function getDashboardData(now: Date): DashboardData {
  const rangeDays = 640;
  const trendSeries = buildTrendSeries();

  const totalScans = CORPUS_TOTAL;
  const flaggedScans = trendSeries.reduce(
    (sum, point) => sum + point.highRisk,
    0
  );

  const categories: CategorySlice[] = CATEGORY_COUNTS.map(
    ([categoryId, count]) => {
      const def = scamCategoryById(categoryId);
      return {
        categoryId,
        label: def.label,
        channel: def.exampleChannel,
        count,
        share: count / CLASSIFIED_TOTAL,
      };
    }
  ).sort((a, b) => b.count - a.count);

  const topCategory = categories[0];

  const risks: RiskSlice[] = RISK_COUNTS.map(([level, count]) => ({
    level,
    ...RISK_META[level],
    count,
    share: count / totalScans,
  }));

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
    stats: {
      totalScans,
      flaggedScans,
      flaggedShare: flaggedScans / totalScans,
      withLinks: 229,
    },
  };
}

const INT_FORMAT = new Intl.NumberFormat("en-PH");

export function formatInt(value: number): string {
  return INT_FORMAT.format(value);
}

export function formatPct(fraction: number, digits = 1): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}
