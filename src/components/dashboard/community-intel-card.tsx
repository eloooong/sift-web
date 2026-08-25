import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { CommunityIntelStats } from "@/lib/intel/ph-scam-db";

const REPO_URL = "https://github.com/wgtechlabs/ph-scam-db";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatBlock({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="mt-1 font-mono text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );
}

/**
 * Live community threat intelligence from the PH Scam DB project
 * (MIT-licensed open dataset of reported Philippine scam numbers).
 */
export function CommunityIntelCard({
  stats,
}: {
  stats: CommunityIntelStats | null;
}) {
  return (
    <section
      aria-labelledby="community-intel-heading"
      className="rounded-xl bg-card p-5 ring-1 ring-foreground/10"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h2
            id="community-intel-heading"
            className="font-heading text-base leading-snug font-medium"
          >
            Community threat intel
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Reported Philippine scam numbers from the open PH Scam DB project.
          </p>
        </div>
        <Link
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
        >
          PH Scam DB
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>

      {stats ? (
        <>
          <div className="mt-5 grid gap-5 sm:grid-cols-4">
            <StatBlock
              value={String(stats.trackedNumbers)}
              label="Tracked numbers"
            />
            <StatBlock
              value={String(stats.confirmedCount)}
              label="Confirmed"
            />
            <StatBlock value={String(stats.blockCount)} label="Block verdicts" />
            <div>
              <p className="truncate text-sm leading-7 font-medium">
                {stats.topCategory
                  ? stats.topCategory.category.replace(/-/g, " ")
                  : "N/A"}
              </p>
              <p className="mt-1 font-mono text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
                Most reported
              </p>
            </div>
          </div>

          <p className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
            <span>
              Entries are community reports, not legal findings; absence from
              the list does not mean a number is safe.
            </span>
            <span className="shrink-0 tabular-nums">
              Updated {formatDate(stats.fetchedAt)}
            </span>
          </p>
        </>
      ) : (
        <p className="mt-5 rounded-lg border border-dashed px-3.5 py-3 text-sm leading-relaxed text-muted-foreground">
          The community intel feed is unavailable right now. Scans still work;
          this section will fill in automatically once the feed is reachable.
        </p>
      )}
    </section>
  );
}
