import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CALENDLY_ORIGIN = "https://calendly.com";

/**
 * How long to wait for the frame before declaring it dead. A tracker blocker
 * usually does NOT fire `onerror` — it lets the request hang or returns an
 * empty document — so `onError` alone would leave the user staring at a blank
 * bordered box forever.
 */
const LOAD_TIMEOUT_MS = 8000;

interface CalendlyEmbedProps {
  /** Bare scheduling link, e.g. https://calendly.com/innoviaburst/15min */
  url: string;
  /** Fired when the invitee has actually booked a slot. */
  onScheduled?: () => void;
  className?: string;
}

/**
 * Inline Calendly scheduler.
 *
 * Deliberately a plain iframe rather than Calendly's widget.js: the booking
 * page is the same either way, but this ships no third-party script into our
 * origin, needs no CSP allowance, and unmounts cleanly. Calendly still posts
 * `calendly.event_scheduled` to the parent window, so a completed booking is
 * observable without their script — that is what `onScheduled` is wired to.
 */
export function CalendlyEmbed({ url, onScheduled, className }: CalendlyEmbedProps) {
  const { t } = useTranslation();
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  // Kept in a ref so the message listener never needs re-subscribing.
  const onScheduledRef = useRef(onScheduled);
  onScheduledRef.current = onScheduled;

  /**
   * `embed_domain` + `embed_type` are what make Calendly postMessage back to
   * the parent. Without them the frame renders but stays silent, so the
   * booking would never be tracked.
   */
  const embedUrl = useMemo(() => {
    if (typeof window === "undefined") return url;
    try {
      const u = new URL(url);
      u.searchParams.set("embed_domain", window.location.hostname);
      u.searchParams.set("embed_type", "Inline");
      u.searchParams.set("primary_color", "15599E"); // --primary
      u.searchParams.set("text_color", "1D2530"); // --foreground
      u.searchParams.set("background_color", "ffffff"); // --card
      return u.toString();
    } catch {
      // A malformed VITE_BOOKING_URL shouldn't take the modal down.
      return url;
    }
  }, [url]);

  // Completed-booking signal.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== CALENDLY_ORIGIN) return;
      const data = e.data as { event?: string } | null;
      if (data?.event === "calendly.event_scheduled") {
        onScheduledRef.current?.();
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Blocked/hanging frames never fire onError; fail them on a timer instead.
  useEffect(() => {
    if (state !== "loading") return;
    const id = window.setTimeout(() => setState("failed"), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [state]);

  if (state === "failed") {
    return (
      <div
        className={cn(
          "flex flex-col items-start gap-3 rounded-lg border border-border bg-muted/40 p-5",
          className,
        )}
      >
        <div>
          <p className="font-semibold text-foreground">{t("booking.embed.failedTitle")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("booking.embed.failedBody")}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="hero" size="sm" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {t("booking.embed.openDirect")}
              <ExternalLink className="ms-2 h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="mailto:hello@innoviaburst.com">{t("booking.embed.emailInstead")}</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {state === "loading" && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg border border-border bg-muted/30"
          role="status"
        >
          <span className="text-sm text-muted-foreground">{t("booking.embed.loading")}</span>
        </div>
      )}
      <iframe
        src={embedUrl}
        title={t("booking.embed.title")}
        // Calendly copies add-to-calendar links to the clipboard.
        allow="clipboard-write"
        referrerPolicy="strict-origin-when-cross-origin"
        className="h-full w-full rounded-lg border border-border"
        onLoad={() => setState("ready")}
        onError={() => setState("failed")}
      />
    </div>
  );
}
