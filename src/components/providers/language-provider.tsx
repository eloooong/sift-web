"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { DEFAULT_LANG, isLang, LANG_STORAGE_KEY, type Lang } from "@/lib/i18n/config";
import { t as translate, type DictKey } from "@/lib/i18n/dictionary";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: DictKey) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (key) => translate(DEFAULT_LANG, key),
});

const LANG_CHANGE_EVENT = "scamshield:lang-change";

// Fallback when localStorage is unavailable (private browsing): the choice
// still applies for the lifetime of the page.
let sessionLangOverride: Lang | null = null;

let cachedBrowserLang: Lang | null = null;

function detectBrowserLang(): Lang {
  if (cachedBrowserLang) return cachedBrowserLang;
  const preferred = window.navigator.language?.toLowerCase() ?? "";
  cachedBrowserLang =
    ["fil", "tl", "ceb", "ilo"].some((prefix) => preferred.startsWith(prefix))
      ? "fil"
      : "en";
  return cachedBrowserLang;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(LANG_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(LANG_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot(): Lang {
  if (sessionLangOverride) return sessionLangOverride;
  let stored: unknown = null;
  try {
    stored = window.localStorage.getItem(LANG_STORAGE_KEY);
  } catch {
    stored = null;
  }
  if (isLang(stored)) return stored;
  return detectBrowserLang();
}

function getServerSnapshot(): Lang {
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang === "fil" ? "fil-PH" : "en-PH";
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
      sessionLangOverride = null;
    } catch {
      sessionLangOverride = next;
    }
    window.dispatchEvent(new Event(LANG_CHANGE_EVENT));
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      t: (key: DictKey) => translate(lang, key),
    }),
    [lang, setLang]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
