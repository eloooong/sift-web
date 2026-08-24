import type { LucideIcon } from "lucide-react";
import {
  Camera,
  Link2,
  Mail,
  MessageSquare,
  MessagesSquare,
} from "lucide-react";

import { RiskBadge } from "@/components/shared/risk-badge";
import type {
  ScanRowView,
  ScanStatus,
  ScanType,
} from "@/lib/dashboard/demo-data";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<ScanType, LucideIcon> = {
  SMS: MessageSquare,
  Email: Mail,
  Chat: MessagesSquare,
  Screenshot: Camera,
  URL: Link2,
};

const STATUS_STYLES: Record<
  ScanStatus,
  { label: string; className: string }
> = {
  reported: {
    label: "Reported",
    className: "border-primary/25 bg-primary/5 text-foreground",
  },
  flagged: {
    label: "Flagged",
    className: "border-warning/30 bg-warning/10 text-warning",
  },
  review: {
    label: "Under review",
    className: "border-dashed text-muted-foreground",
  },
  cleared: {
    label: "Cleared",
    className: "border-success/30 bg-success/10 text-success",
  },
};

function StatusChip({ status }: { status: ScanStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        style.className
      )}
    >
      {style.label}
    </span>
  );
}

function TypeCell({ type }: { type: ScanType }) {
  const Icon = TYPE_ICONS[type];
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="flex size-7 shrink-0 items-center justify-center rounded-md border bg-muted/50"
      >
        <Icon className="size-3.5 text-muted-foreground" />
      </span>
      <span className="text-sm font-medium">{type}</span>
    </span>
  );
}

export function RecentScansTable({ scans }: { scans: ScanRowView[] }) {
  return (
    <div className="flex h-full flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <div>
          <h2 className="font-heading text-base leading-snug font-medium">
            Recent Scans
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Latest messages and links run through the engine
          </p>
        </div>
        <span className="rounded-full border border-dashed px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
          live feed paused
        </span>
      </div>

      {/* Desktop table */}
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">
            Recently scanned messages with their scam category, risk level,
            scan date, and follow-up status
          </caption>
          <thead>
            <tr className="border-b">
              {["Type", "Category", "Risk", "Date", "Status"].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className={cn(
                    "pb-2.5 font-mono text-[11px] font-medium tracking-widest text-muted-foreground uppercase",
                    heading === "Date" || heading === "Status"
                      ? "text-right"
                      : ""
                  )}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {scans.map((scan) => (
              <tr
                key={scan.id}
                className="transition-colors hover:bg-muted/40"
              >
                <td className="py-3 pr-4">
                  <TypeCell type={scan.type} />
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm">{scan.categoryLabel}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {scan.channel}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <RiskBadge level={scan.riskLevel} />
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {scan.riskScore}
                    </span>
                  </span>
                </td>
                <td className="py-3 pl-4 text-right align-middle">
                  <p className="font-mono text-xs tabular-nums">
                    {scan.dateLabel}
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    {scan.timeLabel}
                  </p>
                </td>
                <td className="py-3 pl-4 text-right">
                  <StatusChip status={scan.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <ul className="mt-2 divide-y md:hidden">
        {scans.map((scan) => (
          <li key={scan.id} className="space-y-2 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <TypeCell type={scan.type} />
              <p className="font-mono text-[11px] whitespace-nowrap text-muted-foreground tabular-nums">
                {scan.dateLabel} · {scan.timeLabel}
              </p>
            </div>
            <div className="pl-9.5">
              <p className="text-sm">{scan.categoryLabel}</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                {scan.channel}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 pl-9.5">
              <RiskBadge level={scan.riskLevel} />
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                score {scan.riskScore}
              </span>
              <span className="ml-auto">
                <StatusChip status={scan.status} />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
