import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EXAMPLE_SCAMS } from "@/lib/examples";
import { FadeIn } from "@/components/shared/fade-in";
import { RiskBadge } from "@/components/shared/risk-badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PhExamples() {
  return (
    <section id="examples" className="scroll-mt-24 border-y bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Know The Enemy"
          title="Common Philippine scam patterns"
          description="Reconstructed samples of formats scammers use every day. Study them so you can recognize one instantly — then test them in the scanner."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {EXAMPLE_SCAMS.map((example, index) => (
            <FadeIn key={example.id} delay={Math.min(index * 0.04, 0.2)}>
            <Card className="h-full">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="font-normal">
                    {example.category}
                  </Badge>
                  <RiskBadge level={example.riskLevel} />
                </div>
                <CardTitle>{example.label}</CardTitle>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {example.summary}
                </p>
              </CardHeader>

              <CardContent>
                <blockquote className="rounded-lg border bg-muted/60 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
                  <span className="line-clamp-3">{example.sampleText}</span>
                </blockquote>

                <p className="mt-3 mb-1.5 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                  Red flags
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {example.redFlags.map((flag) => (
                    <li
                      key={flag}
                      className="rounded-full border border-danger/30 bg-danger/10 px-2 py-0.5 text-[11px] font-medium text-danger"
                    >
                      {flag}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="justify-between">
                <p className="text-xs text-muted-foreground">
                  Channel: {example.channel}
                </p>
                <Link
                  href={`/scanner?example=${example.id}`}
                  className="group/link inline-flex items-center gap-1 text-sm font-medium"
                >
                  Test in scanner
                  <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
                </Link>
              </CardFooter>
            </Card>
            </FadeIn>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
          Sample texts are reconstructions for education and awareness. They
          are not real messages, and phone numbers shown are placeholders.
          Brand names illustrate impersonation tactics only — the legitimate
          companies are not involved.
        </p>
      </div>
    </section>
  );
}
