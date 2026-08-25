"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote,
  Briefcase,
  Calculator,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Flag,
  Gift,
  HandCoins,
  Heart,
  Info,
  KeyRound,
  Link2,
  Dices,
  PhoneOff,
  Quote,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { RiskBadge } from "@/components/shared/risk-badge";
import { CategoryBadge } from "@/components/shared/category-badge";
import { RiskMeter } from "@/components/scanner/risk-meter";
import { AnimatedScore } from "@/components/shared/count-up";
import { useLang } from "@/components/providers/language-provider";
import type { SignalCategoryId } from "@/lib/scam-detector";
import type { ScanFlag, ScanReport } from "@/lib/scan-report";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<SignalCategoryId, LucideIcon> = {
  urgency: Timer,
  prize: Gift,
  financial: Banknote,
  credential: KeyRound,
  link: Link2,
  job: Briefcase,
  investment: TrendingUp,
  loan: HandCoins,
  romance: Heart,
  gambling: Dices,
  intel: PhoneOff,
};

const SCORE_TEXT_COLORS: Record<ScanReport["riskLevel"], string> = {
  low: "text-success",
  medium: "text-amber-600",
  high: "text-danger",
  critical: "text-danger",
};

type TextPart = { str: string; flagged: boolean };

function buildHighlightedParts(text: string, flags: ScanFlag[]): TextPart[] {
  const ranges: Array<{ start: number; end: number }> = [];

  for (const flag of flags) {
    if (!flag.evidence) continue;
    if (flag.evidence.includes("…") || flag.evidence.includes("•••")) {
      continue;
    }
    const index = text.toLowerCase().indexOf(flag.evidence.toLowerCase());
    if (index >= 0) {
      ranges.push({ start: index, end: index + flag.evidence.length });
    }
  }

  if (ranges.length === 0) return [{ str: text, flagged: false }];

  ranges.sort((a, b) => a.start - b.start);
  const merged: typeof ranges = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range.start <= last.end) {
      last.end = Math.max(last.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }

  const parts: TextPart[] = [];
  let cursor = 0;
  for (const range of merged) {
    if (range.start > cursor) {
      parts.push({ str: text.slice(cursor, range.start), flagged: false });
    }
    parts.push({ str: text.slice(range.start, range.end), flagged: true });
    cursor = range.end;
  }
  if (cursor < text.length) {
    parts.push({ str: text.slice(cursor), flagged: false });
  }
  return parts;
}

function formatScanTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function buildPlainTextReport(report: ScanReport, text: string): string {
  const isScreenshot = report.source === "screenshot";
  const lines = [
    "SCAMSHIELD PH: SECURITY REPORT",
    `Scanned: ${formatScanTime(report.createdAt)}`,
    `Source: ${isScreenshot ? "Screenshot (OCR)" : "Pasted text"}`,
    `Engine: ${report.analysisMode === "ai" ? "AI analyst + rule-engine cross-check" : "Rule-based engine"}`,
    `Risk score: ${report.riskScore}/100 (${report.riskLevel.toUpperCase()} RISK)`,
    `Category: ${report.category?.label ?? "No specific category"}`,
    `Confidence: ${report.confidence}%`,
    ...(report.warning ? [`Note: ${report.warning}`] : []),
    "",
    "SUMMARY",
    report.summary,
    "",
    `RED FLAGS (${report.flags.length})`,
    ...(report.flags.length
      ? report.flags.map((flag, index) => {
          const evidenceLine = flag.evidence
            ? `\n   Matched: "${flag.evidence}"`
            : "";
          return `${index + 1}. ${flag.title}${evidenceLine}\n   Why it matters: ${flag.explanation}`;
        })
      : ["None detected"]),
    "",
    "RULE-ENGINE POINTS",
    ...report.breakdown.map((row) => `- ${row.label}: +${row.total}`),
    `- FINAL RISK SCORE: ${report.riskScore}/100`,
    "",
    "RECOMMENDED ACTIONS",
    ...report.recommendedActions.map(
      (action, index) => `${index + 1}. ${action}`
    ),
    "",
    isScreenshot ? "--- Extracted screenshot text ---" : "--- Original message ---",
    text.slice(0, 1000),
  ];
  return lines.join("\n");
}

export function ReportView({
  report,
  analyzedText,
  onReset,
}: {
  report: ScanReport;
  analyzedText: string;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const { t } = useLang();

  const isAiMode = report.analysisMode === "ai";
  const isScreenshot = report.source === "screenshot";

  const highlightedParts = useMemo(
    () => buildHighlightedParts(analyzedText, report.flags),
    [analyzedText, report.flags]
  );
  const highlightCount = highlightedParts.filter(
    (part) => part.flagged
  ).length;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        buildPlainTextReport(report, analyzedText)
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-4">
      {report.warning ? (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3"
        >
          <Info className="mt-0.5 size-4 shrink-0 text-warning" />
          <p className="text-xs leading-relaxed text-foreground/80">
            {report.warning}
          </p>
        </div>
      ) : null}

      <Card>
        <CardHeader className="gap-4">
          <p className="flex items-center gap-2 font-mono text-[10px] font-medium tracking-widest text-success uppercase">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            Scan complete · {formatScanTime(report.createdAt)}
          </p>

          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="space-y-2.5">
              <RiskBadge level={report.riskLevel} />
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={report.category} />
                {isScreenshot ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/60 px-2.5 py-0.5 text-xs font-medium">
                    <Camera className="size-3 text-muted-foreground" />
                    {t("report.fromScreenshot")}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/60 px-2.5 py-0.5 text-xs font-medium">
                  {isAiMode ? (
                    <>
                      <Sparkles className="size-3 text-muted-foreground" />
                      {t("report.chip.ai")}
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-3 text-muted-foreground" />
                      {t("report.chip.rules")}
                    </>
                  )}
                </span>
              </div>
            </div>
            <p
              aria-hidden="true"
              className="flex items-baseline gap-1 leading-none"
            >
              <span
                className={cn(
                  "text-5xl font-bold tracking-tight tabular-nums",
                  SCORE_TEXT_COLORS[report.riskLevel]
                )}
              >
                <AnimatedScore value={report.riskScore} />
              </span>
              <span className="text-base font-medium text-muted-foreground">
                /100
              </span>
            </p>
          </div>

          <RiskMeter score={report.riskScore} level={report.riskLevel} />

          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
            {t("report.engineConfidence")}{" "}
            <span className="font-semibold tabular-nums text-foreground">
              {report.confidence}%
            </span>
            <span aria-hidden="true" className="text-border">
              |
            </span>
            {report.flags.length}{" "}
            {report.flags.length === 1 ? t("report.flag") : t("report.flagsFound")}
            <span aria-hidden="true" className="text-border">
              |
            </span>
            {isAiMode ? t("report.engineAi") : t("report.engineRules")}
          </p>
        </CardHeader>

        <CardContent>
          <Separator className="mb-4" />
          <h2 className="mb-1.5 text-sm font-semibold">{t("report.whatThisMeans")}</h2>
          <p className="text-sm leading-relaxed">{report.summary}</p>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag />
            {t("report.redFlags")}
            <span className="font-normal text-muted-foreground">
              ({report.flags.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {report.flags.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("report.redFlagsEmpty")}
            </p>
          ) : (
            <ul className="space-y-3">
              {report.flags.map((flag, index) => {
                const Icon =
                  flag.iconId !== undefined
                    ? CATEGORY_ICONS[flag.iconId]
                    : Flag;
                return (
                  <li key={`${flag.title}-${index}`} className="rounded-lg border p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-x-4 gap-y-1">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-danger/10 text-danger"
                        >
                          <Icon className="size-3.5" />
                        </span>
                        <p className="min-w-0 pt-0.5 text-sm leading-snug font-semibold">
                          <span
                            aria-hidden="true"
                            className="mr-1.5 font-mono text-[11px] font-medium text-muted-foreground"
                          >
                            {index + 1}.
                          </span>
                          {flag.title}
                        </p>
                      </div>
                    </div>

                    {flag.evidence ? (
                      <blockquote className="mt-2.5 rounded-r-md border-l-2 border-danger/50 bg-danger/5 py-2 pr-3 pl-3">
                        <p className="font-mono text-[11px] leading-relaxed break-words text-foreground/80">
                          “{flag.evidence}”
                        </p>
                        <p className="mt-1 text-[10px] tracking-wide text-danger/80 uppercase">
                          {t("report.foundInMessage")}
                        </p>
                      </blockquote>
                    ) : null}

                    <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                      {flag.explanation}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator />
            {t("report.howScoreCalculated")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {report.breakdown.length > 0 ? (
            <ul className="space-y-1.5">
              {report.breakdown.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span>{row.label}</span>
                  <span className="font-mono text-xs font-semibold text-danger tabular-nums">
                    +{row.total}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("report.breakdownNone")}
            </p>
          )}
          <Separator className="my-3" />
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold">{t("report.totalScore")}</span>
            <span className="font-mono text-sm font-bold tabular-nums">
              {report.riskScore}
              <span className="font-normal text-muted-foreground">/100</span>
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {isAiMode ? t("report.pointsNote.ai") : t("report.pointsNote.rules")}
          </p>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="text-success" />
            {t("report.whatToDo")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2.5">
            {report.recommendedActions.map((action, index) => (
              <li key={action} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/10 font-mono text-[10px] font-semibold text-success"
                >
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed">{action}</p>
              </li>
            ))}
          </ol>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <Button onClick={onReset}>
            <RotateCcw data-icon="inline-start" />
            {isScreenshot
              ? t("report.analyzeAnotherScreenshot")
              : t("report.analyzeAnother")}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check data-icon="inline-start" />
                {t("report.copied")}
              </>
            ) : (
              <>
                <Copy data-icon="inline-start" />
                {t("report.copyReport")}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card size="sm">
        <CardHeader>
          <button
            type="button"
            onClick={() => setShowOriginal((value) => !value)}
            aria-expanded={showOriginal}
            className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CardTitle className="flex items-center gap-2">
              <Quote />
              {isScreenshot
                ? t("report.extractedText")
                : t("report.originalMessage")}
              <span className="font-normal text-muted-foreground">
                ({analyzedText.length.toLocaleString()}{" "}
                {t("report.characters")})
              </span>
            </CardTitle>
            <ChevronDown
              aria-hidden="true"
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                showOriginal && "rotate-180"
              )}
            />
          </button>
        </CardHeader>
        <AnimatePresence initial={false}>
          {showOriginal ? (
            <motion.div
              key="original-message"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <CardContent>
                <div className="rounded-lg border bg-muted/40 p-3.5">
                  <p className="text-[13px] leading-relaxed break-words whitespace-pre-wrap">
                    {highlightedParts.map((part, index) =>
                      part.flagged ? (
                        <mark
                          key={index}
                          className="rounded-sm bg-danger/15 px-0.5 font-medium text-danger underline decoration-danger/40 underline-offset-2"
                        >
                          {part.str}
                        </mark>
                      ) : (
                        <span key={index}>{part.str}</span>
                      )
                    )}
                  </p>
                  {isScreenshot ? (
                    <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                      {t("report.ocrNote")}
                    </p>
                  ) : highlightCount > 0 ? (
                    <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span
                        aria-hidden="true"
                        className="inline-block h-2.5 w-2.5 rounded-sm bg-danger/15 ring-1 ring-danger/40"
                      />
                      {t("report.highlightNote")}
                    </p>
                  ) : null}
                </div>
              </CardContent>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Card>

      <p className="px-1 text-xs leading-relaxed text-muted-foreground">
        {isAiMode ? t("report.disclaimer.ai") : t("report.disclaimer.rules")}
      </p>
    </div>
  );
}
