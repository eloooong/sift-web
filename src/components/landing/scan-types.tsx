import Link from "next/link";
import { ArrowUpRight, ImageUp, Link2, MessageSquareText } from "lucide-react";
import { T } from "@/components/providers/t";
const TOOLS = [
  {
    href: "/scanner",
    icon: MessageSquareText,
    title: "home.tool.text",
    body: "home.tool.textBody",
  },
  {
    href: "/scanner/screenshot",
    icon: ImageUp,
    title: "home.tool.image",
    body: "home.tool.imageBody",
  },
  {
    href: "/scanner/url",
    icon: Link2,
    title: "home.tool.link",
    body: "home.tool.linkBody",
  },
] as const;
export function ScanTypes() {
  return (
    <section
      id="scan-types"
      aria-label="Scanner tools"
      className="scroll-mt-24 border-b bg-card"
    >
      <div className="site-container grid sm:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="home-arrow-link group flex items-start gap-4 border-b py-7 transition-colors last:border-0 hover:bg-secondary/40 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring sm:border-r sm:border-b-0 sm:px-6 sm:first:pl-0 sm:last:pr-0"
          >
            <tool.icon aria-hidden="true" className="mt-1 size-6 shrink-0" />
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold">
                <T k={tool.title} />
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                <T k={tool.body} />
              </p>
            </div>
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
