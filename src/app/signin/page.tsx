import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { KeyRound } from "lucide-react";

import { AuthForm } from "@/components/auth/auth-form";
import { FadeIn } from "@/components/shared/fade-in";
import { T } from "@/components/providers/t";
import { currentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Sift to view your private scan history.",
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
      <div className="mx-auto w-full max-w-5xl grid items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-20">
        <FadeIn className="flex flex-col items-start">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <KeyRound aria-hidden="true" className="size-5 text-primary" />
          </span>
          <h1 className="mt-4 page-title">
            <T k="auth.signin.title" />
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <T k="auth.signin.body" />
          </p>
          <p className="mt-8 max-w-md border-t pt-6 text-base leading-relaxed text-muted-foreground">
            <T k="auth.aside.body" />
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            <T k="auth.aside.note" />
          </p>
        </FadeIn>

        <FadeIn delay={1} className="lg:mt-0">
          <AuthForm mode="signin" nextPath={nextPath} />
        </FadeIn>
      </div>
    </div>
  );
}
