import type { Metadata } from "next";
import { CircleUser, KeyRound, ShieldCheck } from "lucide-react";

import {
  PasswordForm,
  ProfileForm,
  SignOutButton,
} from "@/components/account/account-forms";
import { FadeIn } from "@/components/shared/fade-in";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your Sift account.",
};

export default async function SettingsPage() {
  const user = await requireUser("/settings");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <FadeIn>
        <p className="font-mono text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Settings</h1>
        <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
          Manage how your name appears in the app and keep your account secure.
        </p>
      </FadeIn>

      <div className="mt-8 flex flex-col gap-5">
        <FadeIn delay={0.04}>
          <section className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <CircleUser aria-hidden="true" className="size-4 text-muted-foreground" />
              Profile
            </h2>
            <p className="mt-1 mb-4 text-xs leading-relaxed text-muted-foreground">
              Signed in as{" "}
              <span className="font-medium text-foreground">{user.email}</span>{" "}
              since{" "}
              {new Date(user.createdAt).toLocaleDateString("en-PH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              . Email can&apos;t be changed in this demo.
            </p>
            <ProfileForm initialName={user.displayName} />
          </section>
        </FadeIn>

        <FadeIn delay={0.08}>
          <section className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <KeyRound aria-hidden="true" className="size-4 text-muted-foreground" />
              Password
            </h2>
            <p className="mt-1 mb-4 text-xs leading-relaxed text-muted-foreground">
              Changing your password signs out all other devices.
            </p>
            <PasswordForm />
          </section>
        </FadeIn>

        <FadeIn delay={0.12}>
          <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed p-5">
            <div className="flex items-start gap-2.5">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
              <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                Your scan history is private to this account and is checked
                server-side on every request; signed-out visitors and other
                accounts can never read it.
              </p>
            </div>
            <SignOutButton full />
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
