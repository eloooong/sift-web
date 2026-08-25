import type { RiskLevel } from "@/lib/scam-detector";
import type { ScamCategoryId } from "@/lib/scam-detector/categories";

export const REPORT_PLATFORMS = [
  "sms",
  "messenger",
  "viber",
  "whatsapp",
  "instagram",
  "tiktok",
  "email",
  "marketplace",
  "dating-app",
  "phone-call",
  "other",
] as const;

export type ReportPlatform = (typeof REPORT_PLATFORMS)[number];

export const PLATFORM_LABELS: Record<ReportPlatform, string> = {
  sms: "SMS",
  messenger: "Messenger",
  viber: "Viber",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  tiktok: "TikTok",
  email: "Email",
  marketplace: "Marketplace",
  "dating-app": "Dating app",
  "phone-call": "Phone call",
  other: "Other",
};

export function isReportPlatform(value: unknown): value is ReportPlatform {
  return (
    typeof value === "string" &&
    (REPORT_PLATFORMS as readonly string[]).includes(value)
  );
}

export type ModerationStatus = "pending" | "approved" | "rejected";

/** Screenshot kept in memory as a validated data URL. Never executed, only rendered. */
export type StoredScreenshot = {
  mime: "image/png" | "image/jpeg" | "image/webp";
  dataUrl: string;
  byteSize: number;
};

export type CommunityReport = {
  id: string;
  categoryId: ScamCategoryId;
  platform: ReportPlatform;
  description: string;
  shortDescription: string;
  /** Masked scammer handle/domain, never the reporter's own details. */
  sender: string | null;
  screenshot: StoredScreenshot | null;
  encounteredAt: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: ModerationStatus;
  confirmations: number;
  /** Anonymous client tokens used for one-confirm-per-visitor. Internal only. */
  confirmedTokens: Set<string>;
  createdAt: string;
  moderatedAt: string | null;
  rejectionReason: string | null;
};

/** What the public feed receives: no internals, no screenshot payloads. */
export type PublicReportSummary = {
  id: string;
  categoryId: ScamCategoryId;
  categoryLabel: string;
  platform: ReportPlatform;
  platformLabel: string;
  shortDescription: string;
  sender: string | null;
  encounteredAt: string;
  createdAt: string;
  riskScore: number;
  riskLevel: RiskLevel;
  confirmations: number;
  hasScreenshot: boolean;
};

export type ReportsMeta = {
  approvedCount: number;
  awaitingReview: number;
  totalConfirmations: number;
};

export const ANON_COOKIE = "ss_anon";
