import type { Metadata } from "next";
import {
  Banknote,
  Briefcase,
  Clock3,
  GraduationCap,
  HeartHandshake,
  HomeIcon,
  Link2,
  MailWarning,
  Scale,
  ShoppingBag,
  Store,
  UserX,
} from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sift is an independent, educational scam-detection tool built for Filipino internet users. Learn what it checks and who it is for.",
};

const DETECTION_CHECKS = [
  { icon: Clock3, label: "Urgency & pressure tactics" },
  { icon: UserX, label: "Brand impersonation (banks, e-wallets, couriers)" },
  { icon: Banknote, label: "Pay-to-claim and upfront-fee requests" },
  { icon: MailWarning, label: "Phishing links and spoofed senders" },
  { icon: GraduationCap, label: "Too-good-to-be-true offers" },
  { icon: Link2, label: "Disguised or shortened URLs" },
] as const;

const AUDIENCES = [
  { icon: GraduationCap, label: "Students" },
  { icon: HomeIcon, label: "Parents" },
  { icon: HeartHandshake, label: "Senior citizens" },
  { icon: ShoppingBag, label: "Online shoppers" },
  { icon: Briefcase, label: "Employees" },
  { icon: Store, label: "Small business owners" },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <FadeIn>
        <SectionHeading
          as="h1"
          eyebrow="About"
          title="Fighting scams, one message at a time"
          description="Sift exists because scam messages in the Philippines are not an edge case: they are a daily reality in every inbox, SMS thread, and Messenger chat."
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <Card className="mt-10">
          <CardContent className="space-y-4 pt-1 text-sm leading-relaxed text-muted-foreground">
            <p>
              Fake prize notifications. Phony delivery fees. Too-good-to-be-
              true home-based jobs. Messages that impersonate GCash, Maya,
              banks, couriers, and government agencies. These scams work
              because they arrive at the right moment, dressed in familiar
              branding, pressuring you to act before you can think.
            </p>
            <p>
              Sift is built to break that pattern. Instead of a
              mysterious “this is a scam” verdict, every analysis explains
              itself: a risk score, the detected scam category, the specific
              red flags found in the message, and clear next steps you can act
              on, written so students, parents, and senior citizens can all
              understand them.
            </p>
            <p>
              The project is independent and educational. When analysis flags
              an impersonated brand, that brand is the victim of imitation,
              never the suspect.
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.08}>
        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            What Sift looks for
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {DETECTION_CHECKS.map((check) => (
              <li
                key={check.label}
                className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3"
              >
                <check.icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm">{check.label}</span>
              </li>
            ))}
          </ul>
        </section>
      </FadeIn>

      <FadeIn delay={0.08}>
        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Built for Filipinos online
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Examples, patterns, and language are grounded in how scams
            actually reach people in the Philippines, including Taglish
            phrasing.
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {AUDIENCES.map((audience) => (
              <li key={audience.label}>
                <div className="flex h-full flex-col items-center gap-2 rounded-xl border bg-card px-4 py-5 text-center">
                  <audience.icon className="size-5 text-muted-foreground" />
                  <span className="text-xs font-medium sm:text-sm">
                    {audience.label}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="mt-14 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
          <Scale className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <p className="text-xs leading-relaxed text-amber-900">
            <span className="font-medium">Honest-use disclaimer.</span>{" "}
            Sift is an independent educational tool, not legal,
            financial, or security advice. It is not affiliated with GCash,
            Maya, any bank, Shopee, Lazada, LBC, J&amp;T Express, Grab, or any
            government agency; those names appear only as examples of brands
            scammers impersonate. For anything involving real money or
            accounts, always verify through official apps and hotlines before
            taking action.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
