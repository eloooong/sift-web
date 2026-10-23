import { ArrowRight, FileSearch, Info, ScanSearch, Upload } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  {
    icon: Upload,
    number: "01",
    title: "Paste the message",
    description:
      "Copy the suspicious SMS, email, link, or chat message into the scanner. No account needed.",
  },
  {
    icon: ScanSearch,
    number: "02",
    title: "AI checks for red flags",
    description:
      "Sift compares the content against known Philippine scam patterns, impersonation tactics, and phishing techniques.",
  },
  {
    icon: FileSearch,
    number: "03",
    title: "Get a clear verdict",
    description:
      "Receive a risk score, detected scam category, explained evidence, and recommended next steps you can act on.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="How Sift Works"
          title="From suspicious to certain in three steps"
          description="No jargon, no black-box verdicts. Every result shows its evidence and tells you what to do next."
        />

        <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-4">
          {STEPS.map((step, index) => (
            <li key={step.number} className="relative">
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute -left-[calc(50%+8px)] top-8 hidden -translate-x-1/2 md:block"
                >
                  <ArrowRight className="size-4 text-muted-foreground/40" />
                </span>
              ) : null}
              <FadeIn delay={index * 0.05} className="h-full">
                <Card className="relative h-full transition-colors hover:ring-foreground/20">
                  <CardContent className="flex h-full flex-col gap-2.5 pt-1">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-3 right-4 font-mono text-3xl font-semibold text-muted-foreground/10 select-none"
                    >
                      {step.number}
                    </span>
                    <span className="flex size-10 items-center justify-center rounded-lg border bg-muted/60">
                      <step.icon className="size-5" />
                    </span>
                    <h3 className="font-heading text-base font-medium leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3.5">
          <Info className="mt-0.5 size-4 shrink-0 text-warning" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Hybrid analysis.</span> Every scan
            runs an AI analyst alongside Sift&apos;s transparent rule engine;
            points still come from named, weighted red flags, and the AI
            explains its findings in plain language.
          </p>
        </div>
      </div>
    </section>
  );
}
