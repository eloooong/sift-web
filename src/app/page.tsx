import { CtaSection } from "@/components/landing/cta";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PhExamples } from "@/components/landing/ph-examples";
import { Privacy } from "@/components/landing/privacy";
import { ScanTypes } from "@/components/landing/scan-types";
export default function HomePage() {
  return (
    <>
      <Hero />
      <ScanTypes />
      <HowItWorks />
      <PhExamples />
      <Privacy />
      <CtaSection />
    </>
  );
}
