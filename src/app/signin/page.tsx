import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { KeyRound } from "lucide-react";

import { AuthForm } from "@/components/auth/auth-form";
import { FadeIn } from "@/components/shared/fade-in";
import { currentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to ScamShield PH to view your private scan history.",
};

type SearchParams = Promise<{ next?: string }>;

function safeNext(raw: string | undefined): string {
  if (!raw) return "/history";
  return /^\/(?!\/)/.test(raw) ? raw : "/history";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [{ next }, user] = await Promise.all([searchParams, currentUser()]);
  if (user) redirect("/history");
  const nextPath = safeNext(next);

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-foreground)_1px,transparent_0)] bg-[size:24px_24px] opacity-[0.04]"
      />
      <div className="mx-auto w-full max-w-sm px-4 py-14 sm:py-20">
        <FadeIn className="flex flex-col items-center text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
            <KeyRound aria-hidden="true" className="size-5 text-primary" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Sign in to open your private scan history.
          </p>
        </FadeIn>

        <FadeIn delay={1} className="mt-6">
          <AuthForm mode="signin" nextPath={nextPath} />
        </FadeIn>
      </div>
    </div>
  );
}
