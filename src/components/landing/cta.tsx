import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { T } from "@/components/providers/t";
import { Button } from "@/components/ui/button";
export function CtaSection() {
  return (
    <section className="border-t bg-card">
      <div className="site-container flex flex-col items-start justify-between gap-8 py-16 sm:flex-row sm:items-center sm:py-20">
        <div>
          <h2 className="section-title">
            <T k="home.cta.title" />
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            <T k="home.cta.body" />
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/scanner">
            <T k="home.checkMessage" />
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
