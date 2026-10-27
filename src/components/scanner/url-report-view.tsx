"use client";

import { useMemo, useState } from "react";
import {
  AtSign,
  Check,
  CheckCircle2,
  Copy,
  Fingerprint,
  Globe,
  Link2,
  ListTree,
  Lock,
  LockOpen,
  RotateCcw,
  SearchCheck,
  ShieldAlert,
  TriangleAlert,
  AlertCircle,
  Info,
  CircleDot,
  type LucideIcon,
} from "lucide-react";

import { AnimatedScore } from "@/components/shared/count-up";
import { useLang } from "@/components/providers/language-provider";
import type { DictKey } from "@/lib/i18n/dictionary";
import { RiskBadge } from "@/components/shared/risk-badge";
import { RiskMeter } from "@/components/scanner/risk-meter";
import type { UrlReport, UrlSeverity, UrlVerdict } from "@/lib/url-analyzer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const SEVERITY_STYLES: Record<
  UrlSeverity,
  { icon: LucideIcon; className: string; badgeClassName: string; labelKey: DictKey }
> = {
  critical: {
    icon: ShieldAlert,
    className: "bg-danger/10 text-danger",
    badgeClassName: "border-danger/40 bg-danger/10 text-danger",
    labelKey: "url.severity.critical",
  },
  high: {
    icon: TriangleAlert,
    className: "bg-danger/10 text-danger",
    badgeClassName: "border-danger/30 bg-danger/5 text-danger",
    labelKey: "url.severity.high",
  },
  medium: {
    icon: AlertCircle,
    className: "bg-warning/10 text-warning",
    badgeClassName: "border-amber-300 bg-amber-50 text-amber-700",
    labelKey: "url.severity.medium",
  },
  low: {
    icon: Info,
    className: "bg-muted text-muted-foreground",
    badgeClassName: "border-border bg-muted/60 text-muted-foreground",
    labelKey: "url.severity.low",
  },
  info: {
    icon: CircleDot,
    className: "bg-muted text-muted-foreground",
    badgeClassName: "border-border bg-background text-muted-foreground",
    labelKey: "url.severity.info",
  },
};

const VERDICT_LABEL_KEYS: Record<UrlVerdict, DictKey> = {
  "no-signals": "url.verdict.no-signals",
  caution: "url.verdict.caution",
  suspicious: "url.verdict.suspicious",
  dangerous: "url.verdict.dangerous",
  blocked: "url.verdict.blocked",
};

const VERDICT_CHIP_STYLES: Record<UrlVerdict, string> = {
  "no-signals": "border-green-200 bg-green-50 text-green-700",
  caution: "border-amber-200 bg-amber-50 text-amber-700",
  suspicious: "border-orange-200 bg-orange-50 text-orange-700",
  dangerous: "border-red-200 bg-red-50 text-red-700",
  blocked: "border-border bg-muted text-muted-foreground",
};

const SCORE_TEXT_COLORS: Record<UrlReport["riskLevel"], string> = {
  low: "text-success",
  medium: "text-amber-600",
  high: "text-danger",
  critical: "text-danger",
};

function formatScanTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" });
}

export function UrlReportView({
  report,
  onReset,
}: {
  report: UrlReport;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [showParams, setShowParams] = useState(false);
  const { t } = useLang();

  const strongCount = useMemo(
    () =>
      report.signals.filter(
        (signal) => signal.severity === "high" || signal.severity === "critical"
      ).length,
    [report.signals]
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildPlainText(report));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="gap-4">
          <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            Scan complete · {formatScanTime(report.createdAt)}
          </p>

          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="space-y-2.5">
              <RiskBadge level={report.riskLevel} />
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                    VERDICT_CHIP_STYLES[report.verdict]
                  )}
                >
                  {t(VERDICT_LABEL_KEYS[report.verdict])}
                </span>
                {report.reputation ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/60 px-2.5 py-0.5 text-xs font-medium">
                    <Globe className="size-3 text-muted-foreground" />
                    Reputation: {report.reputation.status}
                  </span>
                ) : null}
              </div>
            </div>
            <p aria-hidden="true" className="flex items-baseline gap-1 leading-none">
              <span
                className={cn(
                  "text-5xl font-bold tracking-tight tabular-nums",
                  SCORE_TEXT_COLORS[report.riskLevel]
                )}
              >
                <AnimatedScore value={report.riskScore} />
              </span>
              <span className="text-base font-medium text-muted-foreground">/100</span>
            </p>
          </div>

          <RiskMeter score={report.riskScore} level={report.riskLevel} />

          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted-foreground">
            {report.signals.length}{" "}
            {report.signals.length === 1 ? t("url.signalFound") : t("url.signalsFound")}
            <span aria-hidden="true" className="text-border">|</span>
            {strongCount} {t("url.signalsStrong")}
            <span aria-hidden="true" className="text-border">|</span>
            {t("url.neverVisited")}
          </p>
        </CardHeader>

        <CardContent>
          <Separator className="mb-4" />
          <h2 className="mb-1.5 text-base font-semibold">{t("report.whatThisMeans")}</h2>
          <p className="text-base leading-relaxed">{report.summary}</p>
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
                  className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground"
                >
                  {index + 1}
                </span>
                <p className="text-base leading-relaxed">{action}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 />
            {t("url.addressBreakdown")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <UrlRow
            icon={report.protocol === "https" ? Lock : LockOpen}
            label={t("url.protocol")}
            value={report.protocol.toUpperCase()}
            tone={report.protocol === "https" ? "ok" : "warn"}
          />
          <UrlRow icon={Globe} label={t("url.domain")} value={report.domain} mono />
          <UrlRow
            icon={AtSign}
            label={t("url.hostname")}
            value={report.hostname}
            mono
          />
          {report.subdomains.length > 0 ? (
            <UrlRow
              icon={ListTree}
              label={t("url.subdomains")}
              value={report.subdomains.join(" · ")}
              mono
            />
          ) : null}
          <UrlRow icon={Link2} label={t("url.path")} value={report.path || "/"} mono />
          <UrlRow
            icon={ListTree}
            label={t("url.queryParams")}
            value={
              report.queryParams.length === 0
                ? t("url.paramsNone")
                : `${report.queryParams.length} ${report.queryParams.length === 1 ? t("url.paramCount") : t("url.paramCountPlural")}`
            }
          />
          {report.queryParams.length > 0 ? (
            <button
              type="button"
              onClick={() => setShowParams((value) => !value)}
              aria-expanded={showParams}
              className="mt-1 w-full cursor-pointer rounded-lg border bg-muted/40 px-3 py-2 text-left text-sm min-h-11 font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showParams ? t("url.hideParams") : t("url.showParams")}
            </button>
          ) : null}
          {showParams ? (
            <ul className="space-y-1 rounded-lg border bg-muted/30 p-3 font-mono text-sm break-all">
              {report.queryParams.map((param) => (
                <li key={`${param.name}-${param.value}`}>
                  <span className="font-semibold">{param.name}</span>
                  {" = "}
                  <span className="text-muted-foreground">{param.value}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SearchCheck />
            {t("url.securitySignals")}
            <span className="font-normal text-muted-foreground">
              ({report.signals.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {report.signals.length === 0 ? (
            <p className="text-base leading-relaxed text-muted-foreground">
              {t("url.noSignalsBody")}
            </p>
          ) : (
            <ul className="space-y-3">
              {report.signals.map((signal, index) => {
                const style = SEVERITY_STYLES[signal.severity];
                const Icon = style.icon;
                return (
                  <li
                    key={`${signal.id}-${index}`}
                    className="rounded-lg border p-3 sm:p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md",
                            style.className
                          )}
                        >
                          <Icon className="size-3.5" />
                        </span>
                        <p className="min-w-0 pt-0.5 text-sm leading-snug font-semibold">
                          {signal.label}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap",
                          style.badgeClassName
                        )}
                      >
                        {t(style.labelKey)}
                      </span>
                    </div>

                    {signal.evidence ? (
                      <blockquote className="mt-2.5 rounded-md border border-danger/50 bg-danger/5 py-2 pr-3 pl-3">
                        <p className="font-mono text-sm leading-relaxed break-all text-foreground/80">
                          {signal.evidence}
                        </p>
                      </blockquote>
                    ) : null}

                    <p className="mt-2.5 text-base leading-relaxed text-foreground">
                      {signal.explanation}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {report.impersonation ? (
        <Card size="sm" className="border-danger/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="text-danger" />
              {t("url.impersonationTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-base leading-relaxed">
              {t("url.imitates")}{" "}
              <span className="font-semibold">{report.impersonation.brandLabel}</span>.
              {" "}{report.impersonation.reason}
            </p>
            <p className="flex flex-wrap items-center gap-2 pt-1 text-sm text-muted-foreground">
              {t("url.officialDomain")}
              <span className="rounded-md border bg-muted/50 px-2 py-0.5 font-mono text-sm font-semibold text-foreground">
                {report.impersonation.officialDomain}
              </span>
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button onClick={onReset} className="min-h-11">
          <RotateCcw data-icon="inline-start" />
          {t("url.checkAnother")}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="min-h-11">
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
      </div>

      <p className="px-1 text-sm leading-relaxed text-muted-foreground">
        {t("url.disclaimer")}
      </p>
    </div>
  );
}

function UrlRow({
  icon: Icon,
  label,
  value,
  mono,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  mono?: boolean;
  tone?: "ok" | "warn";
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-2 last:border-b-0">
      <span className="flex shrink-0 items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon aria-hidden="true" className="size-3.5" />
        {label}
      </span>
      <span
        className={cn(
          "min-w-0 truncate text-right text-[13px]",
          mono && "font-mono text-xs break-all",
          tone === "warn" && "font-semibold text-warning",
          tone === "ok" && "text-success"
        )}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

function buildPlainText(report: UrlReport): string {
  const lines = [
    "SIFT: URL SECURITY REPORT",
    `Scanned: ${formatScanTime(report.createdAt)}`,
    `URL: ${report.normalizedUrl}`,
    `Risk score: ${report.riskScore}/100 (${report.riskLevel.toUpperCase()})`,
    `Protocol: ${report.protocol.toUpperCase()}   Domain: ${report.domain}`,
    ...(report.impersonation
      ? [
          `Impersonation: ${report.impersonation.brandLabel} (${report.impersonation.reason})`,
        ]
      : []),
    "",
    `SECURITY SIGNALS (${report.signals.length})`,
    ...(report.signals.length
      ? report.signals.map(
          (signal) => `- [${signal.severity}] ${signal.label}: ${signal.explanation}`
        )
      : ["None detected"]),
    "",
    "RECOMMENDED ACTIONS",
    ...report.recommendedActions.map((action, index) => `${index + 1}. ${action}`),
    "",
    "(The link was analyzed structurally and never visited.)",
  ];
  return lines.join("\n");
}
