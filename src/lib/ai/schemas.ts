export type AiRedFlag = {
  title: string;
  evidence: string;
  explanation: string;
};

export type AiAnalysis = {
  riskScore: number;
  category: string;
  confidence: number;
  summary: string;
  redFlags: AiRedFlag[];
  recommendations: string[];
};

export class ValidationError extends Error {
  constructor() {
    super("AI response failed validation");
    this.name = "ValidationError";
  }
}

export function extractJsonObject(content: string): Record<string, unknown> {
  const unfenced = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new ValidationError();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(unfenced.slice(start, end + 1));
  } catch {
    throw new ValidationError();
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new ValidationError();
  }
  return parsed as Record<string, unknown>;
}

const KNOWN_CATEGORIES = [
  "Prize Scam",
  "Bank Scam",
  "E-wallet Scam",
  "Delivery Scam",
  "Online Job Scam",
  "Loan Scam",
  "Government Impersonation",
  "Account Verification Scam",
  "Investment Scam",
  "Romance Scam",
  "Phishing",
  "Other",
] as const;

const CATEGORY_SLUGS = new Map<string, string>(
  KNOWN_CATEGORIES.map((category) => [
    category.toLowerCase().replace(/[^a-z]+/g, ""),
    category,
  ])
);

const CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function sanitizeString(value: unknown): string {
  return typeof value === "string"
    ? value.replace(CONTROL_CHARS_REGEX, "").trim()
    : "";
}

function clampNumber(value: unknown, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new ValidationError();
  }
  return Math.min(Math.max(value, min), max);
}

export function normalizeCategory(value: unknown): string {
  const cleaned = sanitizeString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
  if (!cleaned) return "Uncertain";

  const slugMatch = CATEGORY_SLUGS.get(cleaned.toLowerCase().replace(/[^a-z]+/g, ""));
  if (slugMatch) return slugMatch;

  const titleCased = cleaned
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return titleCased.slice(0, 40);
}

function parseRedFlags(value: unknown): AiRedFlag[] {
  if (!Array.isArray(value)) throw new ValidationError();

  const flags: AiRedFlag[] = [];
  for (const entry of value.slice(0, 12)) {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      continue;
    }
    const record = entry as Record<string, unknown>;
    const title = sanitizeString(record.title).slice(0, 140);
    const explanation = sanitizeString(record.explanation).slice(0, 700);
    const evidence = sanitizeString(record.evidence).slice(0, 400);
    if (title.length < 2 || explanation.length < 8) continue;
    flags.push({ title, evidence, explanation });
  }
  return flags;
}

function parseRecommendations(value: unknown): string[] {
  if (!Array.isArray(value)) throw new ValidationError();

  const items: string[] = [];
  for (const entry of value.slice(0, 10)) {
    const text = sanitizeString(entry).slice(0, 320);
    if (text.length < 4) continue;
    items.push(text);
  }
  return items;
}

export function parseAiAnalysis(raw: unknown): AiAnalysis {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new ValidationError();
  }
  const record = raw as Record<string, unknown>;

  const riskScore = Math.round(clampNumber(record.riskScore, 0, 100));

  let confidence = clampNumber(record.confidence, 0, 100);
  if (confidence > 1) confidence = confidence / 100;

  const summary = sanitizeString(record.summary).slice(0, 1500);
  if (!summary) throw new ValidationError();

  const redFlags = parseRedFlags(record.redFlags);
  const recommendations = parseRecommendations(record.recommendations);
  if (recommendations.length === 0) throw new ValidationError();

  return {
    riskScore,
    category: normalizeCategory(record.category),
    confidence,
    summary,
    redFlags,
    recommendations,
  };
}
