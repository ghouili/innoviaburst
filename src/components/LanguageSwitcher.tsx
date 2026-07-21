import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Globe } from "lucide-react";
import { DEFAULT_LOCALE, isLocale, localizedPath, type Locale } from "@/lib/i18n-routing";

const LABELS: Record<Locale, { label: string; full: string }> = {
  en: { label: "EN", full: "English" },
  fr: { label: "FR", full: "Français" },
};
// FR on the left, EN on the right (the sliding pill moves right for EN).
const ORDER: Locale[] = ["fr", "en"];

/**
 * Real locale navigation between /en and /fr URLs.
 *
 * The active locale is the router basename; switching locale crosses basenames,
 * so each option is a plain <a> to the SAME page under the other locale prefix
 * — a full navigation that loads the SSG'd /fr (or /en) page with the correct
 * <html lang> + translated content. Works without JS and is crawlable.
 */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const langSeg = (i18n.language || DEFAULT_LOCALE).slice(0, 2);
  const current: Locale = isLocale(langSeg) ? langSeg : DEFAULT_LOCALE;

  // useLocation().pathname is basename-stripped (e.g. "/automations").
  const flatPath = location.pathname || "/";
  const target = (loc: Locale) =>
    `${localizedPath(loc, flatPath)}${location.search || ""}${location.hash || ""}`;

  const isEN = current === "en";

  // Remember an explicit language choice so a later visit to "/" resolves to it
  // (read server-side by the nginx locale-negotiation map). Progressive
  // enhancement: the switch is a real <a> and still works without JS — "/" just
  // falls back to Accept-Language when no cookie is set.
  const remember = (loc: Locale) => {
    document.cookie = `locale=${loc}; path=/; max-age=31536000; samesite=Lax`;
  };

  return (
    <div className="inline-flex items-center gap-1 shrink-0 self-center leading-none">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl">
        <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </span>

      <div
        className="relative inline-flex h-9 w-[92px] items-center rounded-xl border border-border bg-muted/60 p-1 overflow-hidden"
        role="group"
        aria-label={t("languageSwitcher.groupLabel")}
      >
        <span
          aria-hidden="true"
          className={[
            "absolute inset-y-1 start-1 w-[calc(50%-0.25rem)] rounded-lg bg-background shadow-sm",
            "transform transition-transform duration-200 ease-out motion-reduce:transition-none",
            isEN ? "translate-x-full" : "translate-x-0",
          ].join(" ")}
        />
        {ORDER.map((loc) => {
          const active = current === loc;
          return (
            <a
              key={loc}
              href={target(loc)}
              hrefLang={loc}
              lang={loc}
              onClick={() => remember(loc)}
              aria-current={active ? "true" : undefined}
              aria-label={t("languageSwitcher.switchTo", { lang: LABELS[loc].full })}
              className={[
                "relative z-10 flex-1 h-full inline-flex items-center justify-center rounded-lg",
                "text-xs font-semibold no-underline",
                "transition-colors motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {LABELS[loc].label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
