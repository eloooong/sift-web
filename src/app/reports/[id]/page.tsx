import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ArrowLeft, BadgeCheck, ImagePlus } from "lucide-react";

import { CategoryBadge } from "@/components/shared/category-badge";
import { RiskBadge } from "@/components/shared/risk-badge";
import { FadeIn } from "@/components/shared/fade-in";
import { ConfirmButton } from "@/components/reports/confirm-button";
import { scamCategoryById } from "@/lib/scam-detector/categories";
import {
  getApprovedReport,
  hasConfirmed,
} from "@/lib/reports/store";
import { ANON_COOKIE, PLATFORM_LABELS } from "@/lib/reports/types";
import { formatDay, timeAgo } from "@/lib/reports/time-ago";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const report = await getApprovedReport(id);
  if (!report) return { title: "Report not found" };
  const category = scamCategoryById(report.categoryId);
  return {
    title: `${category.label} report ${report.id}`,
    description: report.shortDescription,
  };
}

export default async function ReportDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const report = await getApprovedReport(id);
  if (!report) notFound();

  // Initial confirmed state for the anonymous visitor.
  let initiallyConfirmed = false;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ANON_COOKIE)?.value;
    if (token && (await hasConfirmed(report.id, token))) {
      initiallyConfirmed = true;
    }
  } catch {
    // Cookie access unavailable; treat as not confirmed.
  }

  const category = scamCategoryById(report.categoryId);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/reports"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        All reports
      </Link>

      <FadeIn className="mt-4">
        <article className="rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={category} />
            <span className="rounded-full border border-dashed px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
              {PLATFORM_LABELS[report.platform]}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
              <BadgeCheck aria-hidden="true" className="size-3.5" />
              Moderator approved
            </span>
            <span className="ml-auto font-mono text-[11px] text-muted-foreground">
              {timeAgo(report.createdAt)}
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3">
              <p className="text-3xl leading-none font-semibold tracking-tight tabular-nums">
                {report.riskScore}
              </p>
              <div className="flex flex-col gap-1.5">
                <RiskBadge level={report.riskLevel} />
                <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
                  rules engine
                </span>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  Encountered
                </dt>
                <dd className="mt-0.5">{formatDay(report.encounteredAt)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  Reference
                </dt>
                <dd className="mt-0.5 font-mono text-xs">{report.id}</dd>
              </div>
            </dl>
          </div>

          {report.sender ? (
            <div className="mt-4 rounded-lg border border-dashed px-3 py-2.5">
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                Reported handle / domain (masked)
              </p>
              <p className="mt-1 font-mono text-sm break-all">{report.sender}</p>
            </div>
          ) : null}

          <h1 className="sr-only">
            {category.label} scam report via {PLATFORM_LABELS[report.platform]}
          </h1>
          <p className="mt-5 text-sm leading-relaxed whitespace-pre-line text-foreground/90">
            {report.description}
          </p>

          {report.screenshot ? (
            <figure className="mt-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={report.screenshot.dataUrl}
                alt={`Screenshot attached to report ${report.id}`}
                className="max-h-96 w-auto rounded-lg ring-1 ring-foreground/10"
              />
              <figcaption className="mt-1.5 inline-flex items-center gap-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                <ImagePlus aria-hidden="true" className="size-3" />
                attached screenshot · {(report.screenshot.byteSize / 1024).toFixed(0)} KB · verify before trusting
              </figcaption>
            </figure>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <ConfirmButton
              reportId={report.id}
              initialCount={report.confirmations}
              initiallyConfirmed={initiallyConfirmed}
              size="lg"
            />
            <p className="text-xs text-muted-foreground">
              One confirmation per visitor.
            </p>
          </div>
        </article>
      </FadeIn>

      <FadeIn delay={1}>
        <div className="mt-6 rounded-xl border border-dashed p-5">
          <h2 className="text-sm font-semibold">Received something similar?</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Don&apos;t engage; run it through the{" "}
            <Link href="/" className="underline hover:text-foreground">
              scanner
            </Link>{" "}
            or{" "}
            <Link href="/reports" className="underline hover:text-foreground">
              submit your own report
            </Link>{" "}
            so others get warned too.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
