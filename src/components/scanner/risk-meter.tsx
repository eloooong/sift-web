"use client";

import { motion } from "framer-motion";

import type { RiskLevel } from "@/lib/scam-detector";
import { cn } from "@/lib/utils";

const SEGMENTS: Array<{
  level: RiskLevel;
  label: string;
  width: number;
  color: string;
}> = [
  { level: "low", label: "Low", width: 30, color: "var(--success)" },
  { level: "medium", label: "Moderate", width: 30, color: "var(--warning)" },
  { level: "high", label: "High", width: 20, color: "var(--risk-meter)" },
  { level: "critical", label: "Critical", width: 20, color: "var(--danger)" },
];

export function RiskMeter({
  score,
  level,
}: {
  score: number;
  level: RiskLevel;
}) {
  const activeSegment = SEGMENTS.find((segment) => segment.level === level);

  return (
    <div
      role="meter"
      aria-label={`Risk score ${score} out of 100`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={score}
    >
      <div className="relative h-3 overflow-hidden rounded-full bg-muted">
        <div className="absolute inset-0 flex">
          {SEGMENTS.map((segment) => (
            <div
              key={segment.level}
              className="h-full opacity-25"
              style={{
                width: `${segment.width}%`,
                backgroundColor: segment.color,
              }}
            />
          ))}
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background:
              "linear-gradient(to right, var(--success) 0%, var(--success) 30%, var(--warning) 30%, var(--warning) 60%, var(--risk-meter) 60%, var(--risk-meter) 80%, var(--danger) 80%, var(--danger) 100%)",
          }}
        />
        {[30, 60, 80].map((tick) => (
          <span
            key={tick}
            aria-hidden="true"
            className="absolute inset-y-0 w-px bg-background/90"
            style={{ left: `${tick}%` }}
          />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="mt-1.5 grid text-center text-[10px] font-medium uppercase tracking-wider"
        style={{ gridTemplateColumns: "30% 30% 20% 20%" }}
      >
        {SEGMENTS.map((segment) => {
          const active = segment.level === level;
          return (
            <span
              key={segment.level}
              className={cn(!active && "text-muted-foreground/70")}
              style={active ? { color: segment.color } : undefined}
            >
              {segment.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
