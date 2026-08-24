import { CtaSection } from "@/components/landing/cta";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PhExamples } from "@/components/landing/ph-examples";
import { Privacy } from "@/components/landing/privacy";
import { ScanTypes } from "@/components/landing/scan-types";
import { FadeIn } from "@/components/shared/fade-in";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FadeIn>
        <ScanTypes />
      </FadeIn>
      <FadeIn>
        <HowItWorks />
      </FadeIn>
      <FadeIn>
        <PhExamples />
      </FadeIn>
      <FadeIn>
        <Privacy />
      </FadeIn>
      <FadeIn>
        <CtaSection />
      </FadeIn>
    </>
  );
}
