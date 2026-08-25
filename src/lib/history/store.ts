import type { ScanReport } from "@/lib/scan-report";
import type { UrlReport } from "@/lib/url-analyzer";
import { randomBytes } from "node:crypto";

/**
 * Per-user scan history, in-memory (globalThis), consistent with the rest of
 * the demo. Entries are ONLY ever created/read/deleted through the helpers
 * below, which always scope by userId; API routes never accept a client-side
 * user identifier.
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

type HistoryStoreShape = {
  /** id → entry */
  entries: Map<string, HistoryEntry>;
};

const globalStore = globalThis as unknown as {
  __scamshieldHistoryStore?: HistoryStoreShape;
};

export const historyStore: HistoryStoreShape =
  globalStore.__scamshieldHistoryStore ?? { entries: new Map() };
globalStore.__scamshieldHistoryStore = historyStore;

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

export function recordScan(input: {
  userId: string;
  scanType: HistoryScanType;
  rawInput: string;
  status: HistoryStatus;
  messageReport?: ScanReport | null;
  urlReport?: UrlReport | null;
}): HistoryEntry {
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

  historyStore.entries.set(entry.id, entry);
  return entry;
}

/** All entries belonging to one user, newest first. */
export function listUserHistory(userId: string): HistoryListItem[] {
  return [...historyStore.entries.values()]
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
export function getUserHistoryEntry(
  userId: string,
  entryId: string
): HistoryEntry | null {
  const entry = historyStore.entries.get(entryId);
  if (!entry || entry.userId !== userId) return null;
  return entry;
}

/** Returns true when something was actually deleted. */
export function deleteUserHistoryEntry(
  userId: string,
  entryId: string
): boolean {
  // Check ownership first; delete must never succeed cross-user.
  if (!getUserHistoryEntry(userId, entryId)) return false;
  historyStore.entries.delete(entryId);
  return true;
}

export function deleteAllUserHistory(userId: string): number {
  let deleted = 0;
  for (const [id, entry] of historyStore.entries) {
    if (entry.userId === userId) {
      historyStore.entries.delete(id);
      deleted += 1;
    }
  }
  return deleted;
}
