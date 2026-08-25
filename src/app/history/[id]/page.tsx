import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Info,
  Link2,
  MessageSquareWarning,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import {
  HistoryMessageResult,
  HistoryUrlResult,
} from "@/components/history/history-result-view";
import { requireUser } from "@/lib/auth/session";
import { getUserHistoryEntry } from "@/lib/history/store";

type Params = Promise<{ id: string }>;

export const metadata: Metadata = {
  title: "Saved scan result",
};

const SCAN_TYPE_LABELS = {
  message: { label: "Message scan", Icon: MessageSquareWarning },
  screenshot: { label: "Screenshot scan", Icon: Camera },
  url: { label: "Link scan", Icon: Link2 },
} as const;

export default async function HistoryDetailPage({ params }: { params: Params }) {
  // Guard + ownership check happen server-side; anything else is notFound.
  const user = await requireUser("/history");
  const { id } = await params;
  const entry = await getUserHistoryEntry(user.id, id);
  if (!entry) notFound();

  const meta = SCAN_TYPE_LABELS[entry.scanType];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/history"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to history
      </Link>

      <FadeIn className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/60 px-2.5 py-0.5 text-xs font-medium">
          <meta.Icon aria-hidden="true" className="size-3 text-muted-foreground" />
          {meta.label}
        </span>
        <span
          className={
            entry.status === "completed"
              ? "rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success"
              : "rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-medium text-danger"
          }
        >
          {entry.status === "completed" ? "Completed" : "Failed"}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          saved {new Date(entry.createdAt).toLocaleString("en-PH", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      </FadeIn>

      <div className="mt-6">
        {entry.status === "failed" ? (
          <FadeIn delay={0.05}>
            <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed p-6">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-danger">
                <TriangleAlert aria-hidden="true" className="size-4" />
                This scan didn&apos;t complete
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The analysis failed before a report could be produced. You can
                run it again in the scanner.
              </p>
              <p className="mt-2 w-full rounded-lg border bg-muted/40 p-3 font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap">
                {entry.inputPreview}
              </p>
              <Button asChild variant="outline" className="mt-1 h-11 px-5 sm:h-8 sm:px-3">
                <Link href={entry.scanType === "url" ? "/scanner/url" : "/scanner"}>
                  <RotateCcw aria-hidden="true" />
                  Scan again
                </Link>
              </Button>
            </div>
          </FadeIn>
        ) : entry.messageReport ? (
          <HistoryMessageResult
            report={entry.messageReport}
            analyzedText={entry.fullInput}
          />
        ) : entry.urlReport ? (
          <HistoryUrlResult report={entry.urlReport} />
        ) : (
          <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed p-6">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Info aria-hidden="true" className="size-4" />
              No report content stored
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This scan finished, but its full report is no longer available in
              this demo server&apos;s memory. Run the scan again to regenerate
              it.
            </p>
            <Button asChild variant="outline" className="mt-1 h-11 px-5 sm:h-8 sm:px-3">
              <Link href={entry.scanType === "url" ? "/scanner/url" : "/scanner"}>
                <RotateCcw aria-hidden="true" />
                Scan again
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
