import type { Metadata } from "next";
import { CircleUser, KeyRound, ShieldCheck } from "lucide-react";

import {
  PasswordForm,
  ProfileForm,
  SignOutButton,
} from "@/components/account/account-forms";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your Sift account.",
};

export default async function SettingsPage() {
  const user = await requireUser("/settings");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-20">
      <div>
        <h1 className="mt-2 page-title">Settings</h1>
        <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
          Manage how your name appears in the app and keep your account secure.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-5">
        <div>
          <section className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <CircleUser
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
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
              . Email changes are not supported.
            </p>
            <ProfileForm initialName={user.displayName} />
          </section>
        </div>

        <div>
          <section className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <KeyRound
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              Password
            </h2>
            <p className="mt-1 mb-4 text-xs leading-relaxed text-muted-foreground">
              Changing your password signs out all other devices.
            </p>
            <PasswordForm />
          </section>
        </div>

        <div>
          <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed p-5">
            <div className="flex items-start gap-2.5">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-success"
              />
              <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                Your scan history is private to this account and is checked
                server-side on every request; signed-out visitors and other
                accounts can never read it.
              </p>
            </div>
            <SignOutButton full />
          </section>
        </div>
      </div>
    </div>
  );
}
