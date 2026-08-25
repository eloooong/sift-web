import { ExternalLink } from "lucide-react";

import {
  PH_SCAM_MESSAGES,
  NETWORK_DISTRIBUTION,
  TOP_KEYWORDS,
  type NetworkSlice,
  type KeywordEntry,
} from "@/lib/dataset/ph-scam-messages";

function formatPct(share: number): string {
  return `${(share * 100).toFixed(1)}%`;
}

const NETWORK_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-5)",
];

function NetworkRow({
  slice,
  index,
}: {
  slice: NetworkSlice;
  index: number;
}) {
  const width = `${Math.max(slice.share * 100, 1)}%`;

  return (
    <div className="group">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="min-w-0 truncate font-medium">{slice.network}</span>
        <span className="shrink-0 font-mono text-xs whitespace-nowrap text-muted-foreground tabular-nums">
          {formatPct(slice.share)}{" "}
          <span className="text-foreground/70">
            · {slice.count.toLocaleString("en-US")}
          </span>
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full opacity-80 transition-opacity group-hover:opacity-100"
          style={{ width, background: NETWORK_COLORS[index] }}
        />
      </div>
    </div>
  );
}

function KeywordChip({ entry }: { entry: KeywordEntry }) {
  return (
    <span
      title={`${entry.count} messages contain "${entry.word}"`}
      className="inline-flex items-baseline gap-1.5 rounded-full border bg-background px-2.5 py-1"
    >
      <span className="font-mono text-xs font-semibold lowercase">
        {entry.word}
      </span>
      <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
        {entry.count}
      </span>
    </span>
  );
}

export function NetworkBreakdownCard() {
  const topKeywords = TOP_KEYWORDS.slice(0, 12);

  return (
    <div className="flex h-full flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h2 className="font-heading text-base leading-snug font-medium">
            Network &amp; Keyword Analysis
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Which telcos are most exploited and what scammers write
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
          5,545 reports
        </span>
      </div>

      <div className="mt-6 grid gap-y-6 border-t border-border/70 pt-6 max-lg:gap-6 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-border/70">
        <div className="min-w-0 lg:pr-8">
          <section aria-label="Telecom network distribution">
            <h3 className="text-sm font-semibold">By network</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Smart/TNT carries nearly two-thirds of scam traffic
            </p>
            <div className="mt-4 space-y-3.5">
              {NETWORK_DISTRIBUTION.map((slice, index) => (
                <NetworkRow key={slice.network} slice={slice} index={index} />
              ))}
            </div>
          </section>
        </div>

        <div className="min-w-0 lg:pl-8">
          <section aria-label="Most common scam keywords">
            <h3 className="text-sm font-semibold">Top keywords</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Most frequent words across classified messages
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {topKeywords.map((entry) => (
                <KeywordChip key={entry.word} entry={entry} />
              ))}
            </div>
          </section>
        </div>
      </div>

      <p className="mt-6 border-t border-border/70 pt-3 text-xs leading-relaxed text-muted-foreground">
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
        by {PH_SCAM_MESSAGES.source.publisher}. Network data from 5,351
        identifiable records; keywords from 1,415 NLP-classified messages.
      </p>
    </div>
  );
}
