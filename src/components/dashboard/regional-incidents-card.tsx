import { ExternalLink } from "lucide-react";

import {
  PH_SCAM_MESSAGES,
  REGIONAL_INCIDENTS,
  type RegionalIncident,
} from "@/lib/dataset/ph-scam-messages";

const ACCENT = "var(--chart-2)";

const MAX_RATE = Math.max(...REGIONAL_INCIDENTS.map((r) => r.rate));

function IncidentRow({
  incident,
  rank,
}: {
  incident: RegionalIncident;
  rank: number;
}) {
  const width = `${Math.max((incident.rate / MAX_RATE) * 100, 1)}%`;
  const isTop3 = rank < 3;

  return (
    <div className="group">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="min-w-0 truncate font-medium">{incident.region}</span>
        <span className="shrink-0 font-mono text-xs whitespace-nowrap text-muted-foreground tabular-nums">
          {incident.rate.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}{" "}
          <span className="text-foreground/70">per 100k</span>
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full opacity-80 transition-opacity group-hover:opacity-100"
          style={{
            width,
            background: isTop3 ? "var(--danger)" : ACCENT,
          }}
        />
      </div>
    </div>
  );
}

export function RegionalIncidentsCard() {
  const sorted = [...REGIONAL_INCIDENTS].sort((a, b) => b.rate - a.rate);

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

      <div className="mt-6 space-y-3">
        {sorted.map((incident, index) => (
          <IncidentRow
            key={incident.region}
            incident={incident}
            rank={index}
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2.5 border-t border-border/70 pt-4">
        <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
          <p className="font-mono text-lg leading-none font-semibold tabular-nums">
            {sorted[0].rate.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
          </p>
          <p className="mt-1.5 text-xs leading-tight text-muted-foreground">
            Highest rate ({sorted[0].region})
          </p>
        </div>
        <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
          <p className="font-mono text-lg leading-none font-semibold tabular-nums">
            {Math.round(
              REGIONAL_INCIDENTS.reduce((sum, r) => sum + r.rate, 0) /
                REGIONAL_INCIDENTS.length
            ).toLocaleString("en-US")}
          </p>
          <p className="mt-1.5 text-xs leading-tight text-muted-foreground">
            Average across regions
          </p>
        </div>
        <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
          <p className="font-mono text-lg leading-none font-semibold tabular-nums">
            {sorted[sorted.length - 1].rate.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
          </p>
          <p className="mt-1.5 text-xs leading-tight text-muted-foreground">
            Lowest rate ({sorted[sorted.length - 1].region})
          </p>
        </div>
      </div>

      <p className="mt-5 border-t border-border/70 pt-3 text-xs leading-relaxed text-muted-foreground">
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
