"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Globe,
  Link2,
  RefreshCw,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";

import { UrlReportView } from "@/components/scanner/url-report-view";
import { ScannerProgress } from "@/components/scanner/scanner-progress";
import type { UrlReport } from "@/lib/url-analyzer";
import { URL_EXAMPLES } from "@/lib/url-examples";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type UrlScannerStatus = "idle" | "scanning" | "done" | "error";

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

export function UrlScanner() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<UrlScannerStatus>("idle");
  const [selectedExampleId, setSelectedExampleId] = useState<string | null>(null);
  const [report, setReport] = useState<UrlReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (status === "idle") inputRef.current?.focus();
  }, [status]);

  function handleSelectExample(id: string) {
    const example = URL_EXAMPLES.find((item) => item.id === id);
    if (!example) return;
    setValue(example.url);
    setSelectedExampleId(id);
  }

  async function handleAnalyze() {
    const url = value.trim();
    if (!url || status === "scanning") return;

    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("scanning");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/analyze/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      const data = (await response.json()) as { report?: UrlReport };
      if (!data.report || typeof data.report !== "object") {
        throw new Error(GENERIC_ERROR_MESSAGE);
      }

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

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "idle" ? (
        <motion.div key="input" {...VIEW_TRANSITION}>
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="url-scanner-input" className="text-sm font-medium">
                  Link you want checked
                </label>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheckIcon />
                  The link is never opened
                </p>
              </div>

              <div className="relative">
                <Globe
                  aria-hidden="true"
                  className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  ref={inputRef}
                  id="url-scanner-input"
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value);
                    setSelectedExampleId(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void handleAnalyze();
                  }}
                  placeholder="https://example.com/…"
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={2048}
                  className="pr-4 pl-10 font-mono text-sm"
                  aria-describedby="url-scanner-hint"
                />
              </div>
              <p id="url-scanner-hint" className="sr-only">
                Press Enter to run the analysis.
              </p>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <Button
                  onClick={() => void handleAnalyze()}
                  disabled={!value.trim()}
                  className="min-w-[11rem]"
                >
                  <ShieldAlert data-icon="inline-start" />
                  Analyze URL
                </Button>
              </div>

              <div className="border-t pt-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  No link handy? Load a typical scam-link example:
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {URL_EXAMPLES.map((example) => (
                    <button
                      key={example.id}
                      type="button"
                      onClick={() => handleSelectExample(example.id)}
                      aria-pressed={selectedExampleId === example.id}
                      className={cn(
                        "cursor-pointer rounded-lg border px-3 py-2.5 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        selectedExampleId === example.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-foreground/30 hover:bg-muted/40"
                      )}
                    >
                      <span className="block text-xs font-semibold">
                        {example.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                        {example.note}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}

      {status === "scanning" ? (
        <motion.div key="scanning" {...VIEW_TRANSITION}>
          <ScannerProgress onCancel={handleCancelScan} variant="url" />
        </motion.div>
      ) : null}

      {status === "error" ? (
        <motion.div key="error" {...VIEW_TRANSITION}>
          <Card>
            <CardContent className="py-10 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-danger/30 bg-danger/10">
                <TriangleAlert className="size-5 text-danger" />
              </span>
              <h2 className="mt-4 text-base font-semibold">Scan didn’t finish</h2>
              <p
                role="alert"
                className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground"
              >
                {errorMessage ?? GENERIC_ERROR_MESSAGE}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button onClick={() => void handleAnalyze()}>
                  <RefreshCw data-icon="inline-start" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}

      {status === "done" && report ? (
        <motion.div key="result" {...VIEW_TRANSITION}>
          <UrlReportView report={report} onReset={handleReset} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ShieldCheckIcon() {
  return (
    <>
      <Link2 aria-hidden="true" className="size-3.5" />
      Analyzed structurally — never visited
    </>
  );
}
