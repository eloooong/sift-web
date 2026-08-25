"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import type { TrendPoint } from "@/lib/dashboard/demo-data";
import { cn } from "@/lib/utils";

const PAD = { top: 14, right: 10, bottom: 30, left: 44 };
const ACCENT = "var(--chart-1)";
const DANGER = "var(--chart-5)";
const GRID_TICKS = 4;

function niceCeil(value: number): number {
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  return Math.ceil(value / (pow / 2)) * (pow / 2);
}

export function TrendChart({ series }: { series: TrendPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientId = useId();
  const [width, setWidth] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    setWidth(el.getBoundingClientRect().width);
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (width === 0 || series.length < 2) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const innerWidth = width - PAD.left - PAD.right;
      const ratio =
        (event.clientX - bounds.left - PAD.left) / Math.max(innerWidth, 1);
      const index = Math.round(ratio * (series.length - 1));
      setHoverIndex(Math.min(Math.max(index, 0), series.length - 1));
    },
    [series.length, width]
  );

  const compactHeight = width > 0 && width < 420;
  const height = compactHeight ? 210 : 270;
  const innerWidth = Math.max(width - PAD.left - PAD.right, 0);
  const innerHeight = height - PAD.top - PAD.bottom;

  const totals = series.map((point) => point.total);
  const highRisks = series.map((point) => point.highRisk);
  const yMax = niceCeil(Math.max(...totals, 1));
  const stepX = series.length > 1 ? innerWidth / (series.length - 1) : 0;

  const xAt = (index: number) => PAD.left + index * stepX;
  const yAt = (value: number) => PAD.top + innerHeight * (1 - value / yMax);

  const linePath = (values: number[]) =>
    values
      .map(
        (value, index) =>
          `${index === 0 ? "M" : "L"}${xAt(index).toFixed(1)},${yAt(value).toFixed(1)}`
      )
      .join(" ");

  const areaPath =
    totals.length > 1
      ? `${linePath(totals)} L${xAt(totals.length - 1).toFixed(1)},${(
          PAD.top + innerHeight
        ).toFixed(1)} L${PAD.left},${(PAD.top + innerHeight).toFixed(1)} Z`
      : "";

  // Fewer x labels when space is tight.
  const tickEvery = compactHeight ? 7 : width < 640 ? 5 : 4;

  const hover = hoverIndex !== null ? series[hoverIndex] : null;
  const tooltipLeft =
    hoverIndex !== null
      ? Math.min(Math.max(xAt(hoverIndex), 72), Math.max(width - 72, 72))
      : 0;

  return (
    <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h2 className="font-heading text-base leading-snug font-medium">
            Spam Volume Over Time
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Corpus texts per month · Nov 2022 – Aug 2024
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-0.5 w-4 rounded-full"
              style={{ background: ACCENT }}
            />
            Texts
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-0 w-4 border-t-2 border-dashed"
              style={{ borderColor: DANGER }}
            />
            Flagged (40+)
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative mt-4 touch-none select-none"
        style={{ height }}
        onPointerMove={handleMove}
        onPointerLeave={() => setHoverIndex(null)}
      >
        {width === 0 ? (
          <div
            role="status"
            aria-label="Loading chart"
            className="h-full animate-pulse rounded-lg bg-muted/50"
          />
        ) : (
          <>
            <svg
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-label={`Line chart of monthly corpus volume. Totals range from ${Math.min(...totals)} to ${yMax} texts per month.`}
              className="block"
            >
              <defs>
                <linearGradient
                  id={gradientId}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={ACCENT} stopOpacity={0.16} />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Horizontal gridlines + y labels */}
              {Array.from({ length: GRID_TICKS + 1 }, (_, tick) => {
                const value = (yMax / GRID_TICKS) * tick;
                const y = yAt(value);
                return (
                  <g key={tick}>
                    <line
                      x1={PAD.left}
                      x2={width - PAD.right}
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
                      {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                    </text>
                  </g>
                );
              })}

              {/* X labels */}
              {series.map((point, index) =>
                index % tickEvery === 0 || index === series.length - 1 ? (
                  <text
                    key={point.iso}
                    x={xAt(index)}
                    y={height - 9}
                    textAnchor={
                      index === 0
                        ? "start"
                        : index === series.length - 1
                          ? "end"
                          : "middle"
                    }
                    className="fill-muted-foreground font-mono text-[10px]"
                  >
                    {point.label}
                  </text>
                ) : null
              )}

              <path d={areaPath} fill={`url(#${gradientId})`} />

              <path
                d={linePath(totals)}
                fill="none"
                stroke={ACCENT}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d={linePath(highRisks)}
                fill="none"
                stroke={DANGER}
                strokeWidth={1.75}
                strokeDasharray="5 4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {hoverIndex !== null ? (
                <g>
                  <line
                    x1={xAt(hoverIndex)}
                    x2={xAt(hoverIndex)}
                    y1={PAD.top}
                    y2={PAD.top + innerHeight}
                    className="stroke-foreground/25"
                  />
                  <circle
                    cx={xAt(hoverIndex)}
                    cy={yAt(series[hoverIndex].total)}
                    r={4}
                    fill={ACCENT}
                    className="stroke-card"
                    strokeWidth={2}
                  />
                  <circle
                    cx={xAt(hoverIndex)}
                    cy={yAt(series[hoverIndex].highRisk)}
                    r={3.5}
                    fill={DANGER}
                    className="stroke-card"
                    strokeWidth={2}
                  />
                </g>
              ) : null}
            </svg>

            {hover && hoverIndex !== null ? (
              <div
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute z-10 w-max -translate-x-1/2 -translate-y-full rounded-lg",
                  "border bg-popover px-3 py-2 shadow-md"
                )}
                style={{
                  left: tooltipLeft,
                  top: Math.min(
                    yAt(hover.total),
                    yAt(hover.highRisk)
                  ) - 12,
                }}
              >
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  {hover.label}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs tabular-nums">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full"
                    style={{ background: ACCENT }}
                  />
                  {hover.total} texts
                </p>
                <p className="flex items-center gap-1.5 text-xs tabular-nums">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full"
                    style={{ background: DANGER }}
                  />
                  {hover.highRisk} flagged
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
