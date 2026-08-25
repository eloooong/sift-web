"use client";

import { useState } from "react";

import type { CategorySlice } from "@/lib/dashboard/demo-data";
import { formatInt, formatPct } from "@/lib/dashboard/demo-data";
import { cn } from "@/lib/utils";

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--success)",
  "var(--chart-5)",
  "var(--muted-foreground)",
];

const OTHER_COLOR = "color-mix(in oklab, var(--muted-foreground), transparent 35%)";
const SIZE = 208;
const RADIUS = 78;
const STROKE = 24;
const ACTIVE_STROKE = 30;
const GAP_DEGREES = 2.4;

type DisplaySlice = {
  key: string;
  label: string;
  count: number;
  share: number;
  color: string;
};

/** Fold the long tail into a single "Other patterns" slice for readability. */
function toDisplaySlices(categories: CategorySlice[]): DisplaySlice[] {
  const head = categories.slice(0, PALETTE.length);
  const tail = categories.slice(PALETTE.length);

  const slices: DisplaySlice[] = head.map((slice, index) => ({
    key: slice.categoryId,
    label: slice.label,
    count: slice.count,
    share: slice.share,
    color: PALETTE[index],
  }));

  if (tail.length > 0) {
    const tailCount = tail.reduce((sum, slice) => sum + slice.count, 0);
    slices.push({
      key: "other-patterns",
      label: "Other patterns",
      count: tailCount,
      share: tailCount / categories.reduce((sum, s) => sum + s.count, 0),
      color: OTHER_COLOR,
    });
  }

  return slices;
}

export function CategoryDonut({ categories }: { categories: CategorySlice[] }) {
  const slices = toDisplaySlices(categories);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const total = slices.reduce((sum, slice) => sum + slice.count, 0);
  const active = slices.find((slice) => slice.key === activeKey) ?? null;

  const circumference = 2 * Math.PI * RADIUS;
  const gapRatio = GAP_DEGREES / 360;

  // Precompute arc positions starting from 12 o'clock.
  type Segment = DisplaySlice & { dash: number; offset: number; end: number };
  const segments = slices.reduce<Segment[]>((acc, slice) => {
    const start = acc.length === 0 ? 0.25 : acc[acc.length - 1].end;
    const sweep = Math.max(slice.share - gapRatio, 0.004);
    acc.push({
      ...slice,
      dash: sweep * circumference,
      end: start + slice.share,
      offset: -start * circumference,
    });
    return acc;
  }, []);

  return (
    <div className="@container flex h-full flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <div>
        <h2 className="font-heading text-base leading-snug font-medium">
          Scam Categories
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Share of scans by scam pattern
        </p>
      </div>

      {/* Row only when the card itself is wide enough: container query, not viewport. */}
      <div className="mt-2 flex flex-1 flex-col items-center justify-center gap-5 @[460px]:flex-row @[460px]:items-center @[460px]:gap-6">
        <div className="relative shrink-0">
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            aria-hidden="true"
          >
            {segments.map((segment) => {
              const isActive = activeKey === segment.key;
              const isDimmed = activeKey !== null && !isActive;

              return (
                <circle
                  key={segment.key}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={isActive ? ACTIVE_STROKE : STROKE}
                  strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
                  strokeDashoffset={segment.offset}
                  opacity={isDimmed ? 0.3 : 1}
                  onMouseEnter={() => setActiveKey(segment.key)}
                  onMouseLeave={() => setActiveKey(null)}
                  className="cursor-pointer transition-[stroke-width,opacity] duration-150"
                />
              );
            })}
          </svg>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-10 text-center"
          >
            {active ? (
              <>
                <p className="text-2xl font-semibold tracking-tight tabular-nums">
                  {formatPct(active.share, 0)}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
                  {active.label}
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-semibold tracking-tight tabular-nums">
                  {formatInt(total)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  scans classified
                </p>
              </>
            )}
          </div>
        </div>

        <ul className="w-full min-w-0 flex-1 space-y-1 @[460px]:max-w-64">
          {slices.map((slice) => {
            const isActive = activeKey === slice.key;

            return (
              <li key={slice.key}>
                <button
                  type="button"
                  onPointerEnter={() => setActiveKey(slice.key)}
                  onPointerLeave={() => setActiveKey(null)}
                  onFocus={() => setActiveKey(slice.key)}
                  onBlur={() => setActiveKey(null)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors",
                    isActive ? "bg-muted" : "hover:bg-muted/60"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: slice.color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-xs font-medium">
                    {slice.label}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {formatPct(slice.share, 0)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
