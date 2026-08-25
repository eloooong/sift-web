import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Ban,
  Hourglass,
  Inbox,
  Lock,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { CategoryBadge } from "@/components/shared/category-badge";
import { RiskBadge } from "@/components/shared/risk-badge";
import { FadeIn } from "@/components/shared/fade-in";
import { scamCategoryById } from "@/lib/scam-detector/categories";
import {
  getMeta,
  listPendingReports,
  listRecentlyModerated,
} from "@/lib/reports/store";
import type { CommunityReport } from "@/lib/reports/types";
import { PLATFORM_LABELS } from "@/lib/reports/types";
import { formatDay, timeAgo } from "@/lib/reports/time-ago";
import {
  isModerator,
  moderateReportAction,
  signInModerator,
  signOutModerator,
} from "./actions";

export const metadata: Metadata = {
  title: "Moderation | ScamShield PH",
  description: "Moderator queue for community scam reports.",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ error?: string }>;

export default async function ModerationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [{ error }, moderator] = await Promise.all([
    searchParams,
    isModerator(),
  ]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <FadeIn>
        <p className="font-mono text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
          Internal
        </p>
        <h1 className="mt-2 flex items-center gap-2.5 text-3xl font-semibold tracking-tight">
          <ShieldCheck aria-hidden="true" className="size-7 text-success" />
          Report moderation
        </h1>
      </FadeIn>

      {!moderator ? (
        <FadeIn delay={1}>
          <SignInCard error={error === "invalid" || error === "expired" ? error : null} />
        </FadeIn>
      ) : (
        <QueueView />
      )}
    </div>
  );
}

function SignInCard({ error }: { error: string | null }) {
  return (
    <form
      action={signInModerator}
      className="mx-auto mt-10 flex w-full max-w-sm flex-col gap-3 rounded-xl bg-card p-6 ring-1 ring-foreground/10"
    >
      <span className="inline-flex size-10 items-center justify-center self-center rounded-full bg-muted">
        <Lock aria-hidden="true" className="size-4" />
      </span>
      <p className="text-center text-sm leading-relaxed text-muted-foreground">
        This area is for moderators only. Enter the access token to review
        pending reports.
      </p>

      {error ? (
        <p role="alert" className="text-center text-xs text-danger">
          {error === "expired"
            ? "Session expired. Sign in again."
            : "That token is incorrect."}
        </p>
      ) : null}

      <label
        htmlFor="mod-token"
        className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase"
      >
        Access token
      </label>
      <input
        id="mod-token"
        name="token"
        type="password"
        required
        autoComplete="off"
        className="h-10 rounded-lg border bg-background px-3 font-mono text-sm outline-none transition-colors focus:border-ring"
      />
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Sign in
      </button>
      <p className="text-center text-[11px] text-muted-foreground/70">
        Demo default: <code>scamshield-demo</code> (set MODERATION_TOKEN in env)
      </p>
    </form>
  );
}

async function QueueView() {
  const [pending, recent, meta] = await Promise.all([
    listPendingReports(),
    listRecentlyModerated(8),
    getMeta(),
  ]);

  return (
    <div className="mt-8 flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <Stat label="Pending" value={meta.awaitingReview} icon={<Hourglass aria-hidden="true" className="size-3.5" />} />
        <Stat label="Approved" value={meta.approvedCount} icon={<BadgeCheck aria-hidden="true" className="size-3.5" />} />
        <button
          type="submit"
          form="mod-signout"
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut aria-hidden="true" className="size-3.5" />
          Sign out
        </button>
      </div>

      <section aria-labelledby="pending-heading" className="flex flex-col gap-3">
        <h2 id="pending-heading" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          Pending review
          <span className="rounded-full bg-warning/15 px-2 py-0.5 font-mono text-[10px] text-warning-foreground tabular-nums">
            {pending.length}
          </span>
        </h2>

        {pending.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="flex flex-col gap-3">
            {pending.map((report) => (
              <li key={report.id}>
                <PendingItem report={report} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="recent-heading" className="flex flex-col gap-3">
        <h2 id="recent-heading" className="text-lg font-semibold tracking-tight">
          Recently moderated
        </h2>
        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            Nothing moderated yet.
          </p>
        ) : (
          <ul className="flex flex-col divide-y rounded-xl bg-card ring-1 ring-foreground/10">
            {recent.map((report) => {
              const category = scamCategoryById(report.categoryId);
              const rejected = report.status === "rejected";
              return (
                <li key={report.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-sm">
                  <span
                    className={
                      rejected
                        ? "inline-flex items-center gap-1 font-medium text-danger"
                        : "inline-flex items-center gap-1 font-medium text-success"
                    }
                  >
                    {rejected ? (
                      <Ban aria-hidden="true" className="size-3.5" />
                    ) : (
                      <BadgeCheck aria-hidden="true" className="size-3.5" />
                    )}
                    {rejected ? "Rejected" : "Approved"}
                  </span>
                  <span className="text-muted-foreground">{category.label}</span>
                  <span className="truncate text-muted-foreground/80">{report.shortDescription}</span>
                  <span className="ml-auto font-mono text-[11px] text-muted-foreground tabular-nums">
                    {report.id}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Sign-out target lives outside the header button's parent form */}
      <form id="mod-signout" action={signOutModerator} />
    </div>
  );
}

/** Full detail card rendered server-side per pending report. */
function PendingItem({ report }: { report: CommunityReport }) {
  const category = scamCategoryById(report.categoryId);

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <CategoryBadge category={category} />
        <span className="rounded-full border border-dashed px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
          {PLATFORM_LABELS[report.platform]}
        </span>
        <RiskBadge level={report.riskLevel} />
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">
          {timeAgo(report.createdAt)}
        </span>
      </div>

      <p className="max-h-40 overflow-y-auto text-sm leading-relaxed whitespace-pre-line text-foreground/90">
        {report.description}
      </p>

      <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-muted-foreground">
        <span>ref {report.id}</span>
        <span>enc. {formatDay(report.encounteredAt)}</span>
        {report.sender ? <span className="break-all">handle: {report.sender}</span> : null}
        {report.screenshot ? (
          <span>{(report.screenshot.byteSize / 1024).toFixed(0)} KB screenshot attached</span>
        ) : null}
      </div>

      {report.screenshot ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={report.screenshot.dataUrl}
          alt={`Screenshot for ${report.id}`}
          className="max-h-56 w-auto rounded-lg ring-1 ring-foreground/10"
        />
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-3">
        <form action={moderateReportAction}>
          <input type="hidden" name="id" value={report.id} />
          <input type="hidden" name="status" value="approved" />
          <SubmitChip tone="approve" />
        </form>
        <form action={moderateReportAction}>
          <input type="hidden" name="id" value={report.id} />
          <input type="hidden" name="status" value="rejected" />
          <SubmitChip tone="reject" />
        </form>
      </div>
    </article>
  );
}

function SubmitChip({ tone }: { tone: "approve" | "reject" }) {
  const approve = tone === "approve";
  return (
    <button
      type="submit"
      className={
        approve
          ? "inline-flex items-center gap-1.5 rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success/20"
          : "inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/20"
      }
    >
      {approve ? (
        <>
          <BadgeCheck aria-hidden="true" className="size-3.5" />
          Approve & publish
        </>
      ) : (
        <>
          <Ban aria-hidden="true" className="size-3.5" />
          Reject
        </>
      )}
    </button>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-baseline gap-1.5 text-sm">
      <span className="text-muted-foreground">{icon}</span>
      <span className="font-semibold tabular-nums">{value}</span>
      <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed p-8 text-center">
      <Inbox aria-hidden="true" className="size-6 text-muted-foreground" />
      <p className="mt-3 text-sm font-medium">Queue is clear</p>
      <p className="mt-1 text-sm text-muted-foreground">
        New submissions will appear here for review.
      </p>
      <Link
        href="/reports"
        className="mt-3 text-sm underline hover:text-foreground"
      >
        Back to public feed
      </Link>
    </div>
  );
}
