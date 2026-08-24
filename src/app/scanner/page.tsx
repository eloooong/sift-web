import type { Metadata } from "next";
import { Suspense } from "react";
import { Info, ShieldAlert, Smartphone } from "lucide-react";

import { ScannerInput } from "@/components/scanner/scanner-input";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";

export const metadata: Metadata = {
  title: "Scam Scanner",
  description:
    "Paste a suspicious SMS, email, chat message, or link and let ScamShield PH check it for known Philippine scam patterns.",
};

export default function ScannerPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <FadeIn>
        <SectionHeading
          align="left"
          eyebrow="Analysis"
          title="Scam Scanner"
          description="Paste any suspicious message or link below. An AI analyst working with our rule-based engine checks it for Philippine scam patterns — impersonation, urgency pressure, pay-to-claim fees, phishing links, and more."
        />
      </FadeIn>

      <FadeIn delay={0.08} className="mt-8">
        <Suspense fallback={<ScannerSkeleton />}>
          <ScannerInput />
        </Suspense>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border px-4 py-3.5">
            <Smartphone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">
                Works on mobile.
              </span>{" "}
              Copy the suspicious text from your Messages app, then paste it
              here in seconds.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-dashed px-4 py-3.5">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">
                Explainable hybrid engine.
              </span>{" "}
              The rule-engine pre-scan contributes named, weighted points,
              while the AI analyst explains its findings in plain language —
              no black box.
            </p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

function ScannerSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading scanner"
      className="flex h-[26rem] animate-pulse flex-col justify-end rounded-xl bg-muted/60 p-5"
    >
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <ShieldAlert className="size-4" />
        Loading the scanner…
      </p>
    </div>
  );
}
