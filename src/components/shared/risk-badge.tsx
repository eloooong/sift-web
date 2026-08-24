import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/scam-detector";

const RISK_BADGE_STYLES: Record<
  RiskLevel,
  { label: string; badgeClassName: string; dotClassName: string }
> = {
  low: {
    label: "Low Risk",
    badgeClassName: "border-green-200 bg-green-50 text-green-700",
    dotClassName: "bg-green-500",
  },
  medium: {
    label: "Moderate Risk",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
    dotClassName: "bg-amber-500",
  },
  high: {
    label: "High Risk",
    badgeClassName: "border-red-200 bg-red-50 text-red-700",
    dotClassName: "bg-red-500",
  },
  critical: {
    label: "Critical",
    badgeClassName: "border-red-600 bg-red-600 text-white",
    dotClassName: "bg-white",
  },
};

export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel;
  className?: string;
}) {
  const style = RISK_BADGE_STYLES[level];

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
      {style.label}
    </span>
  );
}
