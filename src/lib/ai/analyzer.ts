import "server-only";

import type { AnalysisReport } from "@/lib/scam-detector";
import { AiError, requestChatJson, type AiErrorKind } from "./client";
import { getAiConfig } from "./config";
import { buildUserPrompt, SYSTEM_PROMPT } from "./prompt";
import { parseAiAnalysis, type AiAnalysis } from "./schemas";

export type AiRunOutcome =
  | { ok: true; analysis: AiAnalysis; model: string }
  | { ok: false; reason: AiErrorKind | "not_configured" };

export async function runAiAnalysis(
  text: string,
  rulesReport: AnalysisReport
): Promise<AiRunOutcome> {
  const config = getAiConfig();
  if (!config) {
    return { ok: false, reason: "not_configured" };
  }

  try {
    const raw = await requestChatJson(
      config,
      SYSTEM_PROMPT,
      buildUserPrompt(text, rulesReport)
    );
    return { ok: true, analysis: parseAiAnalysis(raw), model: config.model };
  } catch (error) {
    if (error instanceof AiError) {
      return { ok: false, reason: error.kind };
    }
    return { ok: false, reason: "unavailable" };
  }
}
