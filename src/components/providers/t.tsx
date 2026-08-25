"use client";

import { useLang } from "@/components/providers/language-provider";
import type { DictKey } from "@/lib/i18n/dictionary";

export function T({ k }: { k: DictKey }) {
  const { t } = useLang();
  return <>{t(k)}</>;
}
