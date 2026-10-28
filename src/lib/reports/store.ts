import { createHash } from "node:crypto";

import {
  scamCategoryById,
  type ScamCategoryId,
} from "@/lib/scam-detector/categories";

import { levelFromScore } from "@/lib/scam-detector/scoring";
import { isDatabaseConfigured, query } from "@/lib/db";
import { deriveShortDescription, descriptionFingerprint } from "./sanitize";
import {
  PLATFORM_LABELS,
  type CommunityReport,
  type ModerationStatus,
  type PublicReportSummary,
  type ReportsMeta,
  type StoredScreenshot,
} from "./types";

/**
 * Community reports store.
 *
 * With DATABASE_URL set, reports live in Postgres; otherwise in server
 * memory (globalThis) for local development. New stores start empty;
 * submissions appear publicly only after approval.
 */

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

// --- Postgres helpers -------------------------------------------------------

type ReportRow = Record<string, unknown>;

/** Confirmation tokens are hashed before they touch the database. */
function hashConfirmationToken(token: string): string {
  return createHash("sha256").update(`ss-confirm:${token}`).digest("hex");
}

function rowToReport(
  row: ReportRow,
  confirmedTokens?: Set<string>,
): CommunityReport {
  return {
    id: String(row.id),
    categoryId: row.category_id as ScamCategoryId,
    platform: row.platform as CommunityReport["platform"],
    description: String(row.description),
    shortDescription: String(row.short_description),
    sender: (row.sender as string | null) ?? null,
    screenshot: (row.screenshot as StoredScreenshot | null) ?? null,
    // ::text cast keeps the YYYY-MM-DD string regardless of server timezone.
    encounteredAt: String(row.encountered_at),
    riskScore: Number(row.risk_score),
    riskLevel: row.risk_level as CommunityReport["riskLevel"],
    status: row.status as ModerationStatus,
    confirmations: Number(row.confirmations),
    confirmedTokens: confirmedTokens ?? new Set(),
    createdAt: new Date(row.created_at as string).toISOString(),
    moderatedAt: row.moderated_at
      ? new Date(row.moderated_at as string).toISOString()
      : null,
    rejectionReason: (row.rejection_reason as string | null) ?? null,
  };
}

const REPORT_COLUMNS = `
  id, category_id, platform, description, short_description, sender,
  screenshot, encountered_at::text AS encountered_at, risk_score, risk_level,
  status, confirmations, created_at, moderated_at, rejection_reason
`;

async function loadConfirmedTokenIds(reportId: string): Promise<Set<string>> {
  const rows = await query(
    "SELECT token_hash FROM report_confirmations WHERE report_id = $1",
    [reportId],
  );
  return new Set(rows.map((row) => String(row.token_hash)));
}

// --- Memory fallback --------------------------------------------------------

function memoryReports(): Map<string, CommunityReport> {
  const globalStore = globalThis as unknown as {
    __scamshieldReportsStore?: { reports: Map<string, CommunityReport> };
  };
  if (!globalStore.__scamshieldReportsStore) {
    const store = { reports: new Map<string, CommunityReport>() };
    globalStore.__scamshieldReportsStore = store;
  }
  return globalStore.__scamshieldReportsStore.reports;
}

// --- Public API -------------------------------------------------------------

export async function createReport(
  input: NewReportInput,
): Promise<CommunityReport> {
  const report: CommunityReport = {
    id: generateReportId(),
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
    moderatedAt: input.status === "pending" ? null : new Date().toISOString(),
    rejectionReason: input.rejectionReason ?? null,
  };

  if (isDatabaseConfigured()) {
    const rows = await query(
      `INSERT INTO community_reports
        (id, category_id, platform, description, description_fp,
         short_description, sender,
         screenshot, encountered_at, risk_score, risk_level, status,
         confirmations, created_at, moderated_at, rejection_reason)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       RETURNING ${REPORT_COLUMNS}`,
      [
        report.id,
        report.categoryId,
        report.platform,
        report.description,
        descriptionFingerprint(report.description),
        report.shortDescription,
        report.sender,
        report.screenshot,
        report.encounteredAt,
        report.riskScore,
        report.riskLevel,
        report.status,
        report.confirmations,
        report.createdAt,
        report.moderatedAt,
        report.rejectionReason,
      ],
    );
    return rowToReport(rows[0]);
  }

  while (memoryReports().has(report.id)) report.id = generateReportId();
  memoryReports().set(report.id, report);
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

export async function listApprovedReports(): Promise<PublicReportSummary[]> {
  if (!isDatabaseConfigured()) {
    return [...memoryReports().values()]
      .filter((report) => report.status === "approved")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(toSummary);
  }

  const rows = await query<ReportRow>(
    `SELECT ${REPORT_COLUMNS} FROM community_reports
     WHERE status = 'approved' ORDER BY created_at DESC`,
  );
  return rows.map((row) => toSummary(rowToReport(row)));
}

export async function getApprovedReport(
  id: string,
): Promise<CommunityReport | null> {
  if (!isDatabaseConfigured()) {
    const report = memoryReports().get(id);
    return report && report.status === "approved" ? report : null;
  }

  const rows = await query<ReportRow>(
    `SELECT ${REPORT_COLUMNS} FROM community_reports
     WHERE id = $1 AND status = 'approved' LIMIT 1`,
    [id],
  );
  if (!rows[0]) return null;
  const tokens = await loadConfirmedTokenIds(id);
  return rowToReport(rows[0], tokens);
}

export async function listPendingReports(): Promise<CommunityReport[]> {
  if (!isDatabaseConfigured()) {
    return [...memoryReports().values()]
      .filter((report) => report.status === "pending")
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  const rows = await query<ReportRow>(
    `SELECT ${REPORT_COLUMNS} FROM community_reports
     WHERE status = 'pending' ORDER BY created_at ASC`,
  );
  return rows.map((row) => rowToReport(row));
}

export async function listRecentlyModerated(
  limit = 8,
): Promise<CommunityReport[]> {
  if (!isDatabaseConfigured()) {
    return [...memoryReports().values()]
      .filter((report) => report.status !== "pending" && report.moderatedAt)
      .sort((a, b) => (b.moderatedAt ?? "").localeCompare(a.moderatedAt ?? ""))
      .slice(0, limit);
  }

  const rows = await query<ReportRow>(
    `SELECT ${REPORT_COLUMNS} FROM community_reports
     WHERE status <> 'pending' AND moderated_at IS NOT NULL
     ORDER BY moderated_at DESC LIMIT $1`,
    [limit],
  );
  return rows.map((row) => rowToReport(row));
}

export async function moderateReport(
  id: string,
  status: Extract<ModerationStatus, "approved" | "rejected">,
): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    const report = memoryReports().get(id);
    if (!report || report.status !== "pending") return false;
    report.status = status;
    report.moderatedAt = new Date().toISOString();
    return true;
  }

  const rows = await query(
    `UPDATE community_reports
     SET status = $2, moderated_at = now()
     WHERE id = $1 AND status = 'pending'
     RETURNING id`,
    [id, status],
  );
  return rows.length > 0;
}

/**
 * One confirmation per anonymous visitor token. Returns the new count,
 * or null when this token already confirmed the report.
 */
export async function confirmReport(
  id: string,
  token: string,
): Promise<number | null> {
  const tokenHash = hashConfirmationToken(token);

  if (isDatabaseConfigured()) {
    const existing = await query(
      `SELECT confirmations FROM community_reports
       WHERE id = $1 AND status = 'approved' LIMIT 1`,
      [id],
    );
    if (!existing[0]) return null;

    const inserted = await query(
      `INSERT INTO report_confirmations (report_id, token_hash)
       VALUES ($1, $2)
       ON CONFLICT (report_id, token_hash) DO NOTHING
       RETURNING report_id`,
      [id, tokenHash],
    );
    if (inserted.length === 0) {
      return Number(existing[0].confirmations);
    }
    const updated = await query(
      `UPDATE community_reports SET confirmations = confirmations + 1
       WHERE id = $1 RETURNING confirmations`,
      [id],
    );
    return Number(updated[0].confirmations);
  }

  const report = memoryReports().get(id);
  if (!report || report.status !== "approved") return null;
  if (report.confirmedTokens.has(tokenHash)) return report.confirmations;

  report.confirmedTokens.add(tokenHash);
  report.confirmations += 1;
  return report.confirmations;
}

export async function hasConfirmed(
  id: string,
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const tokenHash = hashConfirmationToken(token);

  if (isDatabaseConfigured()) {
    const rows = await query(
      "SELECT 1 FROM report_confirmations WHERE report_id = $1 AND token_hash = $2 LIMIT 1",
      [id, tokenHash],
    );
    return rows.length > 0;
  }
  return memoryReports().get(id)?.confirmedTokens.has(tokenHash) ?? false;
}

export async function getConfirmedIds(
  tokens: Iterable<string>,
): Promise<Set<string>> {
  // A single browser holds exactly one anon token; kept generic for clarity.
  if (!isDatabaseConfigured()) {
    const ids = new Set<string>();
    for (const token of tokens) {
      const tokenHash = hashConfirmationToken(token);
      for (const report of memoryReports().values()) {
        if (report.confirmedTokens.has(tokenHash)) ids.add(report.id);
      }
    }
    return ids;
  }

  const hashes = [...new Set([...tokens].map(hashConfirmationToken))];
  if (hashes.length === 0) return new Set();
  const rows = await query(
    "SELECT DISTINCT report_id FROM report_confirmations WHERE token_hash = ANY($1)",
    [hashes],
  );
  return new Set(rows.map((row) => String(row.report_id)));
}

/** True when an existing report has the same normalized-description fingerprint. */
export async function hasDescriptionFingerprint(
  fingerprint: string,
): Promise<boolean> {
  if (isDatabaseConfigured()) {
    const rows = await query(
      "SELECT 1 FROM community_reports WHERE description_fp = $1 LIMIT 1",
      [fingerprint],
    );
    return rows.length > 0;
  }

  for (const report of memoryReports().values()) {
    if (descriptionFingerprint(report.description) === fingerprint) {
      return true;
    }
  }
  return false;
}

export async function getMeta(): Promise<ReportsMeta> {
  if (!isDatabaseConfigured()) {
    let approvedCount = 0;
    let awaitingReview = 0;
    let totalConfirmations = 0;
    for (const report of memoryReports().values()) {
      totalConfirmations += report.confirmations;
      if (report.status === "approved") approvedCount += 1;
      else if (report.status === "pending") awaitingReview += 1;
    }
    return { approvedCount, awaitingReview, totalConfirmations };
  }

  const rows = await query<{
    approved_count: string;
    pending_count: string;
    total_confirmations: string;
  }>(
    `SELECT
       COUNT(*) FILTER (WHERE status = 'approved')::text AS approved_count,
       COUNT(*) FILTER (WHERE status = 'pending')::text AS pending_count,
       COALESCE(SUM(confirmations), 0)::text AS total_confirmations
     FROM community_reports`,
  );
  return {
    approvedCount: Number(rows[0].approved_count),
    awaitingReview: Number(rows[0].pending_count),
    totalConfirmations: Number(rows[0].total_confirmations),
  };
}
