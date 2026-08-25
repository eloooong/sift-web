"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useLang } from "@/components/providers/language-provider";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eraser,
  MessageSquareWarning,
  RefreshCw,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";

import { ReportView } from "@/components/scanner/report-view";
import { ScannerProgress } from "@/components/scanner/scanner-progress";
import {
  EXAMPLE_SCAMS,
  MAX_INPUT_CHARS,
} from "@/lib/examples";
import type { ScanReport } from "@/lib/scan-report";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ScannerStatus = "idle" | "scanning" | "done" | "error";

const EMPTY_STATE_CHANNELS = ["SMS", "Email", "Messenger", "URLs"] as const;

const VIEW_TRANSITION = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

const GENERIC_ERROR_MESSAGE =
  "We couldn’t complete your scan. Please check your connection and try again.";

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as {
      error?: { message?: unknown };
    };
    if (typeof data.error?.message === "string" && data.error.message) {
      return data.error.message;
    }
  } catch {
    // fall through to generic message
  }
  return GENERIC_ERROR_MESSAGE;
}

export function ScannerInput() {
  const searchParams = useSearchParams();
  const { lang, t } = useLang();
  const [initialExample] = useState(() => {
    const exampleId = searchParams.get("example");
    return EXAMPLE_SCAMS.find((item) => item.id === exampleId) ?? null;
  });
  const [value, setValue] = useState(initialExample?.sampleText ?? "");
  const [status, setStatus] = useState<ScannerStatus>("idle");
  const [selectedExampleId, setSelectedExampleId] = useState<string | null>(
    initialExample?.id ?? null
  );
  const [report, setReport] = useState<ScanReport | null>(null);
  const [analyzedText, setAnalyzedText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (status === "idle") {
      textareaRef.current?.focus();
    }
  }, [status]);

  const usageRatio = value.length / MAX_INPUT_CHARS;
  const counterClassName =
    usageRatio >= 1
      ? "text-danger"
      : usageRatio >= 0.8
        ? "text-amber-600"
        : "text-muted-foreground";

  function handleChange(next: string) {
    setValue(next);
    setSelectedExampleId(null);
  }

  function handleSelectExample(id: string) {
    const example = EXAMPLE_SCAMS.find((item) => item.id === id);
    if (!example) return;
    setValue(example.sampleText);
    setSelectedExampleId(id);
  }

  function handleClear() {
    setValue("");
    setSelectedExampleId(null);
    textareaRef.current?.focus();
  }

  async function handleAnalyze() {
    const text = value.trim();
    if (!text || status === "scanning") return;

    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("scanning");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      const data = (await response.json()) as { report?: ScanReport };
      if (!data.report || typeof data.report !== "object") {
        throw new Error(GENERIC_ERROR_MESSAGE);
      }

      setAnalyzedText(text);
      setReport(data.report);
      setStatus("done");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : GENERIC_ERROR_MESSAGE
      );
      setStatus("error");
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  }

  function handleCancelScan() {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus("idle");
  }

  function handleReset() {
    setReport(null);
    setValue("");
    setSelectedExampleId(null);
    setErrorMessage(null);
    setStatus("idle");
  }

  const canAnalyze = value.trim().length > 0;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "idle" ? (
        <motion.div key="input" {...VIEW_TRANSITION}>
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="scanner-input" className="text-sm font-medium">
                  {t("input.label")}
                </label>
                <p
                  aria-live="polite"
                  className={cn(
                    "font-mono text-xs tabular-nums",
                    counterClassName
                  )}
                >
                  {value.length.toLocaleString()} /{" "}
                  {MAX_INPUT_CHARS.toLocaleString()}
                </p>
              </div>

              <Textarea
                ref={textareaRef}
                id="scanner-input"
                value={value}
                onChange={(event) => handleChange(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    (event.metaKey || event.ctrlKey) &&
                    event.key === "Enter"
                  ) {
                    void handleAnalyze();
                  }
                }}
                placeholder={t("input.placeholder")}
                maxLength={MAX_INPUT_CHARS}
                rows={8}
                className="resize-none font-mono text-sm leading-relaxed"
                aria-describedby="scanner-input-hint"
              />
              <p id="scanner-input-hint" className="sr-only">
                {t("input.keyboardHint")}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={!value}
                >
                  <Eraser data-icon="inline-start" />
                  {t("input.clear")}
                </Button>

                <Button
                  onClick={() => void handleAnalyze()}
                  disabled={!canAnalyze}
                  className="min-w-[10.5rem]"
                >
                  <ShieldAlert data-icon="inline-start" />
                  {t("input.analyze")}
                </Button>
              </div>

              <div className="border-t pt-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {t("input.exampleLead")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_SCAMS.map((example) => (
                    <Button
                      key={example.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectExample(example.id)}
                      aria-pressed={selectedExampleId === example.id}
                      className={cn(
                        "rounded-full",
                        selectedExampleId === example.id &&
                          "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                      )}
                    >
                      {lang === "fil"
                        ? (example.labelFil ?? example.label)
                        : example.label}
                    </Button>
                  ))}
                </div>
              </div>

              {!canAnalyze ? (
                <div className="rounded-xl border border-dashed bg-muted/40 px-6 py-10 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border bg-background shadow-sm">
                    <MessageSquareWarning className="size-5 text-muted-foreground" />
                  </span>
                  <h2 className="mt-4 text-sm font-medium">
                    {t("input.emptyTitle")}
                  </h2>
                  <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {t("input.emptyBody")}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    {EMPTY_STATE_CHANNELS.map((channel) => (
                      <span
                        key={channel}
                        className="rounded-full border bg-background px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
                      >
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>
      ) : null}

      {status === "scanning" ? (
        <motion.div key="scanning" {...VIEW_TRANSITION}>
          <ScannerProgress onCancel={handleCancelScan} />
        </motion.div>
      ) : null}

      {status === "error" ? (
        <motion.div key="error" {...VIEW_TRANSITION}>
          <Card>
            <CardContent className="py-10 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-danger/30 bg-danger/10">
                <TriangleAlert className="size-5 text-danger" />
              </span>
              <h2 className="mt-4 text-base font-semibold">
                {lang === "fil" ? "Hindi natapos ang scan" : "Scan didn’t finish"}
              </h2>
              <p
                role="alert"
                className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground"
              >
                {errorMessage ??
                  (lang === "fil"
                    ? "Hindi namin natapos ang scan mo. Pakisuri ang koneksyon at subukan ulit."
                    : GENERIC_ERROR_MESSAGE)}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button onClick={() => void handleAnalyze()}>
                  <RefreshCw data-icon="inline-start" />
                  {lang === "fil" ? "Subukan ulit" : "Try Again"}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  {lang === "fil" ? "Magsimula ulit" : "Start Over"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}

      {status === "done" && report ? (
        <motion.div key="result" {...VIEW_TRANSITION}>
          <ReportView
            report={report}
            analyzedText={analyzedText}
            onReset={handleReset}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function ScannerFooterNote() {
  return (
    <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
      Scans are processed securely through our server and are never stored.
      See{" "}
      <Link href="/#examples" className="font-medium underline underline-offset-2">
        common scam patterns
      </Link>{" "}
      while deciding what to check next.
    </p>
  );
}
