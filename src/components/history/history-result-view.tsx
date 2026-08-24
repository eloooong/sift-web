"use client";

import { useRouter } from "next/navigation";

import { ReportView } from "@/components/scanner/report-view";
import { UrlReportView } from "@/components/scanner/url-report-view";
import type { ScanReport } from "@/lib/scan-report";
import type { UrlReport } from "@/lib/url-analyzer";

/**
 * Reopens a stored result with the exact views used by the live scanner —
 * only the "scan again" action is rewired to navigate back to the scanner.
 */
export function HistoryMessageResult({
  report,
  analyzedText,
}: {
  report: ScanReport;
  analyzedText: string;
}) {
  const router = useRouter();
  return (
    <ReportView
      report={report}
      analyzedText={analyzedText}
      onReset={() => router.push("/scanner")}
    />
  );
}

export function HistoryUrlResult({ report }: { report: UrlReport }) {
  const router = useRouter();
  return <UrlReportView report={report} onReset={() => router.push("/scanner/url")} />;
}
