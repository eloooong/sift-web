export type Lang = "en" | "fil";

export const LANGS: Array<{ code: Lang; name: string; short: string }> = [
  { code: "en", name: "English", short: "EN" },
  { code: "fil", name: "Filipino", short: "FIL" },
];

export const DEFAULT_LANG: Lang = "en";

export const LANG_STORAGE_KEY = "scamshield-lang";

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "fil";
}
