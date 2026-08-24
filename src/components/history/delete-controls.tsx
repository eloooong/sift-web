"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/history/confirm-dialog";

export function DeleteScanButton({ entryId }: { entryId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function confirm() {
    setBusy(true);
    setError(false);
    try {
      const response = await fetch(`/api/history/${entryId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("failed");
      setOpen(false);
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Delete this scan"
        onClick={() => setOpen(true)}
        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
      >
        <Trash2 aria-hidden="true" className="size-4" />
      </button>

      <ConfirmDialog
        open={open}
        busy={busy}
        title="Delete this scan?"
        description="The saved result will be permanently removed from your history."
        confirmLabel="Delete scan"
        onConfirm={confirm}
        onCancel={() => {
          setOpen(false);
          setError(false);
        }}
      />
      {error ? (
        <span role="alert" className="sr-only">
          Delete failed — try again.
        </span>
      ) : null}
    </>
  );
}

export function DeleteAllHistoryButton({
  count,
  signedIn,
}: {
  count: number;
  signedIn: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/history", { method: "DELETE" });
      if (!response.ok) throw new Error("failed");
      setOpen(false);
      router.refresh();
    } catch {
      setError("Couldn't delete your history — please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!signedIn || count === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-danger/40 hover:text-danger"
      >
        {busy ? (
          <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin" />
        ) : (
          <Trash2 aria-hidden="true" className="size-3.5" />
        )}
        Delete all
      </button>

      <ConfirmDialog
        open={open}
        busy={busy}
        title="Delete all scan history?"
        description={`All ${count} ${
          count === 1 ? "scan" : "scans"
        } will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete everything"
        onConfirm={confirm}
        onCancel={() => {
          setOpen(false);
          setError(null);
        }}
      />
      {error ? (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : null}
    </>
  );
}
