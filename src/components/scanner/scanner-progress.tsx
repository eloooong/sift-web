"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TEXT_SCAN_STEPS = [
  "Scanning message…",
  "Checking suspicious patterns…",
  "Analyzing risk signals…",
  "Preparing your security report…",
] as const;

const SCREENSHOT_SCAN_STEPS = [
  "Uploading your screenshot securely…",
  "Reading text from the image (OCR)…",
  "Checking suspicious patterns…",
  "Preparing your security report…",
] as const;

const STEP_DURATION_MS = 900;

export function ScannerProgress({
  onCancel,
  variant = "text",
}: {
  onCancel: () => void;
  variant?: "text" | "screenshot";
}) {
  const [activeStep, setActiveStep] = useState(0);

  const isScreenshot = variant === "screenshot";
  const scanSteps = isScreenshot ? SCREENSHOT_SCAN_STEPS : TEXT_SCAN_STEPS;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, scanSteps.length - 1));
    }, STEP_DURATION_MS);
    return () => clearInterval(interval);
  }, [scanSteps.length]);

  return (
    <Card aria-live="polite" role="status">
      <CardContent className="py-2">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-muted/60">
            <Loader2 className="size-5 animate-spin text-foreground" />
          </span>
          <div>
            <p className="text-sm font-medium">
              {isScreenshot ? "Analyzing your screenshot" : "Analyzing your message"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isScreenshot
                ? "OCR plus the full analysis pipeline — this can take up to a minute."
                : "This usually takes a few seconds."}
            </p>
          </div>
        </div>

        <ul className="mt-5 space-y-2.5 border-t pt-4">
          {scanSteps.map((step, index) => {
            const isDone = index < activeStep;
            const isActive = index === activeStep;
            return (
              <li
                key={step}
                className={cn(
                  "flex items-center gap-2.5 text-sm transition-opacity",
                  isDone || isActive
                    ? "text-foreground"
                    : "text-muted-foreground/50"
                )}
              >
                {isDone ? (
                  <Check className="size-4 shrink-0 text-success" />
                ) : (
                  <span
                    className={cn(
                      "size-4 shrink-0 rounded-full border",
                      isActive ? "border-foreground/40" : "border-border"
                    )}
                  />
                )}
                {isDone ? step.replace("…", "") : step}
                {!isDone ? <span className="sr-only">{step}</span> : null}
                {isActive && index === scanSteps.length - 1 ? (
                  <Loader2
                    aria-hidden="true"
                    className="size-3.5 shrink-0 animate-spin text-muted-foreground"
                  />
                ) : null}
              </li>
            );
          })}
        </ul>

        <div
          aria-hidden="true"
          className="mt-5 h-1 overflow-hidden rounded-full bg-muted border-t-0"
        >
          <div className="h-full w-1/3 animate-[scanner-sweep_1.4s_ease-in-out_infinite] rounded-full bg-foreground/30" />
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 border-t pt-4">
          <p className="font-mono text-[11px] text-muted-foreground">
            {isScreenshot
              ? "OCR · Hybrid engine · processed in memory"
              : "Hybrid engine · AI analysis via our secure server"}
          </p>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Cancel
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
