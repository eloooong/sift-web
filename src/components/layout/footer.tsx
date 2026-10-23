import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { T } from "@/components/providers/t";
import { SITE_NAME } from "@/lib/site";

const PRODUCT_LINKS = [
  { href: "/scanner", key: "footer.link.scanner" },
  { href: "/scanner/screenshot", key: "footer.link.screenshot" },
  { href: "/scams", key: "footer.link.library" },
  { href: "/#scan-types", key: "footer.link.scanTypes" },
  { href: "/#how-it-works", key: "footer.link.howItWorks" },
] as const;

const RESOURCES_LINKS = [
  { href: "/about", key: "footer.link.about" },
  { href: "/#examples", key: "footer.link.examples" },
  { href: "/#privacy", key: "footer.link.privacy" },
] as const;

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              <T k="footer.tagline" />
            </p>
          </div>

          <nav aria-label="Product links">
            <p className="text-xs font-semibold tracking-widest uppercase">
              <T k="footer.product" />
            </p>
            <ul className="mt-4 space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <T k={link.key} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resource links">
            <p className="text-xs font-semibold tracking-widest uppercase">
              <T k="footer.resources" />
            </p>
            <ul className="mt-4 space-y-2.5">
              {RESOURCES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <T k={link.key} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 rounded-xl border border-dashed p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <T k="footer.disclaimer" />
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE_NAME}. <T k="footer.copyright" />
          </p>
          <p className="font-mono text-xs text-muted-foreground/80">
            v0.4, hybrid engine · AI analysis + rule-based pre-scan
          </p>
        </div>
      </div>
    </footer>
  );
}
