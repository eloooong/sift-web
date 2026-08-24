import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-slate-600/40 blur-3xl"
          />
          <h2 className="relative text-2xl font-semibold tracking-tight text-white text-balance sm:text-3xl">
            Don’t take the bait.
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300 text-pretty sm:text-base">
            The next time a suspicious message lands, you’ll know exactly what
            to do. Check it with ScamShield — free, fast, and explained in
            plain language.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-11 bg-white px-6 text-sm text-slate-900 hover:bg-slate-200">
              <Link href="/scanner">
                Scan Something Suspicious
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-11 px-6 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <Link href="/about">Learn more about ScamShield</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
