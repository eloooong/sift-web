import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";

export function CtaSection() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-4 pt-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <FadeIn>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center sm:px-12 sm:py-16">
          <h2 className="relative text-2xl font-semibold tracking-tight text-primary-foreground text-balance sm:text-3xl">
            Don't take the bait.
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/80 text-pretty sm:text-base">
            The next time a suspicious message lands, you'll know exactly what
            to do. Check it with ScamShield: free, fast, and explained in
            plain language.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-11 bg-primary-foreground px-6 text-sm text-primary hover:bg-primary-foreground/90">
              <Link href="/scanner">
                Scan Something Suspicious
                <ArrowRight
                  data-icon="inline-end"
                  className="transition-transform group-hover/button:translate-x-0.5"
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-11 px-6 text-sm text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/about">Learn more about ScamShield</Link>
            </Button>
          </div>
        </div>
        </FadeIn>
      </div>
    </section>
  );
}
