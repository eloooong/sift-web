"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle, LogOut } from "lucide-react";
import { useLang } from "@/components/providers/language-provider";

export function ProfileForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "saving") return;
    setError(null);
    setState("saving");
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ displayName: name }),
      });
      const body = (await response.json().catch(() => null)) as
        | { user?: unknown }
        | { error?: { message: string } }
        | null;
      if (!response.ok || !body || !("user" in body)) {
        const message =
          body && "error" in body && body.error
            ? body.error.message
            : "Couldn't save. Please try again.";
        setError(message);
        setState("idle");
        return;
      }
      setState("saved");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setState("idle");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
      <label
        htmlFor="settings-name"
        className="font-mono text-[10px] font-medium tracking-widest text-muted-foreground uppercase"
      >
        Display name
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="settings-name"
          type="text"
          value={name}
          maxLength={40}
          onChange={(event) => {
            setName(event.target.value);
            setState("idle");
          }}
          className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm outline-none transition-colors focus:border-ring"
        />
        <button
          type="submit"
          disabled={state === "saving" || name.trim().length === 0}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {state === "saving" ? (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          ) : state === "saved" ? (
            <Check aria-hidden="true" className="size-4" />
          ) : null}
          {state === "saved" ? "Saved" : "Save"}
        </button>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </form>
  );
}

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/account/password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const body = (await response.json().catch(() => null)) as
        | { ok?: boolean }
        | { error?: { message: string } }
        | null;
      if (!response.ok || !body || !("ok" in body)) {
        const message =
          body && "error" in body && body.error
            ? body.error.message
            : "Couldn't change password. Please try again.";
        setError(message);
        return;
      }
      setDone(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="pw-current"
            className="mb-1 block font-mono text-[10px] font-medium tracking-widest text-muted-foreground uppercase"
          >
            Current password
          </label>
          <input
            id="pw-current"
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
              setDone(false);
            }}
            className="h-12 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-ring"
          />
        </div>
        <div>
          <label
            htmlFor="pw-new"
            className="mb-1 block font-mono text-[10px] font-medium tracking-widest text-muted-foreground uppercase"
          >
            New password
          </label>
          <input
            id="pw-new"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
              setDone(false);
            }}
            placeholder="At least 8 characters"
            className="h-12 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
          />
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      {done ? (
        <p role="status" className="text-sm text-success">
          Password changed. Other devices were signed out.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-9 w-fit items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-60"
      >
        {submitting ? (
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        ) : null}
        Update password
      </button>
    </form>
  );
}

export function SignOutButton({
  full,
  onSignedOut,
}: {
  full?: boolean;
  onSignedOut?: () => void;
}) {
  const router = useRouter();
  const { t } = useLang();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function signOut() {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" });
      if (!response.ok) throw new Error("Sign-out failed");
      onSignedOut?.();
      router.push("/");
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={full ? "flex flex-col gap-2" : "w-full"}>
      <button
        type="button"
        onClick={signOut}
        disabled={busy}
        className={
          full
            ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            : "flex min-h-11 w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        }
      >
        <LogOut aria-hidden="true" className={full ? "size-4" : "size-3.5"} />
        {busy ? t("nav.signingOut") : t("nav.signOut")}
      </button>
      {failed ? (
        <p role="alert" className="text-sm text-danger-foreground">
          {t("nav.signOutFailed")}
        </p>
      ) : null}
    </div>
  );
}
