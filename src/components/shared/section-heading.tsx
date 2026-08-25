import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  as,
  align = "center",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  className?: string;
}) {
  const Heading = (as ?? "h2") as ElementType;

  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-3 font-mono text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        {title}
      </Heading>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
