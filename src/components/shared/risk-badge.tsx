"use client";

import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/scam-detector";

import { useLang } from "@/components/providers/language-provider";

const RISK_BADGE_STYLES: Record<
  RiskLevel,
  { label: string; badgeClassName: string; dotClassName: string }
> = {
  low: {
    label: "Low Risk",
    badgeClassName: "border-success/30 bg-success/10 text-success",
    dotClassName: "bg-success",
  },
  medium: {
    label: "Moderate Risk",
    badgeClassName: "border-warning/30 bg-warning/10 text-warning",
    dotClassName: "bg-warning",
  },
  high: {
    label: "High Risk",
    badgeClassName: "border-danger/30 bg-danger/10 text-danger",
    dotClassName: "bg-danger",
  },
  critical: {
    label: "Critical",
    badgeClassName: "border-danger bg-danger text-white",
    dotClassName: "bg-white",
  },
};

const RISK_LABEL_KEY = {
  low: "risk.low",
  medium: "risk.medium",
  high: "risk.high",
  critical: "risk.critical",
} as const;

export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel;
  className?: string;
}) {
  const style = RISK_BADGE_STYLES[level];
  const { t } = useLang();

  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        style.badgeClassName,
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", style.dotClassName)}
      />
      {t(RISK_LABEL_KEY[level])}
    </span>
  );
}
