import type { LucideIcon } from "lucide-react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Flag,
  ScanSearch,
  ShieldAlert,
} from "lucide-react";

import type { DashboardData } from "@/lib/dashboard/demo-data";
import { formatInt, formatPct } from "@/lib/dashboard/demo-data";
import { cn } from "@/lib/utils";

type StatTone = "neutral" | "positive" | "negative";

const TONE_STYLES: Record<StatTone, string> = {
  neutral: "text-foreground bg-muted",
  positive: "text-success bg-success/10",
  negative: "text-danger bg-danger/10",
};

function DeltaChip({ pct, tone }: { pct: number; tone: StatTone }) {
  const isUp = pct >= 0;
  const Arrow = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums",
        TONE_STYLES[tone]
      )}
    >
      <Arrow aria-hidden="true" className="size-3" />
      {isUp ? "+" : "−"}
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

function Sparkline({
  points,
  className,
}: {
  points: number[];
  className?: string;
}) {
  const width = 112;
  const height = 36;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = Math.max(max - min, 1);

  const step = width / (points.length - 1);
  const path = points
    .map((value, index) => {
      const x = index * step;
      const y = height - 3 - ((value - min) / span) * (height - 6);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className={cn("h-9 w-28", className)}
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCard({
  icon: Icon,
  label,
  children,
  footer,
  className,
}: {
  icon?: LucideIcon;
  label: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
          {label}
        </p>
        {Icon ? (
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-dashed text-muted-foreground"
          >
            <Icon className="size-3.5" />
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex-1">{children}</div>

      {footer ? (
        <div className="mt-4 flex items-center gap-2 border-t pt-3">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

export function StatCards({ data }: { data: DashboardData }) {
  const { stats, deltas, topCategory, trendSeries } = data;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={ScanSearch}
        label="Total Scans"
        footer={
          <>
            <DeltaChip pct={deltas.totalScansPct} tone="neutral" />
            <span className="text-xs text-muted-foreground">vs prev. period</span>
          </>
        }
      >
        <p className="text-3xl font-semibold tracking-tight tabular-nums">
          {formatInt(stats.totalScans)}
        </p>
        <Sparkline
          points={trendSeries.map((point) => point.total)}
          className="mt-2 self-start text-primary/70"
        />
      </StatCard>

      <StatCard
        icon={ShieldAlert}
        label="High Risk Scans"
        footer={
          <>
            <DeltaChip pct={deltas.highRiskPct} tone="positive" />
            <span className="text-xs text-muted-foreground">
              {formatPct(stats.highRiskShare, 0)} of all scans
            </span>
          </>
        }
      >
        <p className="text-3xl font-semibold tracking-tight tabular-nums text-danger">
          {formatInt(stats.highRiskScans)}
        </p>
        <Sparkline
          points={trendSeries.map((point) => point.highRisk)}
          className="mt-2 self-start text-danger/70"
        />
      </StatCard>

      <StatCard
        icon={Flag}
        label="Reports Submitted"
        footer={
          <>
            <DeltaChip pct={deltas.reportsPct} tone="positive" />
            <span className="text-xs text-muted-foreground">vs prev. period</span>
          </>
        }
      >
        <p className="text-3xl font-semibold tracking-tight tabular-nums">
          {formatInt(stats.reportsSubmitted)}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Forwarded by users to telcos, banks &amp; the NTC.
        </p>
      </StatCard>

      <StatCard
        label="Most Common Scam"
        footer={
          <span className="font-mono text-xs text-muted-foreground">
            usually arrives via {topCategory.channel}
          </span>
        }
      >
        <>
          <p className="text-lg leading-snug font-semibold tracking-tight">
            {topCategory.label}
          </p>
          <div
            role="img"
            aria-label={`${topCategory.label} accounts for ${formatPct(topCategory.share)} of all scans`}
            className="mt-3"
          >
            <div className="flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
              <span className="tabular-nums">
                {formatInt(topCategory.count)} scans
              </span>
              <span className="font-mono font-semibold text-foreground tabular-nums">
                {formatPct(topCategory.share)}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-danger/80"
                style={{ width: `${Math.max(topCategory.share * 100, 2)}%` }}
              />
            </div>
          </div>
        </>
      </StatCard>
    </div>
  );
}
