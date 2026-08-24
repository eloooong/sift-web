"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCheck,
  Hourglass,
  ImagePlus,
  LoaderCircle,
  Send,
  TriangleAlert,
  X,
} from "lucide-react";

import { SCAM_CATEGORIES } from "@/lib/scam-detector/categories";
import { PLATFORM_LABELS, REPORT_PLATFORMS } from "@/lib/reports/types";

const MIN_DESCRIPTION_CHARS = 30;
const MAX_DESCRIPTION_CHARS = 2000;
const MAX_SCREENSHOT_BYTES = 2 * 1024 * 1024;

type SubmitOutcome = {
  kind: "pending" | "approved" | "rejected";
  message: string;
};

export function ReportForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(SCAM_CATEGORIES[0].id);
  const [platform, setPlatform] = useState<string>("sms");
  const [sender, setSender] = useState("");
  const [encounteredAt, setEncounteredAt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [clientError, setClientError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<SubmitOutcome | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Object URLs are revoked by the cleanup below whenever the preview changes.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function pickFile(next: File | null) {
    setClientError(null);
    if (!next) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    const problem = validateScreenshot(next);
    if (problem) {
      setClientError(problem);
      setFile(null);
      setPreviewUrl(null);
      if (formRef.current) formRef.current.reset();
      return;
    }
    setFile(next);
    setPreviewUrl(URL.createObjectURL(next));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const trimmed = description.trim();
    if (trimmed.length < MIN_DESCRIPTION_CHARS) {
      setClientError(
        `Describe what happened in at least ${MIN_DESCRIPTION_CHARS} characters.`
      );
      return;
    }
    if (!encounteredAt) {
      setClientError("Enter the date you encountered it.");
      return;
    }

    setClientError(null);
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("category", categoryId);
      formData.set("platform", platform);
      formData.set("description", trimmed);
      formData.set("sender", sender.trim());
      formData.set("encounteredAt", encounteredAt);
      if (file) formData.set("screenshot", file);
      formData.set("website", ""); // honeypot

      const response = await fetch("/api/reports", {
        method: "POST",
        body: formData,
      });
      const body = (await response.json().catch(() => null)) as
        | { ok: true; status: SubmitOutcome["kind"]; message: string }
        | { error?: { code: string; message: string } }
        | null;

      if (!response.ok || !body || !("ok" in body)) {
        const message =
          body && "error" in body && body.error
            ? body.error.message
            : "Something went wrong. Please try again.";
        setClientError(message);
        return;
      }

      setOutcome({
        kind: body.status === "approved" ? "approved" : body.status,
        message: body.message,
      });
      setDescription("");
      setSender("");
      setEncounteredAt("");
      setFile(null);
      setPreviewUrl(null);
      formRef.current?.reset();
      onSubmitted?.();
    } catch {
      setClientError("Network error — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (outcome) {
    const success = outcome.kind !== "rejected";
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
        {success ? (
          outcome.kind === "approved" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
              <CheckCheck aria-hidden="true" className="size-3.5" />
              Published
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning-foreground">
              <Hourglass aria-hidden="true" className="size-3.5" />
              Awaiting moderation
            </span>
          )
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-medium text-danger">
            <TriangleAlert aria-hidden="true" className="size-3.5" />
            Not published
          </span>
        )}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {outcome.message}
        </p>
        <button
          type="button"
          onClick={() => setOutcome(null)}
          className="rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Submit another report
        </button>
      </div>
    );
  }

  const remaining = MAX_DESCRIPTION_CHARS - description.length;
  const tooLong = remaining < 0;

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      className="flex flex-col gap-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6"
      noValidate
    >
      {/* Honeypot — visually hidden, real users never fill this */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Scam category" htmlFor="rf-category">
          <SelectShell>
            <select
              id="rf-category"
              value={categoryId}
              onChange={(event) =>
                setCategoryId(
                  event.target.value as typeof SCAM_CATEGORIES[number]["id"]
                )
              }
            >
              {SCAM_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </SelectShell>
        </Field>

        <Field label="Platform" htmlFor="rf-platform">
          <SelectShell>
            <select
              id="rf-platform"
              value={platform}
              onChange={(event) => setPlatform(event.target.value)}
            >
              {REPORT_PLATFORMS.map((value) => (
                <option key={value} value={value}>
                  {PLATFORM_LABELS[value]}
                </option>
              ))}
            </select>
          </SelectShell>
        </Field>
      </div>

      <Field
        label="What happened?"
        htmlFor="rf-description"
        hint={`${MIN_DESCRIPTION_CHARS}–${MAX_DESCRIPTION_CHARS} characters`}
      >
        <textarea
          id="rf-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={6}
          maxLength={MAX_DESCRIPTION_CHARS + 200}
          placeholder="Describe the scam attempt — what they claimed, what they asked for, and anything that felt off."
          className="w-full resize-y rounded-lg border bg-background p-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
        />
        <p
          className={`mt-1 text-right font-mono text-[11px] tabular-nums ${
            tooLong ? "text-danger" : "text-muted-foreground"
          }`}
        >
          {description.length.toLocaleString()} /{" "}
          {MAX_DESCRIPTION_CHARS.toLocaleString()}
        </p>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Sender or domain"
          htmlFor="rf-sender"
          hint="Optional — masked before publishing"
        >
          <input
            id="rf-sender"
            type="text"
            value={sender}
            onChange={(event) => setSender(event.target.value)}
            placeholder="+63 9·· ··· ··67 / lookalike-site.ph"
            autoComplete="off"
            className="h-10 w-full rounded-lg border bg-background px-3 font-mono text-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
          />
        </Field>

        <Field label="Date encountered" htmlFor="rf-date">
          <input
            id="rf-date"
            type="date"
            required
            value={encounteredAt}
            max={todayIso()}
            onChange={(event) => setEncounteredAt(event.target.value)}
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors focus:border-ring"
          />
        </Field>
      </div>

      <Field label="Screenshot" htmlFor="rf-file" hint="Optional · PNG/JPG/WebP · ≤ 2 MB">
        {file ? (
          <div className="flex items-center gap-3 rounded-lg border border-dashed p-3">
            {previewUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={previewUrl}
                alt="Selected screenshot preview"
                className="size-14 rounded object-cover ring-1 ring-foreground/10"
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{file.name}</p>
              <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={() => pickFile(null)}
              aria-label="Remove screenshot"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="rf-file"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-6 text-sm text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
          >
            <ImagePlus aria-hidden="true" className="size-4" />
            Attach a screenshot
          </label>
        )}
        <input
          id="rf-file"
          type="file"
          accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(event) =>
            pickFile(event.target.files?.[0] ?? null)
          }
        />
      </Field>

      {clientError ? (
        <p role="alert" className="text-sm text-danger">
          {clientError}
        </p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row-reverse sm:items-center">
        <SubmitButton submitting={submitting} />
        <p className="text-[11px] leading-snug text-muted-foreground sm:flex-1">
          No name, email, or account details — reports stay anonymous.
        </p>
      </div>
    </form>
  );
}

function validateScreenshot(file: File): string | null {
  const allowed = ["image/png", "image/jpeg", "image/webp"];
  if (!allowed.includes(file.type)) {
    return "Only PNG, JPG, or WebP screenshots are accepted.";
  }
  if (file.size > MAX_SCREENSHOT_BYTES) {
    return "Screenshots must be 2 MB or less.";
  }
  return null;
}

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="font-mono text-[10px] font-medium tracking-widest text-muted-foreground uppercase"
        >
          {label}
        </label>
        {hint ? (
          <span className="text-[10px] text-muted-foreground/70">{hint}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function SelectShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="[&>select]:h-10 [&>select]:w-full [&>select]:appearance-none [&>select]:rounded-lg [&>select]:border [&>select]:bg-background [&>select]:px-3 [&>select]:pr-8 [&>select]:text-sm [&>select]:outline-none [&>select]:transition-colors [&>select]:focus:border-ring relative">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

function SubmitButton({ submitting }: { submitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {submitting ? (
        <>
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          Submitting…
        </>
      ) : (
        <>
          <Send aria-hidden="true" className="size-4" />
          Submit report
        </>
      )}
    </button>
  );
}
