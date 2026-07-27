import { useTranslation } from "react-i18next";
import { Lock, TrendingUp, Check, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface MvpAppPreviewProps {
  className?: string;
}

/**
 * On-message hero visual for /lp/mvp: a stylised "your live MVP" product
 * preview — an app window showing a shipped product dashboard, with floating
 * "shipped" / "GDPR-ready" badges. It reads as *the product we build for you*
 * (not ops automation), and every label is localized via i18n so it renders
 * correctly on /fr.
 *
 * Purely CSS/SVG — no requestAnimationFrame paint loop — so it stays cheap on
 * the main thread (keeps LCP/TBT low). Decorative: aria-hidden, no focusable
 * content. The single gentle float animation honours prefers-reduced-motion via
 * the global reset in index.css.
 */
export function MvpAppPreview({ className = "" }: MvpAppPreviewProps) {
  const { t } = useTranslation();
  const metrics = t("lpMvp.preview.metrics", { returnObjects: true }) as {
    label: string;
    value: string;
    delta: string;
  }[];
  // Static illustrative bar heights (%), deterministic — no Math.random at render.
  const bars = [38, 52, 44, 66, 58, 78, 88];

  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      {/* App window */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_28px_70px_-34px_hsl(210_77%_35%/0.5)]">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-orange/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </span>
          <span className="ml-2 inline-flex items-center gap-1.5 rounded-md bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Lock className="h-3 w-3" />
            {t("lpMvp.preview.appName")}
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-green-600/15 px-2.5 py-1 text-xs font-semibold text-green-800">
            <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
            {t("lpMvp.preview.statusLive")}
          </span>
        </div>

        {/* App body */}
        <div className="grid grid-cols-[auto_1fr]">
          {/* Sidebar */}
          <div className="hidden flex-col gap-3 border-r border-border bg-muted/20 p-4 sm:flex">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-secondary to-primary" />
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-2 rounded-full",
                  i === 0 ? "w-9 bg-secondary/60" : "w-7 bg-muted-foreground/25",
                )}
              />
            ))}
          </div>

          {/* Main */}
          <div className="space-y-4 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="h-2.5 w-28 rounded bg-foreground/75" />
                <div className="h-2 w-16 rounded bg-muted-foreground/30" />
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-secondary" />
            </div>

            {/* Metric tiles */}
            <div className="grid grid-cols-3 gap-2.5">
              {Array.isArray(metrics) &&
                metrics.map((m) => (
                  <div key={m.label} className="rounded-xl border border-border bg-background p-2.5">
                    <p className="truncate text-[10px] text-muted-foreground">{m.label}</p>
                    <p className="mt-0.5 text-sm font-bold text-foreground">{m.value}</p>
                    <p className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] font-semibold text-green-700">
                      <TrendingUp className="h-2.5 w-2.5" />
                      {m.delta}
                    </p>
                  </div>
                ))}
            </div>

            {/* Chart */}
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="flex h-16 items-end gap-1.5">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-secondary/70 to-accent/70"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Footer row + CTA */}
            <div className="flex items-center justify-between pt-0.5">
              <div className="h-2 w-24 rounded bg-muted-foreground/20" />
              <span className="rounded-lg bg-gradient-cta px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                {t("lpMvp.preview.ctaLabel")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div className="animate-float absolute -right-3 -top-3 inline-flex items-center gap-1.5 rounded-full border border-orange/20 bg-card px-3 py-1.5 text-xs font-semibold text-orange-dark shadow-lg">
        <Rocket className="h-3.5 w-3.5" />
        {t("lpMvp.preview.badgeShipped")}
      </div>
      <div className="absolute -bottom-3 left-5 inline-flex items-center gap-1.5 rounded-full border border-secondary/20 bg-card px-3 py-1.5 text-xs font-semibold text-secondary shadow-lg">
        <Check className="h-3.5 w-3.5 text-accent" />
        {t("lpMvp.preview.badgeGdpr")}
      </div>
    </div>
  );
}
