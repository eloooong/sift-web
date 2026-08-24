"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  MessageSquareWarning,
  Search,
  X,
} from "lucide-react";

import { ReportCard } from "@/components/reports/report-card";
import { SCAM_CATEGORIES } from "@/lib/scam-detector/categories";
import {
  PLATFORM_LABELS,
  REPORT_PLATFORMS,
  type PublicReportSummary,
  type ReportsMeta,
} from "@/lib/reports/types";

type FeedResponse = {
  reports: PublicReportSummary[];
  meta: ReportsMeta;
  confirmedIds: string[];
};

const PAGE_SIZE = 8;

async function fetchFeedOnce(): Promise<FeedResponse> {
  const response = await fetch("/api/reports", { cache: "no-store" });
  if (!response.ok) throw new Error("failed");
  return (await response.json()) as FeedResponse;
}

export function ReportsBoard({ refreshKey }: { refreshKey: number }) {
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    fetchFeedOnce()
      .then((data) => {
        if (!cancelled) {
          setFeed(data);
          setLoadError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  function handleRetry() {
    setLoading(true);
    fetchFeedOnce()
      .then((data) => {
        setFeed(data);
        setLoadError(false);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }

  const filtered = useMemo(() => {
    if (!feed) return [];
    const needle = query.trim().toLowerCase();

    return feed.reports.filter((report) => {
      if (
        categoryFilter !== "all" &&
        report.categoryId !== categoryFilter
      ) {
        return false;
      }
      if (platformFilter !== "all" && report.platform !== platformFilter) {
        return false;
      }
      if (!needle) return true;
      const haystack = [
        report.shortDescription,
        report.categoryLabel,
        report.platformLabel,
        report.sender ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [feed, query, categoryFilter, platformFilter]);

  function resetFilters() {
    setQuery("");
    setCategoryFilter("all");
    setPlatformFilter("all");
    setVisible(PAGE_SIZE);
  }

  const hasActiveFilters =
    query.trim() !== "" || categoryFilter !== "all" || platformFilter !== "all";

  const confirmedSet = useMemo(
    () => new Set(feed?.confirmedIds ?? []),
    [feed]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        <StatBlock
          label="Reports"
          value={feed ? String(feed.meta.approvedCount) : "—"}
        />
        <StatBlock
          label="Confirmations"
          value={feed ? String(feed.meta.totalConfirmations) : "—"}
        />
        <StatBlock
          label="In review"
          value={feed ? String(feed.meta.awaitingReview) : "—"}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search reports</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Search descriptions, handles, platforms…"
            className="h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
          />
        </label>

        <FilterSelect
          label="Filter by category"
          value={categoryFilter}
          onChange={(value) => {
            setCategoryFilter(value);
            setVisible(PAGE_SIZE);
          }}
          options={[
            { value: "all", label: "All categories" },
            ...SCAM_CATEGORIES.map((category) => ({
              value: category.id,
              label: category.label,
            })),
          ]}
        />

        <FilterSelect
          label="Filter by platform"
          value={platformFilter}
          onChange={(value) => {
            setPlatformFilter(value);
            setVisible(PAGE_SIZE);
          }}
          options={[
            { value: "all", label: "All platforms" },
            ...REPORT_PLATFORMS.map((platform) => ({
              value: platform,
              label: PLATFORM_LABELS[platform],
            })),
          ]}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span aria-live="polite">
          {loading
            ? "Loading reports…"
            : `${filtered.length} ${filtered.length === 1 ? "report" : "reports"}`}
        </span>
        {hasActiveFilters && !loading ? (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 font-medium text-foreground hover:underline"
          >
            <X aria-hidden="true" className="size-3.5" />
            Clear filters
          </button>
        ) : null}
      </div>

      {/* Feed */}
      {loading ? (
        <div className="grid gap-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-xl bg-muted/50"
              role="status"
              aria-label="Loading reports"
            />
          ))}
        </div>
      ) : loadError ? (
        <div className="rounded-xl border border-dashed p-6 text-center">
          <MessageSquareWarning
            aria-hidden="true"
            className="mx-auto size-5 text-muted-foreground"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            The feed couldn&apos;t load.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-3 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <MessageSquareWarning
            aria-hidden="true"
            className="mx-auto size-6 text-muted-foreground"
          />
          <p className="mt-3 text-sm font-medium">No matching reports</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasActiveFilters
              ? "Try loosening the search or filters."
              : "Be the first to warn others — submit a report."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3">
            {filtered.slice(0, visible).map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                confirmed={confirmedSet.has(report.id)}
              />
            ))}
          </div>
          {visible < filtered.length ? (
            <button
              type="button"
              onClick={() => setVisible((value) => value + PAGE_SIZE)}
              className="mx-auto rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Load more ({filtered.length - visible} remaining)
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card px-3 py-2.5">
      <p className="text-lg leading-none font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="mt-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="relative sm:w-44">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-lg border bg-background pr-8 pl-3 text-sm outline-none transition-colors focus:border-ring"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </label>
  );
}
