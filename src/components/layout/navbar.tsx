"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";
import { ArrowRight } from "lucide-react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Logo } from "@/components/layout/logo";
import { useLang } from "@/components/providers/language-provider";
import { SignOutButton } from "@/components/account/account-forms";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Primary destinations stay visible; everything else groups under "More".
const PRIMARY_NAV_LINKS = [
  { href: "/", label: "Home", key: "nav.home" },
  { href: "/scanner", label: "Scanner", key: "nav.scanner" },
  { href: "/scams", label: "Scam Library", key: "nav.scamLibrary" },
  { href: "/reports", label: "Reports", key: "nav.reports" },
] as const;

const MORE_NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", key: "nav.dashboard" },
  { href: "/about", label: "About", key: "nav.about" },
] as const;

type MeUser = { id: string; email: string; displayName: string };

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLang();
  const router = useRouter();
  const [user, setUser] = useState<MeUser | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((response) => response.json() as Promise<{ user: MeUser | null }>)
      .then((body) => {
        if (!cancelled) {
          setUser(body.user);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // Close any open menu on outside click / Escape.
  useEffect(() => {
    if (!menuOpen && !moreOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (menuOpen && !menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (moreOpen && !moreRef.current?.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMoreOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, moreOpen]);

  const handleSignedOut = useCallback(() => {
    setUser(null);
    setMenuOpen(false);
    router.refresh();
  }, [router]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const HISTORY_LINK = {
    href: "/history",
    label: "History",
    key: "nav.history",
  } as const;
  const moreLinks = user
    ? [...MORE_NAV_LINKS, HISTORY_LINK]
    : [...MORE_NAV_LINKS];
  const allLinks = [...PRIMARY_NAV_LINKS, ...moreLinks];
  const moreActive = moreLinks.some((link) => isActive(link.href));
  const initial = user?.displayName.trim().charAt(0).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {PRIMARY_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                link.href === "/scanner"
                  ? "font-semibold text-primary hover:bg-muted"
                  : isActive(link.href)
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t(link.key)}
            </Link>
          ))}

          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((value) => !value)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                moreOpen || moreActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t("nav.more")}
              <ChevronDown
                aria-hidden="true"
                className={cn("size-3.5 transition-transform", moreOpen && "rotate-180")}
              />
            </button>

            {moreOpen ? (
              <div
                role="menu"
                aria-label="More pages"
                className="absolute left-0 top-full z-50 mt-1.5 w-44 rounded-xl bg-card p-1.5 shadow-lg ring-1 ring-foreground/10"
              >
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    role="menuitem"
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive(link.href)
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {t(link.key)}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          {/* Account area: reserved space avoids layout shift while loading */}
          <div className="hidden items-center md:flex">
            {!loaded ? (
              <span aria-hidden="true" className="size-8 rounded-full bg-muted/60" />
            ) : user ? (
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((value) => !value)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {initial}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-3.5 text-muted-foreground transition-transform",
                      menuOpen && "rotate-180"
                    )}
                  />
                </button>

                {menuOpen ? (
                  <div
                    role="menu"
                    aria-label="Account menu"
                    className="absolute right-0 top-11 w-56 rounded-xl bg-card p-2 shadow-lg ring-1 ring-foreground/10"
                  >
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-medium">{user.displayName}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="my-1 border-t" />
                    <Link
                      role="menuitem"
                      href="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      Settings
                    </Link>
                    <div className="px-0 pt-0.5">
                      <SignOutButton onSignedOut={handleSignedOut} />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/signin">{t("nav.signIn")}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">{t("nav.signUp")}</Link>
                </Button>
              </>
            )}
          </div>

          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link href="/scanner">
              Scan Now
              <ArrowRight
                data-icon="inline-end"
                className="transition-transform group-hover/button:translate-x-0.5"
              />
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                className="md:hidden"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>ScamShield PH</SheetTitle>
                <SheetDescription>
                  AI-powered scam detection for Filipinos
                </SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile navigation" className="flex flex-col gap-1 overflow-y-auto px-4">
                {allLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive(link.href)
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    {t(link.key)}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 p-4">
                <LanguageSwitcher />
                {user ? (
                  <>
                    <p className="truncate px-1 text-xs text-muted-foreground">
                      Signed in as <span className="font-medium">{user.email}</span>
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/settings">{t("nav.settings")}</Link>
                    </Button>
                    <SignOutButton full onSignedOut={handleSignedOut} />
                  </>
                ) : (
                  <>
                    <Button asChild className="w-full">
                      <Link href="/signin">{t("nav.signIn")}</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/signup">{t("nav.signUp")}</Link>
                    </Button>
                  </>
                )}
                <Button asChild variant="ghost" className="w-full lg:hidden">
                  <Link href="/scanner">Scan Now</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
