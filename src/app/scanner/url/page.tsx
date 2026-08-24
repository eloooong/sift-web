import type { Metadata } from "next";
import { Globe, Info, ShieldCheck } from "lucide-react";

import { UrlScanner } from "@/components/scanner/url-scanner";
import { ScannerModeTabs } from "@/components/scanner/scanner-mode-tabs";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "URL Security Scanner",
  description:
    "Paste a suspicious link and ScamShield PH checks its structure, lookalike domains, shorteners, and reputation — without ever visiting the URL.",
};

export default function UrlScannerPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <FadeIn>
        <SectionHeading
          align="left"
          eyebrow="Analysis"
          title="URL Security Scanner"
          description="Paste a suspicious link below. We break down the address itself — protocol, domain, subdomains, keywords, lookalike brands, shorteners, and redirects — without ever opening it."
        />
      </FadeIn>

      <FadeIn delay={0.04} className="mt-6">
        <ScannerModeTabs active="url" />
      </FadeIn>

      <FadeIn delay={0.08} className="mt-8">
        <UrlScanner />
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border px-4 py-3.5">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">
                Zero-click analysis.
              </span>{" "}
              The link is parsed as text on our server — we never visit it,
              resolve it, or render it, so checking is completely safe.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-dashed px-4 py-3.5">
            <Globe className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">
                Reputation-aware.
              </span>{" "}
              Where a reputation service is configured, results are
              cross-checked against known phishing and malware databases.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-dashed px-4 py-3.5 sm:col-span-2">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Fair scoring.</span>{" "}
              A single weak signal (like a shortened link) never labels an
              address dangerous on its own — verdicts require multiple
              independent or strong indicators.
            </p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
