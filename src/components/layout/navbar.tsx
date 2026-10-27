"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Menu } from "lucide-react";

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
import { SITE_NAME } from "@/lib/site";

const PRIMARY_LINKS = [
  { href: "/scams", key: "nav.scamLibrary" },
  { href: "/reports", key: "nav.communityReports" },
] as const;
const HISTORY_LINK = { href: "/history", key: "nav.myHistory" } as const;
type MeUser = { id: string; email: string; displayName: string };

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLang();
  const router = useRouter();
  const [user, setUser] = useState<MeUser | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    if (!accountOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!accountRef.current?.contains(event.target as Node))
        setAccountOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAccountOpen(false);
        accountButtonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen]);

  const handleSignedOut = useCallback(() => {
    setUser(null);
    setAccountOpen(false);
    setMobileOpen(false);
    router.refresh();
  }, [router]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");
  const isScanner = isActive("/scanner");
  const primaryLinks = user
    ? [...PRIMARY_LINKS, HISTORY_LINK]
    : [...PRIMARY_LINKS];
  const mobileLinks = [
    { href: "/scanner", key: "nav.scanNow" } as const,
    ...primaryLinks,
  ];
  const initial = user?.displayName.trim().charAt(0).toUpperCase() || "?";
  const navClass = (active: boolean) =>
    cn(
      "inline-flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      active
        ? "bg-muted text-foreground"
        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="site-container flex min-h-20 items-center gap-3 px-4 sm:gap-5">
        <Logo className="max-[359px]:[&>span]:hidden" />
        <nav
          aria-label={t("nav.mainNavigation")}
          className="ml-3 hidden flex-1 items-center gap-1 xl:flex"
        >
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={navClass(isActive(link.href))}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher className="hidden xl:inline-flex" />
          <div className="hidden min-w-20 items-center justify-end xl:flex">
            {!loaded ? (
              <span
                aria-hidden="true"
                className="h-11 w-20 rounded-md bg-muted/60"
              />
            ) : user ? (
              <div ref={accountRef} className="relative">
                <button
                  ref={accountButtonRef}
                  type="button"
                  onClick={() => setAccountOpen((value) => !value)}
                  aria-expanded={accountOpen}
                  aria-controls="header-account-options"
                  className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold"
                  >
                    {initial}
                  </span>
                  {t("nav.account")}
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-3.5 transition-transform",
                      accountOpen && "rotate-180",
                    )}
                  />
                </button>
                {accountOpen ? (
                  <div
                    id="header-account-options"
                    role="group"
                    aria-label={t("nav.account")}
                    className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border bg-card p-2"
                  >
                    <div className="border-b px-3 py-3">
                      <p className="truncate text-sm font-medium">
                        {user.displayName}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/settings"
                      onClick={() => setAccountOpen(false)}
                      className={cn(
                        navClass(isActive("/settings")),
                        "mt-1 w-full",
                      )}
                    >
                      {t("nav.settings")}
                    </Link>
                    <div className="mt-1">
                      <SignOutButton full onSignedOut={handleSignedOut} />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <Button asChild variant="ghost" size="sm">
                <Link href="/signin">{t("nav.signIn")}</Link>
              </Button>
            )}
          </div>
          <Button asChild variant={isScanner ? "outline" : "default"} size="sm">
            <Link href="/scanner" aria-current={isScanner ? "page" : undefined}>
              {t("nav.scanNow")}
              <ArrowRight
                aria-hidden="true"
                className="hidden size-4 sm:block"
              />
            </Link>
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("nav.openMenu")}
                className="xl:hidden"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 max-w-full overflow-y-auto"
              onClick={(event) => {
                if (
                  event.target instanceof Element &&
                  event.target.closest("a")
                )
                  setMobileOpen(false);
              }}
            >
              <SheetHeader>
                <SheetTitle>{SITE_NAME}</SheetTitle>
                <SheetDescription>{t("nav.guestHint")}</SheetDescription>
              </SheetHeader>
              <nav
                aria-label={t("nav.mobileNavigation")}
                className="flex flex-col gap-1 overflow-y-auto px-4"
              >
                {mobileLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={navClass(isActive(link.href))}
                  >
                    {t(link.key)}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col items-stretch gap-4 border-t p-4">
                <LanguageSwitcher className="self-start" />
                {user ? (
                  <>
                    <div>
                      <p className="truncate text-sm font-medium">
                        {user.displayName}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <Button asChild variant="outline">
                      <Link href="/settings">{t("nav.settings")}</Link>
                    </Button>
                    <SignOutButton full onSignedOut={handleSignedOut} />
                  </>
                ) : (
                  <div>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/signin">{t("nav.signIn")}</Link>
                    </Button>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {t("nav.saveHistoryHint")}
                    </p>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
