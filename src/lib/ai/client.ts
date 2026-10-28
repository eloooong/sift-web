import "server-only";

import type { AiConfig } from "./config";
import { AI_RESPONSE_SCHEMA, extractJsonObject } from "./schemas";

export type AiErrorKind =
  | "timeout"
  | "rate_limit"
  | "unavailable"
  | "invalid_response";

export class AiError extends Error {
  readonly kind: AiErrorKind;

  constructor(kind: AiErrorKind) {
    super(`AI request failed: ${kind}`);
    this.name = "AiError";
    this.kind = kind;
  }
}

type ChatCompletionPayload = {
  choices?: Array<{ finish_reason?: string; message?: { content?: unknown } }>;
};

export async function requestChatJson(
  config: AiConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<Record<string, unknown>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    // Groq's GPT-OSS models support strict schemas. Other compatible services
    // retain JSON mode so providers without schema support continue to work.
    const strictSchema =
      new URL(config.baseUrl).hostname === "api.groq.com" &&
      ["openai/gpt-oss-120b", "openai/gpt-oss-20b"].includes(config.model);
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.2,
        max_tokens: 2400,
        response_format: strictSchema
          ? {
              type: "json_schema",
              json_schema: {
                name: "scam_analysis",
                strict: true,
                schema: AI_RESPONSE_SCHEMA,
              },
            }
          : { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (response.status === 429) {
      throw new AiError("rate_limit");
    }
    if (response.status === 400) {
      let code: unknown;
      try {
        const errorPayload = await response.json();
        code = errorPayload?.error?.code;
      } catch {
        if (controller.signal.aborted) throw new AiError("timeout");
      }
      if (code === "json_validate_failed") throw new AiError("invalid_response");
    }
    if (!response.ok) {
      throw new AiError("unavailable");
    }

    let payload: ChatCompletionPayload | null;
    try {
      payload = (await response.json()) as ChatCompletionPayload | null;
    } catch {
      throw new AiError(
        controller.signal.aborted ? "timeout" : "invalid_response"
      );
    }

    const choice = payload?.choices?.[0];
    if (choice?.finish_reason === "length") throw new AiError("invalid_response");
    const content = choice?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new AiError("invalid_response");
    }

    try {
      return extractJsonObject(content);
    } catch {
      throw new AiError("invalid_response");
    }
  } catch (error) {
    if (error instanceof AiError) throw error;
    if (controller.signal.aborted) throw new AiError("timeout");
    throw new AiError("unavailable");
  } finally {
    clearTimeout(timeout);
  }
}
