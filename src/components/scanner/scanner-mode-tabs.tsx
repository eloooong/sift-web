"use client";

import Link from "next/link";
import { Globe, ImageUp, Keyboard } from "lucide-react";

import { useLang } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

const MODES = [
  {
    key: "text",
    href: "/scanner",
    labelKey: "scanner.mode.text",
    shortLabelKey: "scanner.mode.textShort",
    icon: Keyboard,
  },
  {
    key: "screenshot",
    href: "/scanner/screenshot",
    labelKey: "scanner.mode.screenshot",
    shortLabelKey: "scanner.mode.screenshotShort",
    icon: ImageUp,
  },
  {
    key: "url",
    href: "/scanner/url",
    labelKey: "scanner.mode.url",
    shortLabelKey: "scanner.mode.urlShort",
    icon: Globe,
  },
] as const;

export type ScannerMode = (typeof MODES)[number]["key"];

export function ScannerModeTabs({ active }: { active: ScannerMode }) {
  const { t } = useLang();
  return (
    <nav
      aria-label={t("scanner.aria.modeTabs")}
      className="grid w-full grid-cols-3 rounded-lg border bg-muted/50 p-1 sm:inline-flex sm:w-auto"
    >
      {MODES.map((mode) => {
        const isActive = mode.key === active;
        const Icon = mode.icon;
        return (
          <Link
            key={mode.key}
            href={mode.href}
            aria-label={t(mode.labelKey)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md px-1 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none sm:flex-row sm:gap-2 sm:px-4",
              isActive
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            <span aria-hidden="true" className="sm:hidden">{t(mode.shortLabelKey)}</span>
            <span aria-hidden="true" className="hidden sm:inline">{t(mode.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
