import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { T } from "@/components/providers/t";
import { SITE_NAME } from "@/lib/site";
const LINKS = [
  { href: "/scanner", key: "footer.link.scanner" },
  { href: "/scams", key: "footer.link.library" },
  { href: "/reports", key: "nav.communityReports" },
  { href: "/dashboard", key: "nav.scamInsights" },
  { href: "/about", key: "footer.link.about" },
  { href: "/#privacy", key: "footer.link.privacy" },
] as const;
export function Footer() {
  return (
    <footer className="border-t bg-secondary/60">
      <div className="site-container py-10 sm:py-14">
        <div className="flex flex-col justify-between gap-8 lg:flex-row">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              <T k="footer.note" />
            </p>
          </div>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-start gap-x-7 gap-y-2"
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4"
              >
                <T k={link.key} />
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 max-w-4xl border-t pt-7 text-sm leading-relaxed text-muted-foreground">
          <T k="footer.disclaimer" />
        </p>
        <div className="mt-7 flex flex-wrap justify-between gap-3 text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {SITE_NAME}.{" "}
            <T k="footer.copyright" />
          </p>
          <p>English / Filipino</p>
        </div>
      </div>
    </footer>
  );
}
