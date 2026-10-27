"use client";

import { useState } from "react";
import { ChevronUp, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export function ConfirmButton({
  reportId,
  initialCount,
  initiallyConfirmed,
  size = "sm",
}: {
  reportId: string;
  initialCount: number;
  initiallyConfirmed: boolean;
  size?: "sm" | "lg";
}) {
  const [count, setCount] = useState(initialCount);
  const [confirmed, setConfirmed] = useState(initiallyConfirmed);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function confirm() {
    if (confirmed || busy) return;
    setBusy(true);
    setError(false);
    // Optimistic; rolled back if the server disagrees.
    setConfirmed(true);
    setCount((value) => value + 1);

    try {
      const response = await fetch(`/api/reports/${reportId}/confirm`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("failed");
      const body = (await response.json()) as { confirmations: number };
      setCount(body.confirmations);
    } catch {
      setConfirmed(false);
      setCount((value) => Math.max(initialCount, value - 1));
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={confirm}
        disabled={confirmed || busy}
        aria-pressed={confirmed}
        className={cn(
          "inline-flex min-h-11 min-w-11 items-center gap-1.5 rounded-md border font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          size === "sm" ? "px-3 py-2 text-sm" : "px-4 py-2 text-sm",
          confirmed
            ? "border-success/30 bg-success/10 text-success-foreground"
            : "text-muted-foreground hover:border-foreground/25 hover:text-foreground",
        )}
      >
        {busy ? (
          <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin" />
        ) : (
          <ChevronUp aria-hidden="true" className="size-3.5" />
        )}
        {confirmed ? "Confirmed" : "Confirm"}
        <span className="font-mono tabular-nums">{count}</span>
      </button>
      {error ? (
        <span role="alert" className="text-sm text-danger-foreground">
          Couldn&apos;t confirm. Try again.
        </span>
      ) : null}
    </span>
  );
}
