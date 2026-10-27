"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useLang } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const CHANGE_EVENT = "sift:theme-change";
const SYSTEM_THEME = "(prefers-color-scheme: dark)";
let sessionOverride: boolean | null = null;

function getSnapshot(): boolean {
  if (sessionOverride !== null) return sessionOverride;
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved === "dark";
  } catch {
    // The switch still works for this session if browser storage is unavailable.
  }
  return window.matchMedia(SYSTEM_THEME).matches;
}

function getServerSnapshot() {
  return false;
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(SYSTEM_THEME);
  function sync() {
    document.documentElement.classList.toggle("dark", getSnapshot());
    onChange();
  }
  function onStorage(event: StorageEvent) {
    if (event.key === THEME_STORAGE_KEY || event.key === null) sync();
  }
  window.addEventListener(CHANGE_EVENT, sync);
  window.addEventListener("storage", onStorage);
  media.addEventListener("change", sync);
  sync();
  return () => {
    window.removeEventListener(CHANGE_EVENT, sync);
    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", sync);
  };
}

function setNightMode(dark: boolean) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
    sessionOverride = null;
  } catch {
    sessionOverride = dark;
  }
  document.documentElement.classList.toggle("dark", dark);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { t } = useLang();

  return (
    <Button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={t("theme.nightMode")}
      title={t(dark ? "theme.switchLight" : "theme.switchDark")}
      variant={showLabel ? "outline" : "ghost"}
      size={showLabel ? "default" : "icon"}
      onClick={() => setNightMode(!dark)}
      className={showLabel ? "w-full justify-between" : "hidden xl:inline-flex"}
    >
      {showLabel ? <span>{t("theme.nightMode")}</span> : null}
      <span className="inline-flex items-center gap-2">
        {showLabel ? (
          <span className="text-xs text-muted-foreground">
            <span className="hidden dark:inline">{t("theme.on")}</span>
            <span className="dark:hidden">{t("theme.off")}</span>
          </span>
        ) : null}
        <Moon aria-hidden="true" className="size-4 dark:hidden" />
        <Sun aria-hidden="true" className="hidden size-4 dark:block" />
      </span>
    </Button>
  );
}
