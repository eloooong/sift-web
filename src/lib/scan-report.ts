import type { RiskLevel, SignalCategoryId } from "@/lib/scam-detector";
import type { AnalysisReport } from "@/lib/scam-detector";
import type { ScamCategoryDef } from "@/lib/scam-detector/categories";

export type ScanFlag = {
  title: string;
  evidence: string;
  explanation: string;
  iconId?: SignalCategoryId;
};

export type ScanBreakdownRow = {
  label: string;
  total: number;
};

export type ScanSource = "text" | "screenshot";

export type ScanReport = {
  id: string;
  createdAt: string;
  source: ScanSource;
  analysisMode: "ai" | "rules";
  warning: string | null;
  riskScore: number;
  riskLevel: RiskLevel;
  category: ScamCategoryDef | null;
  confidence: number;
  summary: string;
  flags: ScanFlag[];
  breakdown: ScanBreakdownRow[];
  recommendedActions: string[];
  /** Raw text recovered by OCR when the scan came from a screenshot. */
  extractedText?: string;
};

export function ruleReportToScan(
  report: AnalysisReport,
  id: string,
  createdAt: string
): ScanReport {
  return {
    id,
    createdAt,
    source: "text",
    analysisMode: "rules",
    warning: null,
    riskScore: report.riskScore,
    riskLevel: report.riskLevel,
    category: report.category,
    confidence: report.confidence,
    summary: report.summary,
    flags: report.signals.map((signal) => ({
      title: signal.label,
      evidence: signal.evidence,
      explanation: signal.explanation,
      iconId: signal.category,
    })),
    breakdown: report.breakdown.map((row) => ({
      label: row.label,
      total: row.total,
    })),
    recommendedActions: report.recommendedActions,
  };
}
