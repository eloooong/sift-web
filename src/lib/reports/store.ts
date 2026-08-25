import { scamCategoryById, type ScamCategoryId } from "@/lib/scam-detector/categories";

import { deriveShortDescription } from "./sanitize";
import { REPORT_SEEDS, type SeedInput } from "./seed-data";
import {
  PLATFORM_LABELS,
  type CommunityReport,
  type ModerationStatus,
  type PublicReportSummary,
  type ReportsMeta,
  type StoredScreenshot,
} from "./types";

/**
 * In-memory community reports store.
 *
 * ScamShield PH has no database yet, so submissions live in server memory
 * (attached to globalThis so Next dev hot-reloads don't wipe it; a server
 * restart clears it). Seeded entries are demo content. Nothing here is
 * ever published without passing moderation.
 */

function levelFromScore(score: number): CommunityReport["riskLevel"] {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

function makeSeedReport(seed: SeedInput, index: number): CommunityReport {
  const createdMs =
    Date.now() - seed.daysAgo * 86_400_000 - index * 3_600_000;
  const status = seed.status ?? "approved";

  return {
    id: `CSR-${(1_000 + index * 7_717).toString(36).toUpperCase().slice(-5)}${index}`,
    categoryId: seed.categoryId,
    platform: seed.platform,
    description: seed.description,
    shortDescription: deriveShortDescription(seed.description),
    sender: seed.sender,
    screenshot: null,
    encounteredAt: new Date(createdMs).toISOString().slice(0, 10),
    riskScore: seed.riskScore,
    riskLevel: levelFromScore(seed.riskScore),
    status,
    confirmations: seed.confirmations ?? 0,
    confirmedTokens: new Set(),
    createdAt: new Date(createdMs).toISOString(),
    moderatedAt:
      status === "pending"
        ? null
        : new Date(createdMs + 7_200_000).toISOString(),
    rejectionReason: seed.rejectionReason ?? null,
  };
}

type StoreShape = {
  reports: Map<string, CommunityReport>;
};

const globalStore = globalThis as unknown as {
  __scamshieldReportsStore?: StoreShape;
};

function createStore(): StoreShape {
  const store: StoreShape = { reports: new Map() };
  REPORT_SEEDS.forEach((seed, index) => {
    const report = makeSeedReport(seed, index);
    store.reports.set(report.id, report);
  });
  return store;
}

export const reportsStore: StoreShape =
  globalStore.__scamshieldReportsStore ?? createStore();
globalStore.__scamshieldReportsStore = reportsStore;

export type NewReportInput = {
  categoryId: ScamCategoryId;
  platform: CommunityReport["platform"];
  description: string;
  sender: string | null;
  screenshot: StoredScreenshot | null;
  encounteredAt: string;
  riskScore: number;
  status: ModerationStatus;
  rejectionReason?: string | null;
};

/** Public reference code, random, not sequential, reveals nothing. */
function generateReportId(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const raw = [...bytes]
    .map((b) => b.toString(36))
    .join("")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);
  return `CSR-${raw.padEnd(6, "0").slice(0, 8)}`;
}

export function createReport(input: NewReportInput): CommunityReport {
  let id = generateReportId();
  while (reportsStore.reports.has(id)) id = generateReportId();

  const report: CommunityReport = {
    id,
    categoryId: input.categoryId,
    platform: input.platform,
    description: input.description,
    shortDescription: deriveShortDescription(input.description),
    sender: input.sender,
    screenshot: input.screenshot,
    encounteredAt: input.encounteredAt,
    riskScore: input.riskScore,
    riskLevel: levelFromScore(input.riskScore),
    status: input.status,
    confirmations: 0,
    confirmedTokens: new Set(),
    createdAt: new Date().toISOString(),
    moderatedAt:
      input.status === "pending" ? null : new Date().toISOString(),
    rejectionReason: input.rejectionReason ?? null,
  };

  reportsStore.reports.set(report.id, report);
  return report;
}

export function toSummary(report: CommunityReport): PublicReportSummary {
  return {
    id: report.id,
    categoryId: report.categoryId,
    categoryLabel: scamCategoryById(report.categoryId).label,
    platform: report.platform,
    platformLabel: PLATFORM_LABELS[report.platform],
    shortDescription: report.shortDescription,
    sender: report.sender,
    encounteredAt: report.encounteredAt,
    createdAt: report.createdAt,
    riskScore: report.riskScore,
    riskLevel: report.riskLevel,
    confirmations: report.confirmations,
    hasScreenshot: report.screenshot !== null,
  };
}

export function listApprovedReports(): PublicReportSummary[] {
  return [...reportsStore.reports.values()]
    .filter((report) => report.status === "approved")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toSummary);
}

export function getApprovedReport(id: string): CommunityReport | null {
  const report = reportsStore.reports.get(id);
  return report && report.status === "approved" ? report : null;
}

export function listPendingReports(): CommunityReport[] {
  return [...reportsStore.reports.values()]
    .filter((report) => report.status === "pending")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function listRecentlyModerated(limit = 8): CommunityReport[] {
  return [...reportsStore.reports.values()]
    .filter((report) => report.status !== "pending" && report.moderatedAt)
    .sort((a, b) => (b.moderatedAt ?? "").localeCompare(a.moderatedAt ?? ""))
    .slice(0, limit);
}

export function moderateReport(
  id: string,
  status: Extract<ModerationStatus, "approved" | "rejected">
): boolean {
  const report = reportsStore.reports.get(id);
  if (!report || report.status !== "pending") return false;
  report.status = status;
  report.moderatedAt = new Date().toISOString();
  return true;
}

/**
 * One confirmation per anonymous visitor token. Returns the new count,
 * or null when this token already confirmed the report.
 */
export function confirmReport(
  id: string,
  token: string
): number | null {
  const report = reportsStore.reports.get(id);
  if (!report || report.status !== "approved") return null;
  if (report.confirmedTokens.has(token)) return report.confirmations;

  report.confirmedTokens.add(token);
  report.confirmations += 1;
  return report.confirmations;
}

export function hasConfirmed(id: string, token: string | undefined): boolean {
  if (!token) return false;
  return reportsStore.reports.get(id)?.confirmedTokens.has(token) ?? false;
}

export function getConfirmedIds(
  tokens: Iterable<string>
): Set<string> {
  // A single browser holds exactly one anon token; kept generic for clarity.
  const ids = new Set<string>();
  for (const token of tokens) {
    for (const report of reportsStore.reports.values()) {
      if (report.confirmedTokens.has(token)) ids.add(report.id);
    }
  }
  return ids;
}

export function getMeta(): ReportsMeta {
  let approvedCount = 0;
  let awaitingReview = 0;
  let totalConfirmations = 0;
  for (const report of reportsStore.reports.values()) {
    totalConfirmations += report.confirmations;
    if (report.status === "approved") approvedCount += 1;
    else if (report.status === "pending") awaitingReview += 1;
  }
  return { approvedCount, awaitingReview, totalConfirmations };
}
