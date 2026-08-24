import type { ScamCategoryDef } from "./categories";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type SignalCategoryId =
  | "urgency"
  | "prize"
  | "financial"
  | "credential"
  | "link"
  | "job"
  | "investment"
  | "loan"
  | "romance";

export type DetectedSignal = {
  id: string;
  category: SignalCategoryId;
  label: string;
  explanation: string;
  weight: number;
  evidence: string;
};

export type ScamCategory = ScamCategoryDef;

export type { ScamCategoryId, ScamCategoryDef } from "./categories";

export type RiskBreakdownRow = {
  category: SignalCategoryId;
  label: string;
  total: number;
};

export type AnalysisReport = {
  riskScore: number;
  riskLevel: RiskLevel;
  category: ScamCategory | null;
  confidence: number;
  signals: DetectedSignal[];
  breakdown: RiskBreakdownRow[];
  summary: string;
  recommendedActions: string[];
};
