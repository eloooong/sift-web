import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

import { analyzeMessage } from "@/lib/scam-detector";import {
  SCAM_CATEGORIES,
  type ScamCategoryId,
} from "@/lib/scam-detector/categories";
import { detectImageType } from "@/lib/screenshots";
import {
  requestContentLengthExceeds,
  requestSameOrigin,
} from "@/lib/http/guards";
import {
  countUrls,
  descriptionFingerprint,
  sanitizeSenderHandle,
  sanitizeText,
} from "@/lib/reports/sanitize";
import { rateLimit } from "@/lib/reports/rate-limit";
import {
  createReport,
  getMeta,
  listApprovedReports,
  reportsStore,
} from "@/lib/reports/store";
import {
  ANON_COOKIE,
  isReportPlatform,
  type StoredScreenshot,
} from "@/lib/reports/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_DESCRIPTION_CHARS = 2000;
const MIN_DESCRIPTION_CHARS = 30;
/** Community screenshots are smaller than OCR uploads — they are kept in memory. */
export const MAX_REPORT_SCREENSHOT_BYTES = 2 * 1024 * 1024;
const MAX_URLS_IN_DESCRIPTION = 5;
const ENCOUNTERED_MAX_AGE_MS = 3 * 365 * 86_400_000;

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function isCategoryId(value: string): value is ScamCategoryId {
  return SCAM_CATEGORIES.some((category) => category.id === value);
}

/** Opaque per-client key for rate limiting — hashed IP + UA, never stored elsewhere. */
function clientKey(request: Request): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local";
  const ua = request.headers.get("user-agent") ?? "";
  return createHash("sha256").update(`${ip}|${ua}`).digest("hex").slice(0, 32);
}

function anonToken(request: Request): string | undefined {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ANON_COOKIE}=`))
    ?.slice(ANON_COOKIE.length + 1);
}

export async function GET(request: Request) {
  const token = anonToken(request);
  const confirmedIds = token
    ? [...reportsStore.reports.entries()]
        .filter(([, report]) => report.confirmedTokens.has(token))
        .map(([id]) => id)
    : [];

  return NextResponse.json({
    reports: listApprovedReports(),
    meta: getMeta(),
    confirmedIds,
  });
}

export async function POST(request: Request) {
  // --- CSRF / origin check --------------------------------------------------
  if (!requestSameOrigin(request)) {
    return jsonError(403, "forbidden_origin", "This request didn't come from ScamShield.");
  }

  // --- Request size precheck (multipart buffers in memory) -------------------
  if (requestContentLengthExceeds(request, MAX_REPORT_SCREENSHOT_BYTES + 256 * 1024)) {
    return jsonError(413, "too_large", "Screenshots must be 2 MB or less.");
  }

  // --- Rate limiting -------------------------------------------------------
  const limit = rateLimit(`report:${clientKey(request)}`, 3, 15 * 60_000);
  if (!limit.ok) {
    return jsonError(
      429,
      "rate_limited",
      `Too many reports submitted. Please try again in about ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError(400, "bad_request", "We couldn't read that submission.");
  }

  // Honeypot — real users never see this field.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return jsonError(400, "spam_detected", "This submission looked automated.");
  }

  // --- Field validation ----------------------------------------------------
  const categoryId = String(formData.get("category") ?? "");
  if (!isCategoryId(categoryId)) {
    return jsonError(400, "invalid_category", "Choose a scam category.");
  }

  const platform = formData.get("platform");
  if (!isReportPlatform(platform)) {
    return jsonError(400, "invalid_platform", "Choose where you encountered it.");
  }

  const rawDescription = String(formData.get("description") ?? "");
  const description = sanitizeText(rawDescription, MAX_DESCRIPTION_CHARS);
  if (description.length < MIN_DESCRIPTION_CHARS) {
    return jsonError(
      400,
      "description_too_short",
      `Describe what happened in at least ${MIN_DESCRIPTION_CHARS} characters.`
    );
  }

  // Date encountered — day precision only.
  const encounteredRaw = String(formData.get("encounteredAt") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(encounteredRaw)) {
    return jsonError(400, "invalid_date", "Enter the date you encountered it.");
  }
  const encounteredMs = Date.parse(`${encounteredRaw}T00:00:00Z`);
  const nowMs = Date.now();
  if (
    Number.isNaN(encounteredMs) ||
    encounteredMs > nowMs + 86_400_000 ||
    nowMs - encounteredMs > ENCOUNTERED_MAX_AGE_MS
  ) {
    return jsonError(
      400,
      "invalid_date",
      "That date doesn't look right. Use a past date within the last 3 years."
    );
  }

  const sender = sanitizeSenderHandle(String(formData.get("sender") ?? ""));

  // --- Optional screenshot --------------------------------------------------
  let screenshot: StoredScreenshot | null = null;
  const file = formData.get("screenshot");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_REPORT_SCREENSHOT_BYTES) {
      return jsonError(
        413,
        "too_large",
        "Screenshots must be 2 MB or less."
      );
    }
    const reportFileName = (file.name || "").toLowerCase();
    const reportExtension = reportFileName.includes(".")
      ? reportFileName.slice(reportFileName.lastIndexOf(".") + 1)
      : "";
    if (
      reportExtension &&
      !["png", "jpg", "jpeg", "webp"].includes(reportExtension)
    ) {
      return jsonError(
        400,
        "unsupported_type",
        "Only PNG, JPG, or WebP screenshots are accepted."
      );
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const format = detectImageType(bytes);
    if (!format) {
      return jsonError(
        400,
        "unsupported_type",
        "Only PNG, JPG, or WebP screenshots are accepted."
      );
    }
    const mime: StoredScreenshot["mime"] = `image/${format}`;
    screenshot = {
      mime,
      byteSize: bytes.byteLength,
      dataUrl: `data:${mime};base64,${Buffer.from(bytes).toString("base64")}`,
    };
  }

  // --- Risk derivation (rules engine — no external calls) -------------------
  const analysis = analyzeMessage(description);

  // --- Basic auto-moderation -------------------------------------------------
  let status: "pending" | "rejected" = "pending";
  let rejectionReason: string | null = null;

  if (countUrls(description) > MAX_URLS_IN_DESCRIPTION) {
    status = "rejected";
    rejectionReason = "spam-links";
  } else if (/(\b<script\b|javascript:|\bon\w+\s*=)/i.test(description)) {
    status = "rejected";
    rejectionReason = "malicious-content";
  } else {
    const fingerprint = descriptionFingerprint(description);
    for (const existing of reportsStore.reports.values()) {
      if (descriptionFingerprint(existing.description) === fingerprint) {
        status = "rejected";
        rejectionReason = "duplicate";
        break;
      }
    }
  }

  const report = createReport({
    categoryId,
    platform,
    description,
    sender,
    screenshot,
    encounteredAt: encounteredRaw,
    riskScore: analysis.riskScore,
    status,
    rejectionReason,
  });

  return NextResponse.json(
    {
      ok: true,
      id: report.id,
      status: report.status,
      message:
        report.status === "approved"
          ? "Report published."
          : report.status === "pending"
            ? "Received — your report is awaiting moderation before it appears publicly."
            : "This report was flagged by automatic checks and won't be published.",
    },
    { status: 201 }
  );
}
