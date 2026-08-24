import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const PRODUCT_LINKS = [
  { href: "/scanner", label: "Scam Scanner" },
  { href: "/scanner/screenshot", label: "Screenshot Scanner" },
  { href: "/scams", label: "Scam Library" },
  { href: "/#scan-types", label: "Supported Scan Types" },
  { href: "/#how-it-works", label: "How It Works" },
] as const;

const RESOURCES_LINKS = [
  { href: "/about", label: "About ScamShield" },
  { href: "/#examples", label: "Common PH Scam Patterns" },
  { href: "/#privacy", label: "Privacy Principles" },
] as const;

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheck className="size-[18px]" />
              </span>
              <span className="text-[15px] font-semibold tracking-tight">
                ScamShield
                <span className="ml-1.5 rounded-md border bg-background px-1.5 py-0.5 align-middle font-mono text-[10px] font-medium text-muted-foreground">
                  PH
                </span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              AI-powered scam detection built to help Filipinos identify
              suspicious messages, links, and online threats — with clear
              explanations, not just labels.
            </p>
          </div>

          <nav aria-label="Product links">
            <p className="text-xs font-semibold tracking-widest uppercase">
              Product
            </p>
            <ul className="mt-4 space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resource links">
            <p className="text-xs font-semibold tracking-widest uppercase">
              Resources
            </p>
            <ul className="mt-4 space-y-2.5">
              {RESOURCES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 rounded-xl border border-dashed p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            ScamShield PH is an independent educational tool. It is not
            affiliated with, endorsed by, or connected to GCash, Maya, any
            bank, Shopee, Lazada, LBC, J&amp;T Express, Grab, or any government
            agency mentioned in examples or sample content. Brand names appear
            only to illustrate impersonation tactics commonly used by
            scammers. Analysis output is informational only and is not legal,
            financial, or security advice.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ScamShield PH. All rights reserved.
          </p>
          <p className="font-mono text-xs text-muted-foreground/80">
            v0.4 — hybrid engine · AI analysis + rule-based pre-scan
          </p>
        </div>
      </div>
    </footer>
  );
}
