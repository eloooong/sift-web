import { ExternalLink } from "lucide-react";

import {
  PH_SCAM_MESSAGES,
  REGIONAL_INCIDENTS,
} from "@/lib/dataset/ph-scam-messages";

const SORTED = [...REGIONAL_INCIDENTS].sort((a, b) => b.rate - a.rate);

const ROW_H = 18;
const PAD = { top: 4, right: 48, bottom: 4, left: 100 };
const HEIGHT = PAD.top + PAD.bottom + SORTED.length * ROW_H;
const INNER_W = 440;
const WIDTH = PAD.left + INNER_W + PAD.right;
const GRID_TICKS = 4;

function niceCeil(value: number): number {
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  return Math.ceil(value / (pow / 2)) * (pow / 2);
}

const yMax = niceCeil(SORTED[0].rate);

function barColor(rate: number, rank: number): string {
  if (rank < 3) return "var(--danger)";
  if (rate >= 1000) return "color-mix(in oklab, var(--warning), var(--danger) 30%)";
  if (rate >= 300) return "var(--warning)";
  return "var(--chart-2)";
}

export function RegionalIncidentsCard() {
  return (
    <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h2 className="font-heading text-base leading-snug font-medium">
            Scam Incidents by Region
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Reported text scam incidents per 100,000 population across Philippine
            regions
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
          17 regions
        </span>
      </div>

      <div className="mx-auto mt-5 w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`Horizontal bar chart of scam incidents per 100k by region. Highest: ${SORTED[0].region} at ${Math.round(SORTED[0].rate)}, lowest: ${SORTED[SORTED.length - 1].region} at ${Math.round(SORTED[SORTED.length - 1].rate)}.`}
          className="w-full"
          style={{ minWidth: 420 }}
        >
          {/* Gridlines */}
          {Array.from({ length: GRID_TICKS + 1 }, (_, tick) => {
            const value = (yMax / GRID_TICKS) * tick;
            const x = PAD.left + (value / yMax) * INNER_W;
            return (
              <g key={tick}>
                <line
                  x1={x}
                  x2={x}
                  y1={PAD.top}
                  y2={HEIGHT - PAD.bottom}
                  className="stroke-border"
                  strokeDasharray={tick === 0 ? undefined : "2 4"}
                />
                <text
                  x={x}
                  y={HEIGHT - PAD.bottom + 14}
                  textAnchor="middle"
                  className="fill-muted-foreground font-mono text-[9px] tabular-nums"
                >
                  {value >= 1000
                    ? `${Math.round(value / 1000)}k`
                    : Math.round(value)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {SORTED.map((incident, index) => {
            const barW = Math.max((incident.rate / yMax) * INNER_W, 2);
            const y = PAD.top + index * ROW_H;
            const midY = y + ROW_H / 2;

            return (
              <g key={incident.region} className="group">
                <title>
                  {`${incident.region}: ${incident.rate.toLocaleString("en-US", { maximumFractionDigits: 0 })} incidents per 100k`}
                </title>

                {/* Hover target */}
                <rect
                  x={0}
                  y={y}
                  width={WIDTH}
                  height={ROW_H}
                  fill="transparent"
                />

                {/* Region label */}
                <text
                  x={PAD.left - 6}
                  y={midY + 1}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-foreground text-[10px] font-medium"
                >
                  {incident.region}
                </text>

                {/* Bar */}
                <rect
                  x={PAD.left}
                  y={y + 3}
                  width={barW}
                  height={ROW_H - 6}
                  rx={2}
                  fill={barColor(incident.rate, index)}
                  className="opacity-85 transition-opacity group-hover:opacity-100"
                />

                {/* Value label */}
                <text
                  x={PAD.left + barW + 6}
                  y={midY + 1}
                  dominantBaseline="middle"
                  className="fill-muted-foreground font-mono text-[10px] tabular-nums"
                >
                  {Math.round(incident.rate).toLocaleString("en-US")}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm bg-[var(--danger)]" />
          Top 3 highest
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm bg-[var(--warning)]" />
          1,000+
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm bg-[var(--chart-2)]" />
          Below 300
        </span>
      </div>

      <p className="mt-4 border-t border-border/70 pt-3 text-xs leading-relaxed text-muted-foreground">
        Source:{" "}
        <a
          href={PH_SCAM_MESSAGES.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-medium text-foreground underline-offset-2 hover:text-primary hover:underline"
        >
          {PH_SCAM_MESSAGES.source.name}
          <ExternalLink aria-hidden="true" className="size-3" />
        </a>{" "}
        by {PH_SCAM_MESSAGES.source.publisher}. Incidents per 100k population
        based on NTC-reported data. Regions with higher urbanization and
        population density show significantly elevated rates.
      </p>
    </div>
  );
}
