import Link from "next/link";

import { BrandMark } from "@/components/layout/brand-mark";
import { SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${SITE_NAME} home`}
      className={cn("group flex w-fit items-center gap-2.5", className)}
    >
      <BrandMark className="size-9" />
      <span className="text-xl font-semibold tracking-tight">
        {SITE_NAME}
      </span>
    </Link>
  );
}
