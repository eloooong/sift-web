import type { Metadata } from "next";
import { Suspense } from "react";
import { ShieldAlert } from "lucide-react";

import { ScannerInput } from "@/components/scanner/scanner-input";
import { ScannerModeTabs } from "@/components/scanner/scanner-mode-tabs";
import { SectionHeading } from "@/components/shared/section-heading";
import { T } from "@/components/providers/t";

export const metadata: Metadata = {
  title: "Scam Scanner",
  description:
    "Paste a suspicious SMS, email, chat message, or link and let Sift check it for known Philippine scam patterns.",
};

export default function ScannerPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <div>
        <SectionHeading
          as="h1"
          align="left"
          title={<T k="scanner.page.title" />}
          description={<T k="scanner.page.description" />}
        />
      </div>

      <div className="mt-6">
        <ScannerModeTabs active="text" />
      </div>

      <div className="mt-8">
        <Suspense fallback={<ScannerSkeleton />}>
          <ScannerInput />
        </Suspense>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        <T k="input.historyNotice" />
      </p>
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
