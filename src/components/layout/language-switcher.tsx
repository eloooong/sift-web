"use client";

import { Languages } from "lucide-react";

import { useLang } from "@/components/providers/language-provider";
import { LANGS, type Lang } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useLang();

  return (
    <div
      role="group"
      aria-label={t("nav.language")}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border bg-muted/50 p-0.5",
        className
      )}
    >
      <Languages
        aria-hidden="true"
        className="ml-1.5 size-3.5 shrink-0 text-muted-foreground"
      />
      {LANGS.map((option) => {
        const isActive = option.code === lang;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLang(option.code as Lang)}
            aria-pressed={isActive}
            title={option.name}
            className={cn(
              "min-h-8 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="sr-only">{option.name}</span>
            <span aria-hidden="true">{option.short}</span>
          </button>
        );
      })}
    </div>
  );
}
