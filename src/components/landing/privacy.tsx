import { Eye, HeartHandshake, Lock, UserX } from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const PRIVACY_POINTS = [
  {
    icon: Lock,
    title: "Private by design",
    description:
      "Scanned messages are processed in real time through our secured server to build your report, never stored by Sift, never sold, never used for advertising.",
  },
  {
    icon: UserX,
    title: "No account required",
    description:
      "Use the scanner freely and anonymously. Accounts arrive later and are purely optional, for saved history.",
  },
  {
    icon: Eye,
    title: "Transparent results",
    description:
      "Every finding comes with its evidence explained. You always see why something was flagged.",
  },
  {
    icon: HeartHandshake,
    title: "Independent & educational",
    description:
      "An independent project for scam awareness in the Philippines, not affiliated with any brand named in examples.",
  },
] as const;

export function Privacy() {
  return (
    <section id="privacy" className="scroll-mt-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Safety & Privacy"
            title="Your safety includes your data"
            description="Sift is built on a simple principle: a tool that protects you from scams should never become a risk to your privacy. No sign-ups, no data selling, no mystery verdicts, just clear analysis you can verify yourself."
          />
          <p className="mt-6 rounded-xl border border-dashed p-4 text-xs leading-relaxed text-muted-foreground">
            Trademark notice: GCash, Maya, Shopee, Lazada, LBC, J&amp;T
            Express, Grab, and bank names referenced anywhere in Sift
            belong to their respective owners. They appear strictly as
            examples of brands commonly impersonated by scammers.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {PRIVACY_POINTS.map((point, index) => (
            <FadeIn key={point.title} delay={Math.min(index * 0.05, 0.2)}>
            <Card className="h-full">
              <CardContent className="flex h-full flex-col gap-3 pt-1">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/60">
                  <point.icon className="size-[18px]" />
                </span>
                <h3 className="text-base font-medium">{point.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {point.description}
                </p>
              </CardContent>
            </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
