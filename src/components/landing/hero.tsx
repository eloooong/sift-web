import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";

import { RiskBadge } from "@/components/shared/risk-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const HERO_CHECKS = [
  "Built for Philippine scam patterns",
  "Explains red flags in plain language",
  "Free to use — no account required",
] as const;

const SAMPLE_EVIDENCE = [
  "Pay-to-claim fee",
  "24-hour deadline",
  "Fake DTI permit",
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,var(--color-muted),transparent)]"
      />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:py-24">
        <div>
          <Badge
            variant="outline"
            className="mb-5 h-auto gap-1.5 rounded-full border-border px-3 py-1.5 text-muted-foreground"
          >
            <Sparkles className="text-muted-foreground" />
            Free to use · No sign-up required
          </Badge>

          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
            Think it’s a scam?{" "}
            <span className="underline decoration-[3px] decoration-warning underline-offset-[10px]">
              Let ScamShield check.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            AI-powered scam detection built to help Filipinos identify
            suspicious messages, links, and online threats.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-11 px-6 text-sm">
              <Link href="/scanner">
                Scan Something Suspicious
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 px-6 text-sm"
            >
              <Link href="/#how-it-works">How It Works</Link>
            </Button>
          </div>

          <ul className="mt-8 flex max-w-xl flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-5">
            {HERO_CHECKS.map((check) => (
              <li
                key={check}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <Check className="size-3.5 shrink-0 text-green-600" />
                {check}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-slate-200/80 via-slate-100 to-transparent blur-2xl"
          />

          <Card className="shadow-lg shadow-slate-200/70">
            <CardContent>
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  Analysis Report
                </p>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  SAMPLE
                </Badge>
              </div>

              <div className="mt-4 flex items-end justify-between gap-4">
                <RiskBadge level="critical" />
                <p aria-label="Risk score 95 out of 100" className="leading-none">
                  <span className="text-3xl font-semibold tracking-tight">
                    95
                  </span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </p>
              </div>

              <div
                role="presentation"
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
              >
                <div className="h-full w-[95%] rounded-full bg-red-600" />
              </div>

              <dl className="mt-5 space-y-2.5 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">Category</dt>
                  <dd className="text-right font-medium">
                    Fake Prize / Lottery (SMS)
                  </dd>
                </div>
                <Separator />
                <div className="flex items-start justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">Evidence</dt>
                  <dd className="flex flex-wrap justify-end gap-1.5">
                    {SAMPLE_EVIDENCE.map((flag) => (
                      <span
                        key={flag}
                        className="rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700"
                      >
                        {flag}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 rounded-lg border bg-muted/60 p-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Recommended:
                  </span>{" "}
                  Do not reply and do not pay any fee. Block the number, then
                  report the message to your telco and the NTC.
                </p>
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground/80">
                Sample output — run your own scan on the{" "}
                <Link href="/scanner" className="underline underline-offset-2 hover:text-foreground">
                  scanner page
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
