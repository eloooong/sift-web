"use client";

import { Loader2 } from "lucide-react";
import { useLang } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const COPY = {
  text: { title: "progress.text.title", body: "progress.text.body" },
  screenshot: {
    title: "progress.screenshot.title",
    body: "progress.screenshot.body",
  },
  url: { title: "progress.url.title", body: "progress.url.body" },
} as const;

export function ScannerProgress({
  onCancel,
  variant = "text",
}: {
  onCancel: () => void;
  variant?: keyof typeof COPY;
}) {
  const { t } = useLang();
  const copy = COPY[variant];
  return (
    <Card role="status" aria-live="polite">
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <Loader2
            aria-hidden="true"
            className="mt-1 size-5 shrink-0 animate-spin"
          />
          <div>
            <p className="text-base font-semibold">{t(copy.title)}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t(copy.body)}
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("progress.cancel")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
