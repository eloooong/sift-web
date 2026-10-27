import type { Metadata } from "next";
import { EyeOff, FileWarning, ShieldCheck, Timer } from "lucide-react";

import { ScreenshotScanner } from "@/components/scanner/screenshot-scanner";
import { ScannerModeTabs } from "@/components/scanner/scanner-mode-tabs";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { T } from "@/components/providers/t";

export const metadata: Metadata = {
  title: "Screenshot Scanner",
  description:
    "Upload a screenshot of a suspicious message. Sift reads it with OCR and runs the full Philippine scam analysis, without storing your image.",
};

const PRIVACY_POINTS = [
  {
    icon: FileWarning,
    titleKey: "screenshot.privacy.sensitive.title",
    bodyKey: "screenshot.privacy.sensitive.body",
  },
  {
    icon: EyeOff,
    titleKey: "screenshot.privacy.noStore.title",
    bodyKey: "screenshot.privacy.noStore.body",
  },
  {
    icon: Timer,
    titleKey: "screenshot.privacy.ocr.title",
    bodyKey: "screenshot.privacy.ocr.body",
  },
] as const;

export default function ScreenshotScannerPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <FadeIn>
        <SectionHeading
          as="h1"
          align="left"
          title={<T k="screenshot.page.title" />}
          description={<T k="screenshot.page.description" />}
        />
      </FadeIn>

      <FadeIn delay={0.04} className="mt-6">
        <ScannerModeTabs active="screenshot" />
      </FadeIn>

      <FadeIn delay={0.08} className="mt-8">
        <ScreenshotScanner />
      </FadeIn>

      <FadeIn delay={0.12}>
        <section
          aria-labelledby="privacy-heading"
          className="mt-10 rounded-xl border bg-muted/30 px-5 py-5 sm:px-6"
        >
          <h2
            id="privacy-heading"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <ShieldCheck aria-hidden="true" className="size-4 text-success" />
            <T k="screenshot.privacy.title" />
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {PRIVACY_POINTS.map((point) => (
              <li key={point.titleKey} className="flex items-start gap-2.5">
                <point.icon
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                />
                <div>
                  <p className="text-xs font-medium">
                    <T k={point.titleKey} />
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    <T k={point.bodyKey} />
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t pt-3 text-sm leading-relaxed text-muted-foreground">
            <T k="screenshot.privacy.rules" />
          </p>
        </section>
      </FadeIn>
    </div>
  );
}
