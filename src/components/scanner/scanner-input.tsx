"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useLang } from "@/components/providers/language-provider";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Eraser,
  RefreshCw,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";

import { ReportView } from "@/components/scanner/report-view";
import { ScannerProgress } from "@/components/scanner/scanner-progress";
import { EXAMPLE_SCAMS, MAX_INPUT_CHARS } from "@/lib/examples";
import type { ScanReport } from "@/lib/scan-report";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ScannerStatus = "idle" | "scanning" | "done" | "error";

const INITIAL_EXAMPLE_COUNT = 3;

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
    initialExample?.id ?? null,
  );
  const [showAllExamples, setShowAllExamples] = useState(
    EXAMPLE_SCAMS.findIndex((example) => example.id === initialExample?.id) >=
      INITIAL_EXAMPLE_COUNT,
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
          : GENERIC_ERROR_MESSAGE,
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
  const visibleExamples = showAllExamples
    ? EXAMPLE_SCAMS
    : EXAMPLE_SCAMS.slice(0, INITIAL_EXAMPLE_COUNT);

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
                    counterClassName,
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
                rows={6}
                className="min-h-40 resize-y text-base leading-relaxed"
                aria-describedby="scanner-input-hint"
              />
              <p
                id="scanner-input-hint"
                className="text-sm leading-relaxed text-muted-foreground"
              >
                {canAnalyze ? t("input.keyboardHint") : t("input.emptyHint")}
              </p>

              <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  onClick={() => void handleAnalyze()}
                  disabled={!canAnalyze}
                  className="min-h-11 w-full sm:w-auto sm:min-w-[10.5rem]"
                >
                  <ShieldAlert data-icon="inline-start" />
                  {t("input.analyze")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={!value}
                  className="min-h-11 self-end"
                >
                  <Eraser data-icon="inline-start" />
                  {t("input.clear")}
                </Button>
              </div>

              <div className="border-t pt-4">
                <p className="mb-3 text-sm font-medium text-muted-foreground">
                  {t("input.exampleLead")}
                </p>
                <div id="scanner-examples" className="flex flex-wrap gap-2">
                  {visibleExamples.map((example) => (
                    <Button
                      key={example.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectExample(example.id)}
                      aria-pressed={selectedExampleId === example.id}
                      className={cn(
                        "min-h-11 h-auto max-w-full rounded-md py-2 text-left whitespace-normal",
                        selectedExampleId === example.id &&
                          "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      )}
                    >
                      {lang === "fil"
                        ? (example.labelFil ?? example.label)
                        : example.label}
                    </Button>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-expanded={showAllExamples}
                  aria-controls="scanner-examples"
                  onClick={() => setShowAllExamples((shown) => !shown)}
                  className="mt-2 min-h-11"
                >
                  {showAllExamples
                    ? t("input.fewerExamples")
                    : t("input.moreExamples")}
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-4 transition-transform",
                      showAllExamples && "rotate-180",
                    )}
                  />
                </Button>
              </div>
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
                {lang === "fil"
                  ? "Hindi natuloy ang pag-check"
                  : "Scan didn’t finish"}
              </h2>
              <p
                role="alert"
                className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground"
              >
                {errorMessage ??
                  (lang === "fil"
                    ? "Hindi natuloy ang pag-check. Tingnan ang internet mo at subukan ulit."
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
