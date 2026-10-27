import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  description,
  as,
  align = "left",
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
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      <Heading className={as === "h1" ? "page-title" : "section-title"}>
        {title}
      </Heading>
      {description ? (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
      ) : null}
    </div>
  );
}
