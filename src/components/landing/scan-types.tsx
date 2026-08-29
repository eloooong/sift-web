import {
  ArrowUpRight,
  ClipboardPaste,
  Link2,
  Mail,
  MessagesSquare,
  Smartphone,
  ScanText,
} from "lucide-react";
import Link from "next/link";

import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ScanType = {
  icon: typeof Smartphone;
  title: string;
  description: string;
  comingSoon?: boolean;
  href?: string;
};

const SCAN_TYPES: ScanType[] = [
  {
    icon: Smartphone,
    title: "SMS & Text Messages",
    description:
      "Suspicious “prize”, “loan”, or “account locked” texts. Check them before you tap anything.",
  },
  {
    icon: MessagesSquare,
    title: "Facebook & Messenger",
    description:
      "Odd DMs about prizes, online sellers, or “claimed” packages you never ordered.",
  },
  {
    icon: Mail,
    title: "Emails",
    description:
      "Phishing emails impersonating banks, couriers, delivery apps, and government agencies.",
  },
  {
    icon: Link2,
    title: "URLs & Links",
    description:
      "Sketchy links from SMS or chat. Inspect them before entering login details or personal info.",
  },
  {
    icon: ScanText,
    title: "Screenshots",
    description:
      "Upload a screenshot of the whole conversation; we read the text with OCR and analyze it end-to-end.",
    href: "/scanner/screenshot",
  },
  {
    icon: ClipboardPaste,
    title: "Any Other Text",
    description:
      "Anything that feels off: job offers, investment pitches, refund notices, or unknown senders.",
  },
];

export function ScanTypes() {
  return (
    <section id="scan-types" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Supported Scan Types"
          title="If it looks fishy, scan it"
          description="ScamShield PH is designed to handle the channels Filipinos actually get scammed on."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SCAN_TYPES.map((type, index) => {
            const card = (
              <Card
                className={cn(
                  "relative h-full transition-all duration-200",
                  "hover:-translate-y-0.5 hover:ring-foreground/20"
                )}
              >
                <ArrowUpRight
                  aria-hidden="true"
                  className="absolute top-4 right-4 size-4 text-muted-foreground/40 transition-all duration-200 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-foreground"
                />
                <CardHeader>
                  <span className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/60 text-foreground transition-colors group-hover/card:border-foreground/25">
                    <type.icon className="size-[18px]" />
                  </span>
                  <CardTitle className="flex items-center gap-2">
                    {type.title}
                    {type.comingSoon ? (
                      <Badge variant="secondary" className="font-normal">
                        Coming soon
                      </Badge>
                    ) : null}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {type.description}
                  </p>
                </CardContent>
              </Card>
            );

            return type.href ? (
              <FadeIn key={type.title} delay={Math.min(index * 0.05, 0.2)} className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Link
                href={type.href}
                className="block rounded-xl"
                aria-label={`${type.title}: open the ${type.title.toLowerCase()} scanner`}
              >
                {card}
              </Link>
              </FadeIn>
            ) : (
              <FadeIn key={type.title} delay={Math.min(index * 0.05, 0.2)}>
                {card}
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
