import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test, { afterEach, mock } from "node:test";

// Run these modules as server code, matching Next's server-only marker alias.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") {
      return {
        url: new URL(
          "../node_modules/next/dist/compiled/server-only/empty.js",
          import.meta.url,
        ).href,
        shortCircuit: true,
      };
    }
    return nextResolve(specifier, context);
  },
});

const { AiError, requestChatJson } = await import("../src/lib/ai/client.ts");
const { runAiAnalysis } = await import("../src/lib/ai/analyzer.ts");
const { analyzeScamText } = await import("../src/lib/scan-pipeline.ts");
const { analyzeMessage } = await import("../src/lib/scam-detector/index.ts");

const config = {
  apiKey: "test-key",
  baseUrl: "https://ai.example.test/v1",
  model: "test-model",
  timeoutMs: 1000,
};
const text = "Pay a processing fee today to claim your raffle prize.";
const validAnalysis = {
  riskScore: 85,
  category: "Prize Scam",
  confidence: 0.9,
  summary: "An unsolicited prize claim asks for an advance fee.",
  redFlags: [{
    title: "Advance fee",
    evidence: "processing fee",
    explanation: "Payment is required before the claimed prize can be received.",
  }],
  recommendations: ["Do not pay. Verify the claim through an official channel."],
};
const envNames = ["AI_API_KEY", "AI_BASE_URL", "AI_MODEL", "AI_TIMEOUT_MS"];
const savedEnv = Object.fromEntries(
  envNames.map((name) => [name, process.env[name]]),
);
afterEach(() => {
  mock.restoreAll();
  for (const name of envNames) {
    if (savedEnv[name] === undefined) delete process.env[name];
    else process.env[name] = savedEnv[name];
  }
});

test("AI transport sends the configured model and accepts a valid JSON response", async () => {
  mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, config.baseUrl + "/chat/completions");
    assert.equal(JSON.parse(options.body).model, config.model);
    assert.equal(options.headers.Authorization, "Bearer test-key");
    return Response.json({
      choices: [{ message: { content: JSON.stringify(validAnalysis) } }],
    });
  });
  assert.deepEqual(await requestChatJson(config, "system", "user"), validAnalysis);
});

for (const [status, reason] of [
  [429, "rate_limit"],
  [401, "unavailable"],
  [503, "unavailable"],
]) {
  test(`AI transport classifies HTTP ${status}`, async () => {
    mock.method(globalThis, "fetch", async () => new Response("", { status }));
    await assert.rejects(
      requestChatJson(config, "system", "user"),
      (error) => error instanceof AiError && error.kind === reason,
    );
  });
}

test("AI timeout covers a stalled body after headers arrive", { timeout: 1000 }, async () => {
  mock.method(globalThis, "fetch", async (_url, options) =>
    new Response(new ReadableStream({
      start(body) {
        options.signal.addEventListener(
          "abort", () => body.error(options.signal.reason), { once: true },
        );
      },
    })),
  );
  await assert.rejects(
    requestChatJson({ ...config, timeoutMs: 30 }, "system", "user"),
    (error) => error instanceof AiError && error.kind === "timeout",
  );
});

test("AI transport rejects a null response as invalid rather than unavailable", async () => {
  mock.method(globalThis, "fetch", async () => Response.json(null));
  await assert.rejects(
    requestChatJson(config, "system", "user"),
    (error) => error instanceof AiError && error.kind === "invalid_response",
  );
});

test("schema-invalid AI output is reported as an invalid response", async () => {
  process.env.AI_API_KEY = "test-key";
  mock.method(globalThis, "fetch", async () =>
    Response.json({ choices: [{ message: { content: "{}" } }] }),
  );
  assert.deepEqual(await runAiAnalysis(text, analyzeMessage(text)), {
    ok: false, reason: "invalid_response",
  });
});

for (const lang of ["en", "fil"]) {
  test(`an unavailable AI provider produces a visible rules fallback warning (${lang})`, async () => {
    process.env.AI_API_KEY = "test-key";
    mock.method(globalThis, "fetch", async () => new Response("", { status: 503 }));
    const report = await analyzeScamText(text, { lang });
    assert.equal(report.analysisMode, "rules");
    assert.equal(typeof report.warning, "string");
    assert.ok(report.warning.length > 20);
    assert.ok(report.summary.length > 0);
  });
}
