import type { Metadata } from "next";
import { EyeOff, FileWarning, ShieldCheck, Timer } from "lucide-react";

import { ScreenshotScanner } from "@/components/scanner/screenshot-scanner";
import { ScannerModeTabs } from "@/components/scanner/scanner-mode-tabs";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Screenshot Scanner",
  description:
    "Upload a screenshot of a suspicious message — ScamShield PH reads it with OCR and runs the full Philippine scam analysis, without storing your image.",
};

const PRIVACY_POINTS = [
  {
    icon: FileWarning,
    title: "Screenshots can contain sensitive details",
    description:
      "Names, phone numbers, chat photos, balances — anything visible in the capture is readable text to our analyzer. Crop out anything you don’t need checked before uploading.",
  },
  {
    icon: EyeOff,
    title: "Nothing is permanently stored",
    description:
      "Your upload is processed in memory only for the duration of the scan and discarded right after your report is generated. We don’t build a gallery of screenshots.",
  },
  {
    icon: Timer,
    title: "OCR runs on our server",
    description:
      "Text extraction happens server-side so the analysis stays consistent with the text scanner. Expect up to about a minute for the full OCR-plus-analysis pipeline.",
  },
] as const;

export default function ScreenshotScannerPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <FadeIn>
        <SectionHeading
          align="left"
          eyebrow="Analysis"
          title="Screenshot Scanner"
          description="Upload a screenshot of the suspicious SMS, chat, or email instead of typing it out. We extract the text with OCR, then run the same AI-plus-rules analysis you get from the text scanner."
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
            Before you upload — privacy notes
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {PRIVACY_POINTS.map((point) => (
              <li key={point.title} className="flex items-start gap-2.5">
                <point.icon
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                />
                <div>
                  <p className="text-xs font-medium">{point.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t pt-3 text-[11px] leading-relaxed text-muted-foreground">
            Upload rules: PNG, JPG, JPEG, or WebP images up to 5 MB. Files that
            fail type or size validation are rejected immediately and never
            processed.
          </p>
        </section>
      </FadeIn>
    </div>
  );
}
