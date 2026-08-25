"use client";

import { useState } from "react";

import { FadeIn } from "@/components/shared/fade-in";
import { ReportForm } from "@/components/reports/report-form";
import { ReportsBoard } from "@/components/reports/reports-board";

/**
 * Client shell for the submit + feed columns so a successful submission can
 * trigger an immediate feed refresh.
 */
export function ReportsView() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
      <section aria-labelledby="submit-heading" className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="submit-heading" className="text-lg font-semibold tracking-tight">
            Submit a report
          </h2>
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            anonymous
          </span>
        </div>

        <FadeIn delay={0.06}>
          <ReportForm onSubmitted={() => setRefreshKey((value) => value + 1)} />
        </FadeIn>

        <p className="rounded-lg border border-dashed p-3 text-xs leading-relaxed text-muted-foreground">
          Demo note: reports are stored in this server&apos;s memory for the
          demo, and restarting resets them. Never include real passwords, OTPs,
          or full account numbers in any report.
        </p>
      </section>

      <section aria-labelledby="feed-heading" className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="feed-heading" className="text-lg font-semibold tracking-tight">
            Latest reports
          </h2>
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            approved only
          </span>
        </div>

        <FadeIn delay={0.12}>
          <ReportsBoard refreshKey={refreshKey} />
        </FadeIn>
      </section>
    </div>
  );
}
