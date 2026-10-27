"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardPaste,
  FileSearch,
  ScanSearch,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { useLang } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { EXAMPLE_SCAMS } from "@/lib/examples";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: ClipboardPaste,
    title: "home.step.paste",
    body: "home.step.pasteBody",
  },
  { icon: ScanSearch, title: "home.step.look", body: "home.step.lookBody" },
  { icon: FileSearch, title: "home.step.act", body: "home.step.actBody" },
] as const;

export function HowItWorks() {
  const { t } = useLang();
  const [activeStep, setActiveStep] = useState(0);
  const sample = EXAMPLE_SCAMS[0];
  const excerpt = sample.sampleText.slice(
    sample.sampleText.indexOf("You have WON"),
    sample.sampleText.indexOf("This is not a joke"),
  );
  return (
    <section id="how-it-works" className="scroll-mt-24">
      <div className="site-container py-16 sm:py-24">
        <div className="max-w-2xl">
          <h2 className="section-title">{t("home.how.title")}</h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {t("home.how.body")}
          </p>
        </div>
        <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div
            className="space-y-3"
            role="group"
            aria-label={t("home.walkthrough.steps")}
          >
            {STEPS.map((step, index) => (
              <button
                key={step.title}
                type="button"
                aria-pressed={activeStep === index}
                aria-controls={`walkthrough-stage-${index}`}
                onClick={() => setActiveStep(index)}
                className={cn(
                  "home-step-button flex min-h-20 w-full items-start gap-4 rounded-lg border p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  activeStep === index
                    ? "border-foreground/30 bg-card"
                    : "border-transparent hover:border-border hover:bg-card/60",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md transition-colors",
                    activeStep === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  <step.icon className="size-4" />
                </span>
                <span>
                  <span className="block text-lg font-semibold">
                    {t(step.title)}
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                    {t(step.body)}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div className="overflow-hidden rounded-lg border bg-card">
            <div aria-hidden="true" className="h-1 bg-secondary">
              <div
                className="home-workflow-progress h-full w-1/3 bg-primary"
                style={{ transform: `translateX(${activeStep * 100}%)` }}
              />
            </div>
            <div className="flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-7">
              <p className="text-sm font-medium">
                {t("home.walkthrough.label")}
              </p>
              <span
                aria-hidden="true"
                className="text-sm tabular-nums text-muted-foreground"
              >
                {activeStep + 1} / 3
              </span>
            </div>
            <div
              className="home-walkthrough-stage p-5 sm:p-7"
              aria-live="polite"
              aria-atomic="true"
            >
              {STEPS.map((step, index) => (
                <div
                  key={step.title}
                  id={`walkthrough-stage-${index}`}
                  aria-hidden={activeStep !== index}
                  className={cn(
                    "home-walkthrough-content",
                    activeStep === index ? "is-active" : "invisible",
                  )}
                >
                  <h3 className="text-xl font-semibold">
                    {t(
                      index === 0
                        ? "home.walkthrough.received"
                        : index === 1
                          ? "home.walkthrough.evidence"
                          : "home.walkthrough.action",
                    )}
                  </h3>
                  {index === 0 ? (
                    <blockquote className="mt-5 rounded-md border bg-background p-4 text-base leading-7 break-words">
                      &ldquo;{excerpt.trim()}&rdquo;
                    </blockquote>
                  ) : index === 1 ? (
                    <ul className="mt-5 divide-y">
                      {(
                        [
                          "home.walkthrough.fee",
                          "home.walkthrough.identity",
                          "home.walkthrough.deadline",
                        ] as const
                      ).map((key) => (
                        <li
                          key={key}
                          className="flex items-start gap-3 py-4 first:pt-0"
                        >
                          <TriangleAlert
                            aria-hidden="true"
                            className="mt-1 size-4 shrink-0 text-danger-foreground"
                          />
                          <span className="text-base leading-relaxed">
                            {t(key)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-5">
                      <ShieldCheck
                        aria-hidden="true"
                        className="size-8 text-success-foreground"
                      />
                      <p className="mt-4 text-base leading-relaxed">
                        {t("home.walkthrough.advice")}
                      </p>
                      <Link
                        href="/scanner?example=prize-scam"
                        className="home-arrow-link mt-6 inline-flex min-h-11 items-center gap-3 text-sm font-semibold underline underline-offset-4"
                      >
                        {t("home.sample.try")}
                        <ArrowRight aria-hidden="true" className="size-4" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end border-t px-5 py-3 sm:px-7">
              <Button
                variant="ghost"
                onClick={() =>
                  setActiveStep((step) => (step + 1) % STEPS.length)
                }
              >
                {t(
                  activeStep === 2
                    ? "home.walkthrough.again"
                    : "home.walkthrough.next",
                )}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
