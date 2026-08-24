"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";

import { Logo } from "@/components/layout/logo";
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

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/scanner", label: "Scanner" },
  { href: "/scams", label: "Scam Library" },
  { href: "/reports", label: "Reports" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
] as const;

type MeUser = { id: string; email: string; displayName: string };

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<MeUser | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close the account menu on outside click / Escape.
  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const handleSignedOut = useCallback(() => {
    setUser(null);
    setMenuOpen(false);
    router.refresh();
  }, [router]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const links = user ? [...NAV_LINKS, { href: "/history", label: "History" }] : [...NAV_LINKS];
  const initial = user?.displayName.trim().charAt(0).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Account area — reserved space avoids layout shift while loading */}
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
                  <Link href="/signin">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Create account</Link>
                </Button>
              </>
            )}
          </div>

          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link href="/scanner">Scan Now</Link>
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
                {links.map((link) => (
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
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 p-4">
                {user ? (
                  <>
                    <p className="truncate px-1 text-xs text-muted-foreground">
                      Signed in as <span className="font-medium">{user.email}</span>
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/settings">Settings</Link>
                    </Button>
                    <SignOutButton full onSignedOut={handleSignedOut} />
                  </>
                ) : (
                  <>
                    <Button asChild className="w-full">
                      <Link href="/signin">Sign in</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/signup">Create account</Link>
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
