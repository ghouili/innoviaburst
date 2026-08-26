import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";

interface Build {
  tag: string;
  desc: string;
  scope: string;
  timeline: string;
}

/**
 * Representative-build cards for offer pages.
 *
 * Deliberately NOT case studies: these describe the SHAPE and scope of the kind
 * of MVP we build, not specific client engagements. The disclaimer is rendered
 * prominently and the cards carry no client names, logos or claimed results — so
 * there is nothing a prospect could ask us to substantiate that we can't. When
 * real, named case studies exist, this block is replaced by them.
 */
export function RepresentativeBuilds({
  data,
}: {
  data: { heading: string; disclaimer: string; items: Build[] };
}) {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-2">{data.heading}</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">{data.disclaimer}</p>

      <ul className="grid gap-4 sm:grid-cols-3">
        {data.items.map((b, i) => (
          <li
            key={i}
            className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-card"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-strong mb-2">
              {b.tag}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground flex-1">{b.desc}</p>
            <div className="mt-4 space-y-1.5 border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">{b.scope}</p>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Clock className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                {b.timeline}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-muted-foreground">
        {t("offerPage.ui.representativeBuildsCta", "Ask for a live walkthrough of recent builds on your scoping call.")}
      </p>
    </div>
  );
}
