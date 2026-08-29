import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";

import { CategoryBadge } from "@/components/shared/category-badge";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SCAM_CATEGORIES } from "@/lib/scam-detector/categories";

export const metadata: Metadata = {
  title: "Scam Library",
  description:
    "A Philippine-focused catalog of scam formats: prize texts, GCash phishing, courier fees, loan offers, government impersonation, investing groups, romance cons, and more. Learn the warning signs and what to do.",
};

export default function ScamsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <FadeIn>
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Scam Library"
          title="The Philippine scam catalog"
          description="Every major scam format used against Filipinos, in plain language. Learn the warning signs now so you recognize them in the wild; brands named below are impersonation targets, never suspects."
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <nav
          aria-label="Scam categories"
          className="mt-6 flex flex-wrap gap-2 border-y py-4"
        >
          {SCAM_CATEGORIES.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="inline-flex min-h-9 items-center rounded-full border bg-background px-3.5 py-1 text-xs font-medium text-muted-foreground transition-colors outline-none hover:border-foreground/30 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              {category.label}
            </a>
          ))}
        </nav>
      </FadeIn>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {SCAM_CATEGORIES.map((category, index) => (
          <FadeIn key={category.id} delay={Math.min(index * 0.04, 0.24)}>
            <Card
              id={category.id}
              className="h-full scroll-mt-24 break-inside-avoid"
            >
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CategoryBadge category={category} />
                  <span className="rounded-full border border-dashed px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                    via {category.exampleChannel}
                  </span>
                </div>
                <p className="pt-1 text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                    <TriangleAlert
                      aria-hidden="true"
                      className="size-3.5 text-warning"
                    />
                    Common warning signs
                  </h3>
                  <ul className="space-y-1.5">
                    {category.warningSigns.map((sign) => (
                      <li
                        key={sign}
                        className="flex items-start gap-2 text-sm leading-relaxed"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[7px] size-1.5 shrink-0 rounded-full bg-danger/60"
                        />
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                    <ShieldAlert
                      aria-hidden="true"
                      className="size-3.5 text-muted-foreground"
                    />
                    Realistic example (fictional)
                  </h3>
                  <blockquote className="rounded-md border border-danger/50 bg-danger/5 py-2 pr-3 pl-3">
                    <p className="font-mono text-[11px] leading-relaxed break-words text-foreground/80">
                      “{category.exampleText}”
                    </p>
                  </blockquote>
                </div>

                <div>
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                    <CheckCircle2
                      aria-hidden="true"
                      className="size-3.5 text-success"
                    />
                    What to do
                  </h3>
                  <ol className="space-y-1.5">
                    {category.whatToDo.map((step, stepIndex) => (
                      <li
                        key={step}
                        className="flex items-start gap-2 text-sm leading-relaxed"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-success/10 font-mono text-[9px] font-semibold text-success"
                        >
                          {stepIndex + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.1}>
        <div className="mt-10 rounded-xl border bg-card px-6 py-8 text-center">
          <h2 className="text-base font-semibold">
            Think you just received one of these?
          </h2>
          <p className="mx-auto mt-1.5 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Paste it into the scanner for a full breakdown: risk score, red
            flags with evidence, and recommended next steps.
          </p>
          <Button asChild className="mt-5">
            <Link href="/scanner">Scan a Message Now</Link>
          </Button>
          <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground/80">
            Trademark notice: GCash, Maya, BDO, BPI, SSS, PhilHealth, Pag-IBIG,
            BIR, PNP, NBI, LTO, Shopee, Lazada, LBC, J&amp;T Express, Grab, and
            similar names belong to their respective owners and appear strictly
            as examples of brands commonly impersonated by scammers.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
