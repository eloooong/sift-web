import "server-only";

import type { AiConfig } from "./config";
import { extractJsonObject } from "./schemas";

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
  choices?: Array<{ message?: { content?: unknown } }>;
};

export async function requestChatJson(
  config: AiConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<Record<string, unknown>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.2,
        max_tokens: 900,
        response_format: { type: "json_object" },
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

    const content = payload?.choices?.[0]?.message?.content;
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
