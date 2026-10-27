import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronDown, TriangleAlert } from "lucide-react";
import { T } from "@/components/providers/t";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { SCAM_CATEGORIES } from "@/lib/scam-detector/categories";
export const metadata: Metadata = {
  title: "Scam Library",
  description:
    "Learn the warning signs in common Philippine scam messages and what to do next.",
};
export default function ScamsPage() {
  return (
    <div className="site-container py-12 sm:py-20">
      <SectionHeading
        as="h1"
        title={<T k="library.title" />}
        description={<T k="library.body" />}
      />
      <div className="mt-12 grid items-start gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
        <nav
          aria-label="Scam categories"
          className="flex flex-wrap gap-2 lg:sticky lg:top-28 lg:flex-col lg:gap-1"
        >
          {SCAM_CATEGORIES.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="inline-flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              {category.label}
            </a>
          ))}
        </nav>
        <div className="min-w-0 space-y-4">
          {SCAM_CATEGORIES.map((category, index) => (
            <details
              key={category.id}
              id={category.id}
              open={index === 0}
              className="group scroll-mt-28 rounded-lg border bg-card"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-5 rounded-lg p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:p-7 [&::-webkit-details-marker]:hidden">
                <div>
                  <h2 className="text-xl font-semibold">{category.label}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                </div>
                <ChevronDown
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="space-y-7 border-t p-5 sm:p-7">
                <section>
                  <h3 className="flex items-center gap-2 text-base font-semibold">
                    <TriangleAlert
                      aria-hidden="true"
                      className="size-4 text-danger"
                    />
                    <T k="library.signs" />
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                    {category.warningSigns.map((sign) => (
                      <li key={sign}>{sign}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="text-base font-semibold">
                    <T k="library.sample" />
                  </h3>
                  <blockquote className="mt-3 rounded-md border bg-secondary/50 p-4 text-sm leading-7 break-words">
                    {category.exampleText}
                  </blockquote>
                </section>
                <section>
                  <h3 className="text-base font-semibold">
                    <T k="report.whatToDo" />
                  </h3>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
                    {category.whatToDo.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </section>
              </div>
            </details>
          ))}
        </div>
      </div>
      <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t pt-8 sm:flex-row sm:items-center">
        <p className="text-lg font-medium">
          <T k="home.cta.title" />
        </p>
        <Button asChild>
          <Link href="/scanner">
            <T k="home.checkMessage" />
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
