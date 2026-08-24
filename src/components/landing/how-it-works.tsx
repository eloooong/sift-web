import { FileSearch, Info, ScanSearch, Upload } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
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
      "ScamShield compares the content against known Philippine scam patterns, impersonation tactics, and phishing techniques.",
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
          eyebrow="How ScamShield Works"
          title="From suspicious to certain in three steps"
          description="No jargon, no black-box verdicts. Every result shows its evidence and tells you what to do next."
        />

        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.number}>
              <Card className="relative h-full transition-colors hover:ring-foreground/20">
                <CardContent className="flex h-full flex-col gap-3 pt-1">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-4 right-5 font-mono text-4xl font-semibold text-slate-100 select-none"
                  >
                    {step.number}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/60">
                    <step.icon className="size-[18px]" />
                  </span>
                  <h3 className="text-base font-medium">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
          <Info className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <p className="text-sm leading-relaxed text-amber-900">
            <span className="font-medium">Hybrid analysis.</span> Every scan
            runs an AI analyst alongside ScamShield’s transparent rule engine —
            points still come from named, weighted red flags, and the AI
            explains its findings in plain language.
          </p>
        </div>
      </div>
    </section>
  );
}
