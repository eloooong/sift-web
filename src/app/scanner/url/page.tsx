import type { Metadata } from "next";
import { Globe, Info, ShieldCheck } from "lucide-react";

import { UrlScanner } from "@/components/scanner/url-scanner";
import { ScannerModeTabs } from "@/components/scanner/scanner-mode-tabs";
import { SectionHeading } from "@/components/shared/section-heading";
import { T } from "@/components/providers/t";

export const metadata: Metadata = {
  title: "URL Security Scanner",
  description:
    "Paste a suspicious link and Sift checks its structure, lookalike domains, shorteners, and reputation, all without ever visiting the URL.",
};

export default function UrlScannerPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <div>
        <SectionHeading
          as="h1"
          align="left"
          title={<T k="url.page.title" />}
          description={<T k="url.page.description" />}
        />
      </div>

      <div className="mt-6">
        <ScannerModeTabs active="url" />
      </div>

      <div className="mt-8">
        <UrlScanner />
      </div>

      <div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border px-4 py-3.5">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">
                <T k="url.note.zeroClick.title" />
              </span>{" "}
              <T k="url.note.zeroClick.body" />
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-dashed px-4 py-3.5">
            <Globe className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">
                <T k="url.note.reputation.title" />
              </span>{" "}
              <T k="url.note.reputation.body" />
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-dashed px-4 py-3.5 sm:col-span-2">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">
                <T k="url.note.fairScoring.title" />
              </span>{" "}
              <T k="url.note.fairScoring.body" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
