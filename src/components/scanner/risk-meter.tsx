"use client";

import { useLang } from "@/components/providers/language-provider";
import { RISK_LEVEL_RANGES } from "@/lib/scam-detector/scoring";
import type { RiskLevel } from "@/lib/scam-detector";
import { cn } from "@/lib/utils";

const LEVEL_STYLES = {
  low: { label: "risk.meter.low", track: "bg-success/20", fill: "bg-success" },
  medium: {
    label: "risk.meter.medium",
    track: "bg-warning/20",
    fill: "bg-warning",
  },
  high: {
    label: "risk.meter.high",
    track: "bg-risk-meter/20",
    fill: "bg-risk-meter",
  },
  critical: {
    label: "risk.meter.critical",
    track: "bg-danger/20",
    fill: "bg-danger",
  },
} as const;

const SEGMENTS = RISK_LEVEL_RANGES.map((range, index) => ({
  ...range,
  width: (RISK_LEVEL_RANGES[index + 1]?.min ?? 100) - range.min,
}));
const GRID_COLUMNS = SEGMENTS.map((segment) => `${segment.width}fr`).join(" ");

export function RiskMeter({
  score,
  level,
}: {
  score: number;
  level: RiskLevel;
}) {
  const { t } = useLang();
  const position = Math.max(0, Math.min(100, score));

  return (
    <div
      role="meter"
      aria-label={t("risk.meter.label")}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={position}
      aria-valuetext={`${t(LEVEL_STYLES[level].label)}, ${position}/100`}
    >
      <div className="relative" aria-hidden="true">
        <div
          className="grid h-3 overflow-hidden rounded-full"
          style={{ gridTemplateColumns: GRID_COLUMNS }}
        >
          {SEGMENTS.map((segment) => {
            const style = LEVEL_STYLES[segment.level];
            const fraction = Math.max(
              0,
              Math.min(1, (position - segment.min) / segment.width),
            );
            return (
              <div
                key={segment.level}
                className={cn(
                  "relative h-full border-r border-card last:border-r-0",
                  style.track,
                )}
              >
                <span
                  data-slot="risk-segment-fill"
                  className={cn(
                    "absolute inset-0 origin-left motion-safe:transition-transform motion-safe:duration-300",
                    style.fill,
                  )}
                  style={{ transform: `scaleX(${fraction})` }}
                />
              </div>
            );
          })}
        </div>
        <span
          data-slot="risk-position"
          className="absolute -top-1 h-5 w-1 -translate-x-1/2 rounded-full bg-foreground ring-2 ring-card"
          style={{ left: `clamp(2px, ${position}%, calc(100% - 2px))` }}
        />
      </div>
      <div
        aria-hidden="true"
        className="mt-3 grid gap-1 text-center text-xs leading-tight"
        style={{ gridTemplateColumns: GRID_COLUMNS }}
      >
        {SEGMENTS.map((segment) => (
          <span
            key={segment.level}
            className={cn(
              segment.level === level
                ? "font-semibold text-foreground"
                : "text-muted-foreground",
            )}
          >
            {t(LEVEL_STYLES[segment.level].label)}
          </span>
        ))}
      </div>
    </div>
  );
}
