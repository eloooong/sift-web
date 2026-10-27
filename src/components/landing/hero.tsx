"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, MessageSquareText, ScanLine } from "lucide-react";
import { useLang } from "@/components/providers/language-provider";
import { RiskBadge } from "@/components/shared/risk-badge";
import { Button } from "@/components/ui/button";
import { EXAMPLE_SCAMS } from "@/lib/examples";
import { cn } from "@/lib/utils";

export function Hero() {
  const { t, lang } = useLang();
  const [sampleIndex, setSampleIndex] = useState(0);
  const sample = EXAMPLE_SCAMS[sampleIndex];
  return (
    <section className="home-hero border-b bg-card">
      <div className="site-container grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-24">
        <div className="home-hero-copy">
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-0.035em] text-balance sm:text-6xl lg:text-[5.5rem]">
            {t("home.hero.title")}
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {t("home.hero.body")}
          </p>
          <div className="home-hero-actions mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/scanner">
                {t("home.checkMessage")}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/scanner/screenshot">
                <ScanLine aria-hidden="true" />
                {t("home.checkScreenshot")}
              </Link>
            </Button>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Check aria-hidden="true" className="size-4" />
            {t("home.hero.note")}
          </p>
        </div>
        <article
          className="home-analysis-card overflow-hidden rounded-lg border bg-background"
          aria-label={t("home.sample.label")}
        >
          <div className="flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
            <span className="flex items-center gap-2 text-sm font-medium">
              <MessageSquareText aria-hidden="true" className="size-4" />
              {t("home.sample.label")}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("home.sample.example")}
            </span>
          </div>
          <div className="p-5 sm:p-6">
            <div
              className="mb-5 flex flex-wrap gap-2"
              role="group"
              aria-label={t("home.sample.choose")}
            >
              {EXAMPLE_SCAMS.slice(0, 3).map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={index === sampleIndex}
                  onClick={() => setSampleIndex(index)}
                  className={cn(
                    "min-h-11 rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    index === sampleIndex
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:bg-secondary",
                  )}
                >
                  {t(
                    index === 0
                      ? "home.sample.prize"
                      : index === 1
                        ? "home.sample.wallet"
                        : "home.sample.otp",
                  )}
                </button>
              ))}
            </div>
            <div
              aria-live="polite"
              aria-atomic="true"
              className="home-sample-stage"
            >
              {EXAMPLE_SCAMS.slice(0, 3).map((item, index) => {
                const cue = [
                  "PHP1,500 processing fee",
                  "PERMANENTLY DEACTIVATED",
                  "i-reply ang",
                ][index];
                const [before, after] = item.sampleText.split(cue);
                return (
                  <div
                    key={item.id}
                    aria-hidden={index !== sampleIndex}
                    className={cn(
                      "home-sample-content",
                      index === sampleIndex ? "is-active" : "invisible",
                    )}
                  >
                    <blockquote className="relative overflow-hidden rounded-md border bg-card p-4 text-sm leading-7 break-words sm:text-base">
                      <span aria-hidden="true" className="home-scan-line" />
                      &ldquo;{before}
                      <mark className="home-evidence-mark rounded-sm bg-danger/10 px-0.5 font-medium text-danger-foreground underline decoration-danger/40 underline-offset-4">
                        {cue}
                      </mark>
                      {after}&rdquo;
                    </blockquote>
                    <div className="mt-6 flex items-center justify-between gap-3">
                      <RiskBadge level={item.riskLevel} />
                      <span className="text-sm text-muted-foreground">
                        {t("home.sample.risk")}{" "}
                        <strong className="font-semibold text-foreground">
                          {item.riskScore}/100
                        </strong>
                      </span>
                    </div>
                    <div
                      aria-hidden="true"
                      className="mt-3 h-1.5 overflow-hidden rounded-full bg-border/60"
                    >
                      <div
                        className={cn(
                          "home-risk-fill h-full rounded-full",
                          item.riskLevel === "medium"
                            ? "bg-warning"
                            : "bg-danger",
                        )}
                        style={{ width: `${item.riskScore}%` }}
                      />
                    </div>
                    <p className="mt-4 text-base font-medium">
                      {lang === "fil"
                        ? (item.summaryFil ?? item.summary)
                        : item.summary}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {t("home.sample.next")}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <Link
            href={`/scanner?example=${sample.id}`}
            className="home-arrow-link flex min-h-14 items-center justify-between gap-3 border-t bg-secondary/60 px-5 py-3 text-sm font-semibold transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ring sm:px-6"
          >
            {t("home.sample.try")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </article>
      </div>
    </section>
  );
}
