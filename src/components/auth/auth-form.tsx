"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

type Mode = "signin" | "signup";

export function AuthForm({ mode, nextPath }: { mode: Mode; nextPath: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setError(null);
    setSubmitting(true);
    try {
      const endpoint =
        mode === "signin" ? "/api/auth/signin" : "/api/auth/signup";
      const payload =
        mode === "signin"
          ? { email: email.trim(), password }
          : {
              email: email.trim(),
              password,
              displayName: displayName.trim() || undefined,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => null)) as
        | { user?: unknown }
        | { error?: { message: string } }
        | null;

      if (!response.ok || !body || !("user" in body)) {
        const message =
          body && "error" in body && body.error
            ? body.error.message
            : "Something went wrong. Please try again.";
        setError(message);
        return;
      }

      router.push(nextPath || "/history");
      // Re-render server components (navbar state comes from /api/auth/me,
      // but protected pages benefit from a fresh render pass).
      router.refresh();
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex flex-col gap-4 rounded-xl bg-card p-6 ring-1 ring-foreground/10 sm:p-7"
    >
      {mode === "signup" ? (
        <Field label="Display name" htmlFor="af-name" hint="Optional · how you'll appear in the app">
          <input
            id="af-name"
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            maxLength={40}
            autoComplete="nickname"
            placeholder="Juan D."
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
          />
        </Field>
      ) : null}

      <Field label="Email" htmlFor="af-email">
        <input
          id="af-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
        />
      </Field>

      <Field
        label="Password"
        htmlFor="af-password"
        hint={
          mode === "signup" ? "At least 8 characters" : undefined
        }
      >
        <input
          id="af-password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={mode === "signup" ? 8 : undefined}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          placeholder="••••••••"
          className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
        />
      </Field>

      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            {mode === "signin" ? "Signing in…" : "Creating account…"}
          </>
        ) : mode === "signin" ? (
          "Sign in"
        ) : (
          "Create account"
        )}
      </button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        {mode === "signin" ? (
          <>
            New here?{" "}
            <Link
              href={`/signup${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`}
              className="font-medium underline hover:text-foreground"
            >
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href={`/signin${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`}
              className="font-medium underline hover:text-foreground"
            >
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
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
