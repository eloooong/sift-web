import type { ScanReport } from "@/lib/scan-report";
import type { UrlReport } from "@/lib/url-analyzer";
import { randomBytes } from "node:crypto";

import { isDatabaseConfigured, query } from "@/lib/db";

/**
 * Per-user scan history.
 *
 * With DATABASE_URL set, entries live in Postgres; otherwise in server
 * memory (globalThis) for zero-config demo runs. Entries are ONLY ever
 * created/read/deleted through the helpers below, which always scope by
 * userId; API routes never accept a client-side user identifier.
 */

export type HistoryScanType = "message" | "screenshot" | "url";

export type HistoryStatus = "completed" | "failed";

export type HistoryEntry = {
  id: string;
  userId: string;
  scanType: HistoryScanType;
  status: HistoryStatus;
  createdAt: string;
  /** First line(s) of the scanned input for list display. */
  inputPreview: string;
  /** Full scanned input, capped, so old results can be reopened. */
  fullInput: string;
  /** Denormalized for list rendering; null when failed. */
  riskScore: number | null;
  riskLevel: ScanReport["riskLevel"] | null;
  categoryLabel: string | null;
  /** Complete result snapshots for reopening. */
  messageReport: ScanReport | null;
  urlReport: UrlReport | null;
};

export type HistoryListItem = Pick<
  HistoryEntry,
  | "id"
  | "scanType"
  | "status"
  | "createdAt"
  | "inputPreview"
  | "riskScore"
  | "riskLevel"
  | "categoryLabel"
>;

const MAX_STORED_INPUT_CHARS = 12_000;
const PREVIEW_CHARS = 140;

function generateEntryId(): string {
  return `HST-${randomBytes(5).toString("hex").toUpperCase()}`;
}

function buildPreview(input: string): string {
  const singleLine = input.replace(/\s+/g, " ").trim();
  return singleLine.length > PREVIEW_CHARS
    ? `${singleLine.slice(0, PREVIEW_CHARS - 1)}…`
    : singleLine;
}

function memoryEntries(): Map<string, HistoryEntry> {
  const globalStore = globalThis as unknown as {
    __scamshieldHistoryStore?: { entries: Map<string, HistoryEntry> };
  };
  globalStore.__scamshieldHistoryStore ??= { entries: new Map() };
  return globalStore.__scamshieldHistoryStore.entries;
}

type HistoryRow = Record<string, unknown>;

function rowToEntry(row: HistoryRow): HistoryEntry {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    scanType: row.scan_type as HistoryScanType,
    status: row.status as HistoryStatus,
    createdAt: new Date(row.created_at as string).toISOString(),
    inputPreview: String(row.input_preview),
    fullInput: String(row.full_input),
    riskScore: row.risk_score === null ? null : Number(row.risk_score),
    riskLevel: (row.risk_level as HistoryEntry["riskLevel"]) ?? null,
    categoryLabel: (row.category_label as string) ?? null,
    messageReport: (row.message_report as ScanReport | null) ?? null,
    urlReport: (row.url_report as UrlReport | null) ?? null,
  };
}

export async function recordScan(input: {
  userId: string;
  scanType: HistoryScanType;
  rawInput: string;
  status: HistoryStatus;
  messageReport?: ScanReport | null;
  urlReport?: UrlReport | null;
}): Promise<HistoryEntry> {
  const entry: HistoryEntry = {
    id: generateEntryId(),
    userId: input.userId,
    scanType: input.scanType,
    status: input.status,
    createdAt: new Date().toISOString(),
    inputPreview: buildPreview(input.rawInput),
    fullInput: input.rawInput.slice(0, MAX_STORED_INPUT_CHARS),
    riskScore:
      input.messageReport?.riskScore ?? input.urlReport?.riskScore ?? null,
    riskLevel:
      input.messageReport?.riskLevel ?? input.urlReport?.riskLevel ?? null,
    categoryLabel: input.messageReport?.category?.label ?? null,
    messageReport: input.messageReport ?? null,
    urlReport: input.urlReport ?? null,
  };

  if (isDatabaseConfigured()) {
    await query(
      `INSERT INTO scan_history
        (id, user_id, scan_type, status, created_at, input_preview,
         full_input, risk_score, risk_level, category_label,
         message_report, url_report)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        entry.id,
        entry.userId,
        entry.scanType,
        entry.status,
        entry.createdAt,
        entry.inputPreview,
        entry.fullInput,
        entry.riskScore,
        entry.riskLevel,
        entry.categoryLabel,
        entry.messageReport,
        entry.urlReport,
      ]
    );
    return entry;
  }

  memoryEntries().set(entry.id, entry);
  return entry;
}

/** All entries belonging to one user, newest first. */
export async function listUserHistory(
  userId: string
): Promise<HistoryListItem[]> {
  if (isDatabaseConfigured()) {
    const rows = await query<HistoryRow>(
      `SELECT id, user_id, scan_type, status, created_at, input_preview,
              risk_score, risk_level, category_label
       FROM scan_history WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows.map((row) => ({
      id: String(row.id),
      scanType: row.scan_type as HistoryScanType,
      status: row.status as HistoryStatus,
      createdAt: new Date(row.created_at as string).toISOString(),
      inputPreview: String(row.input_preview),
      riskScore: row.risk_score === null ? null : Number(row.risk_score),
      riskLevel: (row.risk_level as HistoryEntry["riskLevel"]) ?? null,
      categoryLabel: (row.category_label as string) ?? null,
    }));
  }

  return [...memoryEntries().values()]
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((entry) => ({
      id: entry.id,
      scanType: entry.scanType,
      status: entry.status,
      createdAt: entry.createdAt,
      inputPreview: entry.inputPreview,
      riskScore: entry.riskScore,
      riskLevel: entry.riskLevel,
      categoryLabel: entry.categoryLabel,
    }));
}

/**
 * Ownership-enforced fetch: returns the entry only when it belongs to the
 * given user. Callers treat any miss as not-found.
 */
export async function getUserHistoryEntry(
  userId: string,
  entryId: string
): Promise<HistoryEntry | null> {
  if (isDatabaseConfigured()) {
    const rows = await query<HistoryRow>(
      "SELECT * FROM scan_history WHERE id = $1 AND user_id = $2 LIMIT 1",
      [entryId, userId]
    );
    return rows[0] ? rowToEntry(rows[0]) : null;
  }

  const entry = memoryEntries().get(entryId);
  if (!entry || entry.userId !== userId) return null;
  return entry;
}

/** Returns true when something was actually deleted. */
export async function deleteUserHistoryEntry(
  userId: string,
  entryId: string
): Promise<boolean> {
  // Ownership scoping in the query itself; delete must never succeed cross-user.
  if (isDatabaseConfigured()) {
    const rows = await query(
      "DELETE FROM scan_history WHERE id = $1 AND user_id = $2 RETURNING id",
      [entryId, userId]
    );
    return rows.length > 0;
  }

  if (!(await getUserHistoryEntry(userId, entryId))) return false;
  memoryEntries().delete(entryId);
  return true;
}

export async function deleteAllUserHistory(userId: string): Promise<number> {
  if (isDatabaseConfigured()) {
    const rows = await query(
      "DELETE FROM scan_history WHERE user_id = $1 RETURNING id",
      [userId]
    );
    return rows.length;
  }

  let deleted = 0;
  for (const [id, entry] of memoryEntries()) {
    if (entry.userId === userId) {
      memoryEntries().delete(id);
      deleted += 1;
    }
  }
  return deleted;
}
