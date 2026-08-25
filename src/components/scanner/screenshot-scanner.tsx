"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileImage,
  ImageUp,
  RefreshCw,
  ShieldAlert,
  Trash2,
  TriangleAlert,
} from "lucide-react";

import { ReportView } from "@/components/scanner/report-view";
import { ScannerProgress } from "@/components/scanner/scanner-progress";
import type { ScanReport } from "@/lib/scan-report";
import {
  ACCEPTED_DROPZONE_ACCEPT,
  MAX_SCREENSHOT_BYTES,
  describeValidationError,
  validateClientFile,
  type ScreenshotValidationCode,
} from "@/lib/screenshots";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ScreenshotStatus = "idle" | "scanning" | "done" | "error";

const VIEW_TRANSITION = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

const GENERIC_ERROR_MESSAGE =
  "We couldn’t complete your scan. Please check your connection and try again.";

function formatBytes(size: number): string {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

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

export function ScreenshotScanner() {
  const [status, setStatus] = useState<ScreenshotStatus>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<
    ScreenshotValidationCode | "generic" | null
  >(null);
  const [report, setReport] = useState<ScanReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragDepth = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function adoptFile(file: File) {
    const validation = validateClientFile(file);
    if (validation) {
      setValidationError(validation);
      setSelectedFile(null);
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return null;
      });
      return;
    }

    setValidationError(null);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
    setSelectedFile(file);
  }

  function handleRemove() {
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setSelectedFile(null);
    setValidationError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    adoptFile(file);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    adoptFile(file);
  }

  function handleDragEnter(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragging(false);
  }

  async function handleAnalyze() {
    if (!selectedFile || status === "scanning") return;

    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("scanning");
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("screenshot", selectedFile, selectedFile.name);

      const response = await fetch("/api/analyze/screenshot", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      const data = (await response.json()) as { report?: ScanReport };
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
    handleRemove();
    setReport(null);
    setErrorMessage(null);
    setStatus("idle");
  }

  const hasImage = selectedFile !== null && previewUrl !== null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "idle" ? (
        <motion.div key="input" {...VIEW_TRANSITION}>
          <Card>
            <CardContent className="space-y-4">
              {!hasImage ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(event) => event.preventDefault()}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onClick={() => inputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      inputRef.current?.click();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload a screenshot by clicking or dropping a file"
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/30 hover:border-foreground/30 hover:bg-muted/50"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-full border bg-background shadow-sm transition-transform",
                      isDragging && "scale-110 border-primary"
                    )}
                  >
                    <ImageUp
                      className={cn(
                        "size-6 text-muted-foreground transition-colors",
                        isDragging && "text-primary"
                      )}
                    />
                  </span>
                  <p className="mt-4 text-sm font-medium">
                    {isDragging
                      ? "Drop your screenshot here"
                      : "Drag & drop a screenshot here"}
                  </p>
                  <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
                    or{" "}
                    <span className="font-medium text-foreground underline underline-offset-2">
                      click to browse your files
                    </span>
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    {["PNG", "JPG", "JPEG", "WebP"].map((format) => (
                      <span
                        key={format}
                        className="rounded-full border bg-background px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
                      >
                        {format}
                      </span>
                    ))}
                    <span className="rounded-full border bg-background px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                      Max {Math.round(MAX_SCREENSHOT_BYTES / (1024 * 1024))} MB
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-xl border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl ?? ""}
                      alt="Screenshot preview of the message you want analyzed"
                      className="mx-auto max-h-96 w-auto max-w-full object-contain"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleRemove}
                      aria-label="Remove image"
                      className="absolute top-3 right-3 size-10 bg-background/90 backdrop-blur sm:size-9"
                    >
                      <Trash2 />
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                      <FileImage className="size-4 shrink-0" />
                      <span className="truncate font-medium text-foreground">
                        {selectedFile.name}
                      </span>
                      <span className="shrink-0 tabular-nums">
                        ({formatBytes(selectedFile.size)})
                      </span>
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => inputRef.current?.click()}
                      >
                        Replace
                      </Button>
                      <Button
                        onClick={() => void handleAnalyze()}
                        className="min-w-[10.5rem]"
                      >
                        <ShieldAlert data-icon="inline-start" />
                        Analyze Screenshot
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_DROPZONE_ACCEPT}
                onChange={handleInputChange}
                className="sr-only"
                aria-label="Choose a screenshot file"
              />

              {validationError ? (
                <p
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2.5 text-xs leading-relaxed text-danger"
                >
                  <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
                  {validationError === "generic"
                    ? GENERIC_ERROR_MESSAGE
                    : describeValidationError(validationError)}
                </p>
              ) : null}

              <div className="rounded-xl border border-dashed bg-muted/40 px-6 py-8 text-center">
                <h2 className="text-sm font-medium">How it works</h2>
                <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  Take a screenshot of the suspicious message, drop it above,
                  and we extract the text with OCR before running the full
                  scam analysis: same engine, same explainable report.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}

      {status === "scanning" ? (
        <motion.div key="scanning" {...VIEW_TRANSITION}>
          <ScannerProgress onCancel={handleCancelScan} variant="screenshot" />
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
                Scan didn’t finish
              </h2>
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
                  Choose a Different Image
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
            analyzedText={report.extractedText ?? ""}
            onReset={handleReset}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
