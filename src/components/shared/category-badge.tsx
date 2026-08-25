"use client";

import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  Gift,
  HandCoins,
  Heart,
  HelpCircle,
  KeyRound,
  Landmark,
  MailWarning,
  Package,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { useLang } from "@/components/providers/language-provider";

import type { ScamCategoryDef, ScamCategoryId } from "@/lib/scam-detector/categories";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<ScamCategoryId, LucideIcon> = {
  "bank-scam": Landmark,
  "e-wallet-scam": Wallet,
  "prize-scam": Gift,
  "delivery-scam": Package,
  "online-job-scam": Briefcase,
  "loan-scam": HandCoins,
  "government-impersonation": Building2,
  "account-verification-scam": KeyRound,
  "investment-scam": TrendingUp,
  "romance-scam": Heart,
  phishing: MailWarning,
  other: HelpCircle,
};

const CATEGORY_LABEL_FIL: Record<ScamCategoryId, string> = {
  "bank-scam": "Bank Scam",
  "e-wallet-scam": "E-wallet Scam",
  "prize-scam": "Prize Scam",
  "delivery-scam": "Delivery Scam",
  "online-job-scam": "Fake na Job Offer",
  "loan-scam": "Loan Scam",
  "government-impersonation": "Pangangapit sa Gobyerno",
  "account-verification-scam": "Account Verification Scam",
  "investment-scam": "Investment Scam",
  "romance-scam": "Romance Scam",
  phishing: "Phishing",
  other: "Ibang Uri ng Scam",
};

export function CategoryBadge({
  category,
  className,
}: {
  category: ScamCategoryDef | null;
  className?: string;
}) {
  const { lang } = useLang();

  if (!category) {
    return (
      <span
        className={cn(
          "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground",
          className
        )}
      >
        {lang === "fil" ? "Walang tukoy na kategorya" : "No specific category"}
      </span>
    );
  }

  const Icon = CATEGORY_ICONS[category.id];

  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border bg-muted/60 px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      <Icon aria-hidden="true" className="size-3 text-muted-foreground" />
      {lang === "fil"
        ? (CATEGORY_LABEL_FIL[category.id] ?? category.label)
        : category.label}
    </span>
  );
}
