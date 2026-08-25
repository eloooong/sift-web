import type { RiskLevel } from "@/lib/scam-detector";

import type { RiskSlice } from "@/lib/dashboard/demo-data";
import { formatInt, formatPct } from "@/lib/dashboard/demo-data";

const BAR_COLORS: Record<RiskLevel, string> = {
  low: "var(--success)",
  medium: "var(--warning)",
  high: "var(--danger)",
  critical: "color-mix(in oklab, var(--danger), black 35%)",
};

const WIDTH = 340;
const HEIGHT = 252;
const PAD = { top: 26, right: 8, bottom: 46, left: 40 };
const GRID_TICKS = 3;

function niceCeil(value: number): number {
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  return Math.ceil(value / (pow / 2)) * (pow / 2);
}

export function RiskBars({ risks }: { risks: RiskSlice[] }) {
  const innerWidth = WIDTH - PAD.left - PAD.right;
  const innerHeight = HEIGHT - PAD.top - PAD.bottom;
  const max = Math.max(...risks.map((risk) => risk.count));
  const yMax = niceCeil(Math.max(max, 1));

  const band = innerWidth / risks.length;
  const barWidth = Math.min(band * 0.52, 52);

  return (
    <div className="flex h-full flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <div>
        <h2 className="font-heading text-base leading-snug font-medium">
          Risk Distribution
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          How scanned messages scored
        </p>
      </div>

      <div className="mx-auto mt-2 flex w-full max-w-[440px] flex-1 items-center">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`Bar chart of risk levels: ${risks
            .map((risk) => `${risk.label} ${formatInt(risk.count)} scans (${formatPct(risk.share, 0)})`)
            .join(", ")}.`}
          className="w-full"
        >
        {/* Gridlines */}
        {Array.from({ length: GRID_TICKS + 1 }, (_, tick) => {
          const value = (yMax / GRID_TICKS) * tick;
          const y = PAD.top + innerHeight * (1 - value / yMax);
          return (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={y}
                y2={y}
                className="stroke-border"
                strokeDasharray={tick === 0 ? undefined : "3 5"}
              />
              <text
                x={PAD.left - 8}
                y={y + 3}
                textAnchor="end"
                className="fill-muted-foreground font-mono text-[10px] tabular-nums"
              >
                {value >= 1000 ? `${Math.round(value / 1000)}k` : value}
              </text>
            </g>
          );
        })}

        {risks.map((risk, index) => {
          const barHeight = Math.max((risk.count / yMax) * innerHeight, 2);
          const x =
            PAD.left + band * index + (band - barWidth) / 2;
          const y = PAD.top + innerHeight - barHeight;

          return (
            <g key={risk.level} className="group">
              <title>{`${risk.label}: ${formatInt(risk.count)} scans — ${risk.description}`}</title>

              {/* Invisible hover target spanning the full band */}
              <rect
                x={PAD.left + band * index}
                y={PAD.top - 12}
                width={band}
                height={innerHeight + 12}
                fill="transparent"
              />

              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={5}
                fill={BAR_COLORS[risk.level]}
                className="opacity-90 transition-opacity group-hover:opacity-100"
              />

              <text
                x={x + barWidth / 2}
                y={y - 7}
                textAnchor="middle"
                className="fill-foreground font-mono text-[11px] font-semibold tabular-nums"
              >
                {formatInt(risk.count)}
              </text>

              <text
                x={x + barWidth / 2}
                y={PAD.top + innerHeight + 18}
                textAnchor="middle"
                className="fill-foreground text-[11px] font-semibold"
              >
                {risk.label}
              </text>
              <text
                x={x + barWidth / 2}
                y={PAD.top + innerHeight + 32}
                textAnchor="middle"
                className="fill-muted-foreground font-mono text-[10px] tabular-nums"
              >
                {formatPct(risk.share, 0)}
              </text>
            </g>
          );
        })}
        </svg>
      </div>

      <p className="mt-4 border-t pt-3 text-xs leading-relaxed text-muted-foreground">
        Scores come from the hybrid rule + AI engine. Critical means the message
        matched multiple high-weight scam signals.
      </p>
    </div>
  );
}
