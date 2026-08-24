import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Database } from "lucide-react";

import { CategoryDonut } from "@/components/dashboard/category-donut";
import { RecentScansTable } from "@/components/dashboard/recent-scans-table";
import { RiskBars } from "@/components/dashboard/risk-bars";
import { StatCards } from "@/components/dashboard/stat-cards";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { FadeIn } from "@/components/shared/fade-in";
import { getDashboardData } from "@/lib/dashboard/demo-data";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "ScamShield PH analytics — scan volume, high-risk detections, scam category breakdowns, and recent activity across the platform.",
};

export default function DashboardPage() {
  const data = getDashboardData(new Date());

  return (
    <div className="relative">
      {/* Dot-grid flourish behind the header */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          opacity: 0.05,
          maskImage:
            "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:px-8">
        <FadeIn>
          <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
            <div className="max-w-xl">
              <p className="font-mono text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Analytics
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                Scam Intelligence Dashboard
              </h1>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                What the shield is seeing right now — scan volume, threat mix,
                and where risk is concentrating for Filipino users.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <CalendarDays aria-hidden="true" className="size-3.5" />
                Last 30 days
              </span>
            </div>
          </header>
        </FadeIn>

        <FadeIn delay={0.04}>
          <aside className="mt-6 flex items-start gap-2.5 rounded-lg border border-dashed bg-muted/30 px-3.5 py-2.5">
            <Database
              aria-hidden="true"
              className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-mono font-semibold tracking-wide text-foreground uppercase">
                Demo dataset.
              </span>{" "}
              ScamShield doesn&apos;t persist scans yet, so every figure below
              is generated seed data for preview purposes — not live production
              statistics.
            </p>
          </aside>
        </FadeIn>

        <FadeIn delay={0.08} className="mt-8">
          <StatCards data={data} />
        </FadeIn>

        <FadeIn delay={0.12}>
          <TrendChart series={data.trendSeries} />
        </FadeIn>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <FadeIn delay={0.16}>
            <CategoryDonut categories={data.categories} />
          </FadeIn>
          <FadeIn delay={0.2}>
            <RiskBars risks={data.risks} />
          </FadeIn>
        </div>

        <FadeIn delay={0.22} className="mt-6">
          <RecentScansTable scans={data.recentScans} />
        </FadeIn>

        <FadeIn delay={0.24}>
          <p className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-5 text-sm text-muted-foreground">
            <span>
              Want these numbers to reflect your own suspicious messages?
            </span>
            <Link
              href="/scanner"
              className="group inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary"
            >
              Run a scan
              <ArrowRight
                aria-hidden="true"
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
