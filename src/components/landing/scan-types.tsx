import {
  ClipboardPaste,
  Link2,
  Mail,
  MessagesSquare,
  Smartphone,
  ScanText,
} from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ScanType = {
  icon: typeof Smartphone;
  title: string;
  description: string;
  comingSoon?: boolean;
};

const SCAN_TYPES: ScanType[] = [
  {
    icon: Smartphone,
    title: "SMS & Text Messages",
    description:
      "Suspicious “prize”, “loan”, or “account locked” texts — check them before you tap anything.",
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
      "Sketchy links from SMS or chat — inspect them before entering login details or personal info.",
  },
  {
    icon: ScanText,
    title: "Screenshots",
    description:
      "Upload screenshots of entire conversations for analysis. OCR support is on the roadmap.",
    comingSoon: true,
  },
  {
    icon: ClipboardPaste,
    title: "Any Other Text",
    description:
      "Anything that feels off — job offers, investment pitches, refund notices, or unknown senders.",
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
          {SCAN_TYPES.map((type) => (
            <Card
              key={type.title}
              className="transition-colors hover:ring-foreground/20"
            >
              <CardHeader>
                <span className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/60 text-foreground">
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
          ))}
        </div>
      </div>
    </section>
  );
}
