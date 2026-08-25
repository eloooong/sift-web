import { ExternalLink } from "lucide-react";

import {
  SPAM_CORPUS,
  corpusShare,
  type CorpusFamily,
} from "@/lib/corpus/spam-corpus-insights";

const ACCENT = "var(--chart-1)";
const MUTED_BAR = "var(--muted-foreground)";

function formatPct(share: number): string {
  return `${(share * 100).toFixed(1)}%`;
}

function formatPctRounded(share: number): string {
  return `${Math.round(share * 100)}%`;
}

function StatCell({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
      <p className="font-mono text-lg leading-none font-semibold tabular-nums">
        {value}
      </p>
      <p className="mt-1.5 text-xs leading-tight text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function FamilyRow({ family, max }: { family: CorpusFamily; max: number }) {
  const isMixed = family.id === "other";
  const barColor = isMixed ? MUTED_BAR : ACCENT;
  const width = `${Math.max(Math.sqrt(family.count / max) * 100, 4)}%`;

  return (
    <div className="group" title={family.hint}>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="min-w-0 truncate font-medium">{family.label}</span>
        <span className="shrink-0 font-mono text-xs whitespace-nowrap text-muted-foreground tabular-nums">
          {formatPct(corpusShare(family.count))}{" "}
          <span className="text-foreground/70">· {family.count}</span>
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full opacity-80 transition-opacity group-hover:opacity-100"
          style={{ width, background: barColor }}
        />
      </div>
    </div>
  );
}

function KeywordRow({
  term,
  count,
  max,
}: {
  term: string;
  count: number;
  max: number;
}) {
  const width = `${Math.max((count / max) * 100, 2)}%`;

  return (
    <div className="group flex items-center gap-3" title={`${count} messages contain “${term}”`}>
      <span className="w-16 shrink-0 truncate font-mono text-[13px] font-medium lowercase">
        {term}
      </span>
      <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full opacity-80 transition-opacity group-hover:opacity-100"
          style={{ width, background: ACCENT }}
        />
      </div>
      <span className="w-24 shrink-0 text-right font-mono text-xs whitespace-nowrap text-muted-foreground tabular-nums">
        {formatPctRounded(corpusShare(count))} · {count}
      </span>
    </div>
  );
}

export function CorpusInsightsCard() {
  const { totals, families, keywords, tlds } = SPAM_CORPUS;
  const familyMax = Math.max(...families.map((family) => family.count));
  const keywordMax = Math.max(...keywords.map((keyword) => keyword.count));

  return (
    <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h2 className="font-heading text-base leading-snug font-medium">
            What real PH spam looks like
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Aggregate patterns from {totals.messages.toLocaleString("en-US")}{" "}
            real spam texts shared by Filipino users
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
          Research dataset
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2.5 border-t border-border/70 pt-5 sm:grid-cols-4">
        <StatCell
          value={totals.messages.toLocaleString("en-US")}
          label="spam & promo texts analyzed"
        />
        <StatCell
          value={formatPctRounded(corpusShare(totals.withLinks))}
          label="contained a clickable link"
        />
        <StatCell
          value={formatPctRounded(corpusShare(totals.withPesoAmounts))}
          label="dangled a peso amount"
        />
        <StatCell
          value={formatPctRounded(
            totals.numericSenders / totals.messages
          )}
          label="sent from raw phone numbers"
        />
      </div>

      <div className="mt-6 grid gap-y-6 border-t border-border/70 pt-6 max-lg:gap-6 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-border/70">
        <div className="min-w-0 space-y-6 lg:pr-8">
          <section aria-label="Share of corpus by message family">
            <h3 className="text-sm font-semibold">Threat mix</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Each message grouped once, by its strongest signal — hover for
              examples
            </p>
            <div className="mt-4 space-y-3.5">
              {families.map((family) => (
                <FamilyRow key={family.id} family={family} max={familyMax} />
              ))}
            </div>
          </section>

          <section
            aria-label="High-risk domain endings in links"
            className="border-t border-border/70 pt-4"
          >
            <h3 className="text-sm font-semibold">
              High-risk domain endings in links
            </h3>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {tlds.map((entry) => (
                <li
                  key={entry.tld}
                  title={`${entry.count} linked hosts used this ending`}
                  className="inline-flex items-baseline gap-1.5 rounded-full border bg-background px-2.5 py-1"
                >
                  <span className="font-mono text-xs font-semibold">
                    {entry.tld}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                    {entry.count}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="min-w-0 lg:pl-8">
          <section aria-label="Most common words in the corpus">
            <h3 className="text-sm font-semibold">Most common words</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Share of messages containing each term
            </p>
            <div className="mt-4 space-y-3">
              {keywords.map((keyword) => (
                <KeywordRow
                  key={keyword.term}
                  term={keyword.term}
                  count={keyword.count}
                  max={keywordMax}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      <p className="mt-6 border-t border-border/70 pt-3 text-xs leading-relaxed text-muted-foreground">
        Source:{" "}
        <a
          href={`${SPAM_CORPUS.source.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-medium text-foreground underline-offset-2 hover:text-primary hover:underline"
        >
          {SPAM_CORPUS.source.name}
          <ExternalLink aria-hidden="true" className="size-3" />
        </a>{" "}
        by {SPAM_CORPUS.source.publisher} on Kaggle ({SPAM_CORPUS.source.license}).
        Only aggregate statistics are shown — no message contents. These same
        patterns power ScamShield&apos;s detector rules.
      </p>
    </div>
  );
}
