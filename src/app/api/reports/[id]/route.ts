import { NextResponse } from "next/server";

import { scamCategoryById } from "@/lib/scam-detector/categories";
import { getApprovedReport } from "@/lib/reports/store";
import { PLATFORM_LABELS } from "@/lib/reports/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public detail payload. Internals (anon confirmation tokens, moderation
 * bookkeeping) are deliberately omitted; only whitelisted fields ship.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report = await getApprovedReport(id);

  if (!report) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Report not found." } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    report: {
      id: report.id,
      categoryLabel: scamCategoryById(report.categoryId).label,
      platformLabel: PLATFORM_LABELS[report.platform],
      description: report.description,
      sender: report.sender,
      encounteredAt: report.encounteredAt,
      createdAt: report.createdAt,
      riskScore: report.riskScore,
      riskLevel: report.riskLevel,
      confirmations: report.confirmations,
      screenshotMeta: report.screenshot
        ? { mime: report.screenshot.mime, byteSize: report.screenshot.byteSize }
        : null,
    },
  });
}
