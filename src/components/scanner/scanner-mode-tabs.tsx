"use client";

import Link from "next/link";
import { ImageUp, Keyboard } from "lucide-react";

import { cn } from "@/lib/utils";

const MODES = [
  {
    key: "text",
    href: "/scanner",
    label: "Paste Text",
    icon: Keyboard,
  },
  {
    key: "screenshot",
    href: "/scanner/screenshot",
    label: "Upload Screenshot",
    icon: ImageUp,
  },
] as const;

export function ScannerModeTabs({ active }: { active: "text" | "screenshot" }) {
  return (
    <div
      role="tablist"
      aria-label="Scanner input mode"
      className="inline-flex w-full rounded-xl border bg-muted/50 p-1 sm:w-auto"
    >
      {MODES.map((mode) => {
        const isActive = mode.key === active;
        const Icon = mode.icon;
        return (
          <Link
            key={mode.key}
            href={mode.href}
            role="tab"
            aria-selected={isActive}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors sm:flex-none",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon aria-hidden="true" className="size-4" />
            {mode.label}
          </Link>
        );
      })}
    </div>
  );
}
