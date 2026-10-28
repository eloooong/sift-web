import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Database } from "lucide-react";

import { CategoryDonut } from "@/components/dashboard/category-donut";
import { CommunityIntelCard } from "@/components/dashboard/community-intel-card";
import { CorpusInsightsCard } from "@/components/dashboard/corpus-insights-card";
import { NetworkBreakdownCard } from "@/components/dashboard/network-breakdown-card";
import { RecentScansTable } from "@/components/dashboard/recent-scans-table";
import { RegionalIncidentsCard } from "@/components/dashboard/regional-incidents-card";
import { StatCards } from "@/components/dashboard/stat-cards";
import { TrendChart } from "@/components/dashboard/trend-chart";
import {
  getCommunityIntel,
  summarizeCommunityIntel,
} from "@/lib/intel/ph-scam-db";
import { getDashboardData } from "@/lib/dashboard/demo-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Scam Intelligence",
  description:
    "Philippine scam intelligence: regional incident rates, network distribution, threat categories, corpus insights, and community-reported scam data.",
};

export default async function DashboardPage() {
  const data = getDashboardData(new Date());
  const communityIntel = await getCommunityIntel();
  const intelStats = communityIntel
    ? summarizeCommunityIntel(communityIntel)
    : null;

  return (
    <div className="relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div>
          <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
            <div className="max-w-xl">
              <h1 className="mt-2 page-title">PH Scam Intelligence</h1>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                What real Philippine spam looks like: volume, threat mix,
                regional distribution, and how the shield scores it — backed by
                a public corpus of 1,021 texts and a broader dataset of 5,545
                scam reports shared by Filipino users.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <CalendarDays aria-hidden="true" className="size-3.5" />
                Nov 2022 – Aug 2024
              </span>
            </div>
          </header>
        </div>

        <div>
          <aside className="mt-6 flex items-start gap-2.5 rounded-lg border border-dashed bg-muted/30 px-3.5 py-2.5">
            <Database
              aria-hidden="true"
              className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
            />
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">
                Research corpus.
              </span>{" "}
              These breakdowns describe public research datasets, rather than
              your private scan history: the Kaggle &ldquo;Philippine Spam SMS
              Messages&rdquo; corpus (1,021 texts) and the
              ScamMessagesPhilippines project (5,545 scam reports across 17
              regions). The community threat-intel card is live data from the
              open PH Scam DB project; recent-scan rows are illustrative samples
              with verified scores.
            </p>
          </aside>
        </div>

        <div className="mt-8">
          <StatCards data={data} />
        </div>

        <div className="mt-6">
          <TrendChart series={data.trendSeries} />
        </div>

        <div className="mt-6">
          <CommunityIntelCard stats={intelStats} />
        </div>

        <div className="mt-6">
          <RegionalIncidentsCard />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div>
            <CorpusInsightsCard />
          </div>

          <div>
            <NetworkBreakdownCard />
          </div>

          <div className="xl:col-span-2">
            <CategoryDonut categories={data.categories} />
          </div>
        </div>

        <div className="mt-6">
          <RecentScansTable scans={data.recentScans} />
        </div>

        <div>
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
        </div>
      </div>
    </div>
  );
}
