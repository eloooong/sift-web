import type { Metadata } from "next";
import { Megaphone, ShieldCheck } from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { ReportsView } from "@/components/reports/reports-view";

export const metadata: Metadata = {
  title: "Community Reports — ScamShield PH",
  description:
    "Browse anonymized scam reports from the community or submit your own. Every report is reviewed before it appears publicly.",
};

export default function ReportsPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-foreground)_1px,transparent_0)] bg-[size:24px_24px] opacity-[0.04]"
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <FadeIn className="max-w-2xl">
          <p className="font-mono text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
            Community watch
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Scam reports from real people
          </h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Warn others about scam attempts you&apos;ve received and browse what
            the community has flagged. Reports stay anonymous and are reviewed
            by a moderator before they appear publicly.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <li className="inline-flex items-center gap-1.5">
              <ShieldCheck aria-hidden="true" className="size-4 text-success" />
              No personal data required
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Megaphone aria-hidden="true" className="size-4" />
              Moderated before publishing
            </li>
          </ul>
        </FadeIn>

        <ReportsView />
      </div>
    </div>
  );
}
