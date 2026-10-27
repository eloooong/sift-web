import { Eye, LockKeyhole, UserRound } from "lucide-react";
import { T } from "@/components/providers/t";
const POINTS = [
  {
    icon: UserRound,
    title: "home.privacy.account",
    body: "home.privacy.accountBody",
  },
  {
    icon: LockKeyhole,
    title: "home.privacy.data",
    body: "home.privacy.dataBody",
  },
  {
    icon: Eye,
    title: "home.privacy.explain",
    body: "home.privacy.explainBody",
  },
] as const;
export function Privacy() {
  return (
    <section id="privacy" className="scroll-mt-24">
      <div className="site-container grid gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div>
          <h2 className="section-title">
            <T k="home.privacy.title" />
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            <T k="home.privacy.body" />
          </p>
        </div>
        <ul className="space-y-7">
          {POINTS.map((point) => (
            <li key={point.title} className="flex gap-5">
              <point.icon
                aria-hidden="true"
                className="mt-1 size-5 shrink-0 text-muted-foreground"
              />
              <div>
                <h3 className="text-base font-semibold">
                  <T k={point.title} />
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  <T k={point.body} />
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
