import type { Metadata } from "next";
import Link from "next/link";
import { Camera, ChevronRight, Clock3, Inbox, Link2, MessageSquareWarning, ScanLine } from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import {
  DeleteAllHistoryButton,
  DeleteScanButton,
} from "@/components/history/delete-controls";
import { RiskBadge } from "@/components/shared/risk-badge";
import { requireUser } from "@/lib/auth/session";
import { listUserHistory } from "@/lib/history/store";
import type { HistoryScanType } from "@/lib/history/store";

export const metadata: Metadata = {
  title: "Scan history",
  description: "Your private history of past scam scans.",
};

const SCAN_TYPE_META: Record<
  HistoryScanType,
  { label: string; Icon: typeof ScanLine }
> = {
  message: { label: "Message", Icon: MessageSquareWarning },
  screenshot: { label: "Screenshot", Icon: Camera },
  url: { label: "Link", Icon: Link2 },
};

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} · ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export default async function HistoryPage() {
  // Server-side guard; unauthenticated visitors never reach the data.
  const user = await requireUser("/history");
  const entries = await listUserHistory(user.id);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
      <FadeIn className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="mt-2 page-title">
            Scan history
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Scans you ran while signed in. Only your account can see these.
          </p>
        </div>
        <DeleteAllHistoryButton count={entries.length} signedIn />
      </FadeIn>

      {entries.length === 0 ? (
        <FadeIn delay={0.04}>
          <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed p-10 text-center">
            <Inbox aria-hidden="true" className="size-7 text-muted-foreground" />
            <p className="mt-4 text-sm font-medium">No scans yet</p>
            <p className="mt-1 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Run a scan while signed in and it will show up here so you can
              revisit the full result anytime.
            </p>
            <Button asChild className="mt-5 h-11 px-5 sm:h-8 sm:px-2.5">
              <Link href="/scanner">
                <ScanLine aria-hidden="true" />
                Try the scanner
              </Link>
            </Button>
          </div>
        </FadeIn>
      ) : (
        <ul className="mt-8 flex flex-col gap-2.5">
          {entries.map((entry, index) => {
            const meta = SCAN_TYPE_META[entry.scanType];
            const failed = entry.status === "failed";
            return (
              <li key={entry.id}>
                <FadeIn delay={Math.min(index * 0.04, 0.24)}>
                  <article className="flex items-center gap-3 rounded-xl bg-card p-3.5 ring-1 ring-foreground/10 sm:p-4">
                    <span
                      aria-hidden="true"
                      title={meta.label}
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                    >
                      <meta.Icon className="size-4" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                          {meta.label}
                        </span>
                        <span
                          className={
                            failed
                              ? "inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-medium text-danger"
                              : "inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success"
                          }
                        >
                          {failed ? "Failed" : "Completed"}
                        </span>
                      </div>

                      <Link
                        href={`/history/${entry.id}`}
                        className="mt-0.5 block truncate text-sm font-medium hover:underline"
                      >
                        {entry.inputPreview || "(no text)"}
                      </Link>

                      <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground tabular-nums">
                        <Clock3 aria-hidden="true" className="size-3" />
                        {formatDateTime(entry.createdAt)}
                        {!failed && entry.categoryLabel ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-sans">{entry.categoryLabel}</span>
                          </>
                        ) : null}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                      {failed || entry.riskScore === null ? (
                        <span className="font-mono text-[11px] text-muted-foreground">
                          no score
                        </span>
                      ) : (
                        <>
                          <span className="hidden font-mono text-sm font-semibold tabular-nums md:inline">
                            {entry.riskScore}
                            <span className="text-[10px] font-normal text-muted-foreground">/100</span>
                          </span>
                          <RiskBadge level={entry.riskLevel!} />
                        </>
                      )}

                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-10 px-3 sm:h-7"
                      >
                        <Link href={`/history/${entry.id}`} aria-label="Open scan result">
                          Open
                        </Link>
                      </Button>

                      <DeleteScanButton entryId={entry.id} />
                    </div>
                  </article>
                </FadeIn>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-8 flex items-center gap-1.5 text-xs leading-relaxed text-muted-foreground">
        <ChevronRight aria-hidden="true" className="size-3.5" />
        History lives in this demo server&apos;s memory and resets on restart.
      </p>
    </div>
  );
}
