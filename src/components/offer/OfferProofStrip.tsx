import { useTranslation } from "react-i18next";
import { ShieldCheck, Scale, KeyRound } from "lucide-react";

/**
 * Proof band under the offer hero, built as the greyscale logo-strip pattern.
 *
 * Deliberately the tech-stack + compliance version, NOT a client-logo wall: we
 * have no client logos we're cleared to show, and inventing them is off the
 * table. What it claims is checkable — the tools we integrate with, and the
 * compliance posture already stated in the footer.
 *
 * The slots are sized and spaced like a real logo strip (fixed height, greyscale,
 * colour on hover) so dropping real logo marks in later is a swap of the inner
 * span for an image element — nothing around it changes. Text ships today rather
 * than empty slots, so nothing renders as a broken placeholder box.
 *
 * With no `items`, it falls back to the spec's other sanctioned form: the three
 * compliance columns on their own. That's the shape used while a stack claim is
 * unverified — the band still reads as intentional rather than half-empty.
 */
export function OfferProofStrip({ headline, items }: { headline?: string; items?: string[] }) {
  const { t } = useTranslation();
  // Per-offer override: an offer names the stack or tools that are true for it.
  const tools = items ?? (t("offerPage.ui.proof.tools", { returnObjects: true }) as string[]);
  const hasTools = Array.isArray(tools) && tools.length > 0;

  const compliance = [
    { Icon: ShieldCheck, label: t("offerPage.ui.trustRow.gdpr") },
    { Icon: Scale, label: t("offerPage.ui.trustRow.aiAct") },
    { Icon: KeyRound, label: t("offerPage.ui.trustRow.ip") },
  ];

  return (
    <section className="border-y border-border bg-muted/20" aria-label={t("offerPage.ui.proof.label")}>
      <div className="container mx-auto px-4 lg:px-6 py-6">
        {hasTools ? (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                {headline ?? t("offerPage.ui.proof.headline")}
              </p>
              <ul className="flex flex-wrap items-center gap-2.5">
                {tools.map((tool) => (
                  <li
                    key={tool}
                    /* grayscale/hover applies to real logo marks once they drop in.
                       No resting opacity: dimming the text put it at 3.38:1, under
                       the 4.5 AA floor — greyscale must not cost legibility. */
                    className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 text-sm font-semibold text-muted-foreground grayscale transition-[filter] hover:grayscale-0"
                  >
                    <span>{tool}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="flex flex-wrap items-center gap-2.5 shrink-0">
              {compliance.slice(0, 2).map(({ Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-muted-foreground"
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-3">
            {compliance.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
                  <Icon className="w-4 h-4 text-accent" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
