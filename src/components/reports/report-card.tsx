import Link from "next/link";
import { ImagePlus } from "lucide-react";

import { CategoryBadge } from "@/components/shared/category-badge";
import { RiskBadge } from "@/components/shared/risk-badge";
import { ConfirmButton } from "@/components/reports/confirm-button";
import { scamCategoryById } from "@/lib/scam-detector/categories";
import type { PublicReportSummary } from "@/lib/reports/types";
import { formatDay, timeAgo } from "@/lib/reports/time-ago";

export function ReportCard({
  report,
  confirmed,
}: {
  report: PublicReportSummary;
  confirmed: boolean;
}) {
  return (
    <article className="flex flex-col rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <CategoryBadge category={scamCategoryById(report.categoryId)} />
        <span className="rounded-full border border-dashed px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {report.platformLabel}
        </span>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">
          {timeAgo(report.createdAt)}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/90">
        {report.shortDescription}
      </p>

      {report.sender ? (
        <p className="mt-2 truncate font-mono text-[11px] text-muted-foreground">
          <span className="text-muted-foreground/70">handle:</span>{" "}
          {report.sender}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t pt-3">
        <RiskBadge level={report.riskLevel} />
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          score {report.riskScore} · enc. {formatDay(report.encounteredAt)}
        </span>
        {report.hasScreenshot ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <ImagePlus aria-hidden="true" className="size-3" />
            screenshot
          </span>
        ) : null}

        <div className="ml-auto flex items-center gap-2">
          <ConfirmButton
            reportId={report.id}
            initialCount={report.confirmations}
            initiallyConfirmed={confirmed}
          />
          <Link
            href={`/reports/${report.id}`}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
