"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/components/providers/language-provider";
import { RiskBadge } from "@/components/shared/risk-badge";
import { EXAMPLE_SCAMS } from "@/lib/examples";
export function PhExamples() {
  const { t, lang } = useLang();
  const examples = [EXAMPLE_SCAMS[0], EXAMPLE_SCAMS[1], EXAMPLE_SCAMS[6]];
  return (
    <section id="examples" className="scroll-mt-24 border-y bg-card">
      <div className="site-container py-16 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="section-title">{t("home.examples.title")}</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {t("home.examples.body")}
            </p>
          </div>
          <Link
            href="/scams"
            className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold underline decoration-border underline-offset-8 hover:decoration-foreground"
          >
            {t("home.examples.all")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-0 md:divide-x">
          {examples.map((example) => (
            <article
              key={example.id}
              className="home-example flex flex-col border-t pt-6 md:border-t-0 md:px-7 md:pt-0 md:first:pl-0 md:last:pr-0"
            >
              <RiskBadge level={example.riskLevel} />
              <h3 className="mt-5 text-xl font-semibold">
                {lang === "fil"
                  ? (example.labelFil ?? example.label)
                  : example.label}
              </h3>
              <blockquote className="mt-4 rounded-md border bg-background p-4 font-mono text-sm leading-relaxed text-muted-foreground">
                <span className="line-clamp-3 break-words">
                  {example.sampleText}
                </span>
              </blockquote>
              <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                {lang === "fil"
                  ? (example.summaryFil ?? example.summary)
                  : example.summary}
              </p>
              <Link
                href={`/scanner?example=${example.id}`}
                className="home-arrow-link mt-5 flex min-h-11 items-center justify-between gap-3 border-t pt-3 text-sm font-medium hover:text-muted-foreground"
              >
                {t("home.examples.inspect")}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-9 text-sm leading-relaxed text-muted-foreground">
          {t("home.examples.note")}
        </p>
      </div>
    </section>
  );
}
