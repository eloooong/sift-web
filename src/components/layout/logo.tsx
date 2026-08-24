import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="ScamShield PH home"
      className={cn("group flex w-fit items-center gap-2.5", className)}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors group-hover:bg-primary/85">
        <ShieldCheck className="size-[18px]" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight">
        ScamShield
        <span className="ml-1.5 rounded-md border bg-background px-1.5 py-0.5 align-middle font-mono text-[10px] font-medium text-muted-foreground">
          PH
        </span>
      </span>
    </Link>
  );
}
