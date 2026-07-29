import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import { Check, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface Track {
  title: string;
  description: string;
  topics: string[];
  outcome?: string;
}

/**
 * The four training tracks as a tabbed explorer rather than four stacked cards.
 *
 * SSG notes:
 * - `defaultValue` is the first track, so the server renders that panel already
 *   selected and the first client render matches it. No effect, no state sync.
 * - Every panel is `forceMount`ed and inactive ones are hidden with
 *   `data-[state=inactive]:hidden`, so all four tracks and all sixteen topics
 *   are in the pre-rendered HTML. Radix drops its `hidden` attribute under
 *   forceMount, hence the CSS hide rather than relying on the attribute.
 *
 * Mobile keeps a single horizontally scrollable chip row (never four stacked
 * panels): the trigger list scrolls, the panel below swaps.
 */
export function TrackExplorer({ tracks, icons }: { tracks: Track[]; icons: LucideIcon[] }) {
  const { t } = useTranslation();
  if (!Array.isArray(tracks) || tracks.length === 0) return null;

  const valueOf = (i: number) => `track-${i}`;

  return (
    <Tabs defaultValue={valueOf(0)} className="w-full">
      {/* Scroll container is the wrapper, so the focus ring on a trigger is
          never clipped by the scroller itself. */}
      <div className="-mx-4 px-4 pb-1 overflow-x-auto lg:mx-0 lg:px-0 lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TabsList
          aria-label={t("trainingPage.tracks.tablistLabel")}
          className="inline-flex h-auto w-max gap-2 bg-transparent p-0 lg:grid lg:w-full lg:grid-cols-4"
        >
          {tracks.map((track, i) => {
            const Icon = icons[i] ?? Check;
            // Governance is the accent track, matching the hero visual.
            const isAccent = i === tracks.length - 1;
            return (
              <TabsTrigger
                key={track.title}
                value={valueOf(i)}
                className="group flex min-h-[44px] shrink-0 items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-muted-foreground data-[state=active]:border-secondary data-[state=active]:bg-secondary/10 data-[state=active]:text-foreground data-[state=active]:shadow-none lg:justify-start"
              >
                <span
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isAccent
                      ? "bg-muted group-data-[state=active]:bg-gradient-cta"
                      : "bg-muted group-data-[state=active]:bg-gradient-blue"
                  }`}
                >
                  <Icon
                    className="h-4 w-4 text-muted-foreground group-data-[state=active]:text-primary-foreground"
                    aria-hidden="true"
                  />
                </span>
                <span className="whitespace-nowrap lg:whitespace-normal lg:text-left">{track.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      {tracks.map((track, i) => (
        <TabsContent
          key={track.title}
          value={valueOf(i)}
          forceMount
          className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card data-[state=inactive]:hidden lg:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-foreground">{track.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{track.description}</p>

              {track.outcome && (
                <div className="mt-5 flex items-start gap-3 rounded-xl bg-accent/10 p-4">
                  <Target className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-foreground">
                    <span className="font-semibold">{t("trainingPage.tracks.outcomeLabel")}: </span>
                    {track.outcome}
                  </p>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {t("trainingPage.tracks.topicsLabel")}
              </p>
              <ul className="mt-3 space-y-2.5">
                {track.topics.map((topic) => (
                  <li key={topic} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
